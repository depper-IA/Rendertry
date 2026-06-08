// Audits globals.css for duplicate selectors. Tracks brace depth and the current
// @media context so a selector repeated inside different media queries is NOT
// flagged, but the same selector declared twice in the same scope IS.
import { readFile } from 'node:fs/promises';

const css = await readFile('src/app/globals.css', 'utf8');

// Strip comments so they don't confuse brace counting, but preserve newlines
// inside them so reported line numbers stay accurate.
const clean = css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

const lines = clean.split('\n');
let depth = 0;
const mediaStack = []; // active @media/@supports conditions by depth
const seen = new Map(); // "context::selector" -> [lineNumbers]

let lineNo = 0;
let buffer = '';
let bufferStartLine = 0;

for (const raw of lines) {
  lineNo++;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === '{') {
      const header = buffer.trim();
      buffer = '';
      if (header.startsWith('@media') || header.startsWith('@supports') || header.startsWith('@keyframes')) {
        mediaStack.push({ depth, cond: header });
        depth++;
      } else if (header) {
        const context = mediaStack.map((m) => m.cond).join(' >> ') || 'TOP';
        // split grouped selectors "a, b, c" into individual keys
        for (const sel of header.split(',')) {
          const s = sel.trim().replace(/\s+/g, ' ');
          if (!s) continue;
          const key = `${context}::${s}`;
          if (!seen.has(key)) seen.set(key, []);
          seen.get(key).push(bufferStartLine || lineNo);
        }
        depth++;
      } else {
        depth++;
      }
    } else if (ch === '}') {
      depth--;
      if (mediaStack.length && mediaStack[mediaStack.length - 1].depth === depth) {
        mediaStack.pop();
      }
      buffer = '';
    } else {
      if (buffer === '') bufferStartLine = lineNo;
      buffer += ch;
    }
  }
  buffer += '\n';
}

const dups = [...seen.entries()].filter(([, l]) => l.length > 1);
dups.sort((a, b) => b[1].length - a[1].length);

if (!dups.length) {
  console.log('No duplicate selectors in the same scope.');
} else {
  console.log(`DUPLICATE SELECTORS (same scope), ${dups.length} found:\n`);
  for (const [key, l] of dups) {
    const [ctx, sel] = key.split('::');
    const where = ctx === 'TOP' ? 'top-level' : ctx;
    console.log(`  x${l.length}  ${sel}   [${where}]   lines: ${l.join(', ')}`);
  }
}
