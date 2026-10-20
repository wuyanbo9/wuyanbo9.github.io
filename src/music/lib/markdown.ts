import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

export function markdown(text: string): string {
  return marked.parse(text, { async: false }) as string;
}
