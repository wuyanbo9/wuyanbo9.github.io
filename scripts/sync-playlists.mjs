import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data');
const statePath = path.join(dataDir, 'state.json');
const configPath = path.join(dataDir, 'playlists.json');
const inboxDir = path.join(dataDir, 'inbox');
const snapshotDir = path.join(dataDir, 'snapshots');

const isBaseline = process.argv.includes('--baseline');

function localDate(date = new Date()) {
  return new Intl.DateTimeFormat('sv-SE').format(date);
}

function extractPageData(html) {
  const match = html.match(
    /<script[^>]*id="serialized-server-data"[^>]*>([\s\S]*?)<\/script>/,
  );
  if (!match) throw new Error('找不到 Apple Music 页面数据');
  const payload = JSON.parse(match[1]);
  return payload?.data?.[0]?.data;
}

function artworkUrl(template, size = 600) {
  if (!template) return null;
  return template
    .replace('{w}x{h}', `${size}x${size}`)
    .replace('{w}', String(size))
    .replace('{h}', String(size))
    .replace('{f}', 'jpg');
}

function firstArtist(track) {
  const artistLink = track.subtitleLinks?.find((link) =>
    link.segue?.destination?.contentDescriptor?.identifiers?.storeAdamID,
  );
  return {
    name: track.artistName || artistLink?.title || '未知艺人',
    id:
      artistLink?.segue?.destination?.contentDescriptor?.identifiers
        ?.storeAdamID || null,
    url: artistLink?.segue?.destination?.contentDescriptor?.url || null,
  };
}

function normalizeTrack(track, playlist) {
  const artist = firstArtist(track);
  const album = track.tertiaryLinks?.[0];
  const songId =
    track.contentDescriptor?.identifiers?.storeAdamID ||
    track.id?.match(/(\d+)$/)?.[1];

  return {
    id: String(songId),
    title: track.title,
    artist: artist.name,
    artistId: artist.id ? String(artist.id) : null,
    artistUrl: artist.url,
    album: album?.title || null,
    albumUrl:
      album?.segue?.destination?.contentDescriptor?.url ||
      album?.segue?.destination?.url ||
      null,
    durationMs: track.duration || null,
    explicit: Boolean(track.showExplicitBadge),
    artworkUrl: artworkUrl(track.artwork?.dictionary?.url),
    appleMusicUrl: track.contentDescriptor?.url || null,
    playlistId: playlist.id,
    playlistName: playlist.name,
  };
}

async function fetchPlaylist(playlist) {
  const response = await fetch(playlist.url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml',
    },
  });
  if (!response.ok) {
    throw new Error(`${playlist.name}: HTTP ${response.status}`);
  }

  const page = extractPageData(await response.text());
  const sections = page?.sections || [];
  const header = sections.find(
    (section) => section.itemKind === 'containerDetailHeaderLockup',
  )?.items?.[0];

  const trackItems = sections
    .filter((section) =>
      (section.items || []).some((item) => item.itemKind === 'trackLockup' || item.title)
    )
    .flatMap((section) =>
      (section.items || []).filter(
        (item) =>
          item.contentDescriptor?.kind === 'song' &&
          item.contentDescriptor?.identifiers?.storeAdamID,
      ),
    );

  const tracks = trackItems.map((track) => normalizeTrack(track, playlist));

  const artists = new Map();
  for (const section of sections) {
    for (const item of section.items || []) {
      if (item.contentDescriptor?.kind !== 'artist') continue;
      const id = item.contentDescriptor?.identifiers?.storeAdamID;
      if (!id) continue;
      artists.set(String(id), {
        id: String(id),
        name: item.name || item.title,
        url: item.contentDescriptor?.url || null,
        imageUrl: artworkUrl(item.artwork?.dictionary?.url, 600),
      });
    }
  }

  return {
    id: playlist.id,
    name: header?.title || playlist.name,
    url: playlist.url,
    region: playlist.region,
    updatedLabel: header?.quaternaryTitle || null,
    declaredTrackCount: header?.trackCount || null,
    artworkUrl: artworkUrl(header?.artwork?.dictionary?.url, 600),
    tracks,
    artists: [...artists.values()],
  };
}

async function main() {
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  const playlists = config.playlists.filter((playlist) => playlist.url);

  console.log(`读取 ${playlists.length} 个歌单…`);
  const results = [];
  for (const playlist of playlists) {
    process.stdout.write(`  ${playlist.name} … `);
    try {
      const result = await fetchPlaylist(playlist);
      if (
        result.declaredTrackCount &&
        result.declaredTrackCount !== result.tracks.length
      ) {
        console.log(
          `${result.tracks.length}/${result.declaredTrackCount} 首（页面数据不完整，已记录可用部分）`,
        );
      } else {
        console.log(`${result.tracks.length} 首`);
      }
      results.push(result);
    } catch (error) {
      console.log(`失败：${error.message}`);
    }
  }

  if (!results.length) {
    throw new Error('没有成功读取任何歌单');
  }

  const now = new Date();
  const stamp = localDate(now);

  await mkdir(snapshotDir, { recursive: true });
  await writeFile(
    path.join(dataDir, 'playlists.status.json'),
    JSON.stringify(
      {
        syncedAt: now.toISOString(),
        syncedDate: stamp,
        playlists: results.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          url: playlist.url,
          region: playlist.region,
          updatedLabel: playlist.updatedLabel,
          trackCount: playlist.tracks.length,
        })),
      },
      null,
      2,
    ),
  );
  await writeFile(
    path.join(snapshotDir, `${stamp}.json`),
    JSON.stringify(
      { fetchedAt: now.toISOString(), playlists: results },
      null,
      2,
    ),
  );

  let state = null;
  if (existsSync(statePath)) {
    state = JSON.parse(await readFile(statePath, 'utf8'));
  }

  const treatAsBaseline = isBaseline || !state;
  const seenTracks = state?.seenTracks || {};
  const fresh = new Map();

  for (const playlist of results) {
    for (const track of playlist.tracks) {
      if (!treatAsBaseline && !seenTracks[track.id]) {
        const existing = fresh.get(track.id);
        if (existing) {
          existing.sourcePlaylists.push({
            id: playlist.id,
            name: playlist.name,
          });
        } else {
          fresh.set(track.id, {
            ...track,
            sourcePlaylists: [{ id: playlist.id, name: playlist.name }],
            firstSeenAt: now.toISOString(),
          });
        }
      }
      seenTracks[track.id] = seenTracks[track.id] || {
        firstSeenAt: now.toISOString(),
        title: track.title,
        artist: track.artist,
        playlistId: playlist.id,
      };
    }
  }

  const nextState = {
    lastSyncAt: now.toISOString(),
    initializedAt: state?.initializedAt || now.toISOString(),
    seenTracks,
  };
  await writeFile(statePath, JSON.stringify(nextState, null, 2));

  if (treatAsBaseline) {
    console.log(
      `\n基线已建立：${Object.keys(seenTracks).length} 首曲目。下一次同步开始只会报告新增曲目。`,
    );
    return;
  }

  if (!fresh.size) {
    console.log('\n没有发现新增曲目。');
    return;
  }

  await mkdir(inboxDir, { recursive: true });
  const inboxPath = path.join(inboxDir, `${stamp}.json`);
  const tracks = [...fresh.values()];
  await writeFile(
    inboxPath,
    JSON.stringify(
      {
        detectedAt: now.toISOString(),
        playlists: results.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          url: playlist.url,
        })),
        tracks,
      },
      null,
      2,
    ),
  );

  console.log(`\n发现 ${tracks.length} 首新增曲目：`);
  for (const track of tracks) {
    console.log(
      `  ${track.title} — ${track.artist}  [${track.sourcePlaylists.map((playlist) => playlist.name).join(' / ')}]`,
    );
  }
  console.log(`\n已写入 ${path.relative(root, inboxPath)}`);
}

main().catch((error) => {
  console.error(`\n同步失败：${error.message}`);
  process.exit(1);
});
