// One-off image optimizer. Recompresses heavy raster assets in place,
// keeping the same filename and format so no markup/CSS reference changes.
// Only overwrites a file when the result is actually smaller.
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/assets';
const MIN_BYTES = 200 * 1024; // only touch files over 200 KB
const KEEP = new Set(['frame-192.webp']); // hero poster — leave untouched

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function optimize(file) {
  const ext = extname(file).toLowerCase();
  const name = file.split(/[\\/]/).pop();
  if (KEEP.has(name)) return null;

  const before = (await stat(file)).size;
  if (before < MIN_BYTES) return null;

  const input = await readFile(file);
  let pipeline = sharp(input).rotate();
  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 85, effort: 10 });
  } else {
    return null;
  }

  const out = await pipeline.toBuffer();
  if (out.length >= before) return { file, before, after: before, saved: 0 };
  await writeFile(file, out);
  return { file, before, after: out.length, saved: before - out.length };
}

const results = [];
for await (const file of walk(ROOT)) {
  const r = await optimize(file);
  if (r) results.push(r);
}

const k = (n) => `${Math.round(n / 1024)}K`;
let totalSaved = 0;
for (const r of results.sort((a, b) => b.saved - a.saved)) {
  if (r.saved > 0) console.log(`${k(r.before)} -> ${k(r.after)}  (-${k(r.saved)})  ${r.file}`);
  totalSaved += r.saved;
}
console.log(`\nTOTAL SAVED: ${(totalSaved / 1024 / 1024).toFixed(2)} MB across ${results.filter((r) => r.saved > 0).length} files`);
