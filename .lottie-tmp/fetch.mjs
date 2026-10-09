import { execSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const UA = { 'User-Agent': 'Mozilla/5.0' };
const [term, filter = '', limit = '6'] = process.argv.slice(2);
const out = join(import.meta.dirname, term);
mkdirSync(out, { recursive: true });

const list = await (await fetch(`https://lottiefiles.com/free-animations/${term}`, { headers: UA })).text();
const slugs = [...new Set(list.match(/\/free-animation\/[a-z0-9-]+-[A-Za-z0-9]{10}/g) ?? [])]
  .filter((s) => !filter || new RegExp(filter).test(s))
  .slice(0, Number(limit));

const report = [];
for (const slug of slugs) {
  const id = slug.split('/').pop();
  try {
    const page = await (await fetch(`https://lottiefiles.com${slug}`, { headers: UA })).text();
    const lottieUrl = page.match(/https:\/\/assets-v2\.lottiefiles\.com\/a\/[^"\\ ]+\.lottie/)?.[0];
    const thumb = page.match(/"thumbnailUrl":"([^"]+)"/)?.[1];
    const creator = page.match(/"creditText":"([^"]+)"/)?.[1] ?? '';
    if (!lottieUrl) continue;
    const buf = Buffer.from(await (await fetch(lottieUrl)).arrayBuffer());
    const dir = join(out, id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'a.lottie'), buf);
    execSync(`unzip -o -q a.lottie -d x`, { cwd: dir });
    const animDir = join(dir, 'x', 'animations');
    const file = readdirSync(animDir).find((f) => f.endsWith('.json'));
    const json = JSON.parse(readFileSync(join(animDir, file), 'utf8'));
    const images = (json.assets ?? []).filter((a) => a.p && !a.layers).length;
    if (thumb) writeFileSync(join(dir, 'thumb.png'), Buffer.from(await (await fetch(thumb)).arrayBuffer()));
    report.push({ id, slug, creator, kb: Math.round(statSync(join(animDir, file)).size / 1024), images, fr: json.fr, ip: json.ip, op: json.op, w: json.w, h: json.h, json: join(animDir, file) });
  } catch (e) {
    report.push({ id, error: String(e).slice(0, 80) });
  }
}
console.log(JSON.stringify(report, null, 1));
