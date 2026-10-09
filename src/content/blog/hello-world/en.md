---
title: 'Expensive Data'
description: 'My AI Learning Notes'
pubDate: 2026-10-9
draft: false
---

> Code is cheap, show me the data!

I spent a week vibe coding a hobby project. It's niche: the whole category has only about ten thousand products.

The code was light; data collection was the heavy part. There's no industry database or data standard, just two open-source datasets that aren't good enough. So I used them as seeds and searched for more reliable data.

Reliability comes from cross-checking multiple sources, which means many searches and page reads per record. It's a research task that needs an agent to schedule, judge and decide.

Opus's first plan was to collect data through the Claude API. Testing burned $10 in five minutes. From then on, 99% of the effort went into cost control. I tried five approaches.

#### Collect on my subscription quota

Not instantly, but the 5-hour quota was gone in about ten minutes. On reflection, a subscription can't be an order of magnitude cheaper than the API. I should have looked at the cost structure first.

#### Replace search with a script

I asked Opus to explain its approach and cut the cost. It found that Shopify's API returns rough data for most products, and wrote a script to replace search. The results still needed checking, so costs fell, but not enough to ignore.

#### Replace paid models with a local one

I ran Qwen 27B on my MacBook Pro (M5 Max, 36 GB). It works, but slowly, at about 10 tokens/s. It also can't search. I tried modsearch, which wasn't good enough, but along the way I found Antigravity.

#### Use Antigravity as the collection agent

Calling the agy CLI from modsearch hit permission issues I didn't want to fight, so I ran Gemini inside Antigravity on tasks Opus had defined. Too slow, Google. A 5-minute task for Sonnet took Gemini over half an hour. It's in my Google AI subscription, so in theory I could lean on the free quota, but the speed ruled it out.

The slowness meant I couldn't have Claude check its results in real time. Collecting and validating data is hard, and models will make mistakes, which is why I wanted a "third-party" model to check. But that loop has to run constantly: the collector was too slow, the two models couldn't talk directly, and the reviewer kept needing my decisions.

#### Use DeepSeek, faster and cheaper, as the collection agent

I set up DeepSeek Harness with DeepSeek V41 Flash. Fast, cheap, and so far the quality is good.

The project is still going, and I'm excited!
