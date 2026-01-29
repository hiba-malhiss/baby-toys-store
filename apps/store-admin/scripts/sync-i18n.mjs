#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const srcDir = path.join(root, 'src');
const enJsonPath = path.join(srcDir, 'locales', 'en', 'common.json');

/** Utility: read JSON safely */
function readJson(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to read JSON: ${file}:`, e.message);
    process.exitCode = 1;
    return {};
  }
}

/** Utility: write JSON pretty */
function writeJson(file, obj) {
  const data = JSON.stringify(obj, null, 2) + '\n';
  fs.writeFileSync(file, data, 'utf8');
}

/** Walk directory recursively */
function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      yield full;
    }
  }
}

/** Extract translation keys from file content */
function extractKeys(content) {
  const keys = new Set();
  // t('key') or t("key") or t(`key`)
  const r1 = /(^|[^\w])t\(\s*['"`]([\w\-.:]+)['"`]\s*\)/g;
  // i18n.t('key')
  const r2 = /i18n\.t\(\s*['"`]([\w\-.:]+)['"`]\s*\)/g;
  // <Trans i18nKey="key">
  const r3 = /<Trans[^>]*?i18nKey=\s*['"`]([\w\-.:]+)['"`]/g;

  let m;
  while ((m = r1.exec(content))) keys.add(m[2]);
  while ((m = r2.exec(content))) keys.add(m[1]);
  while ((m = r3.exec(content))) keys.add(m[1]);

  // Normalize to default namespace 'common' (strip explicit 'common:')
  return Array.from(keys).map((k) => (k.startsWith('common:') ? k.slice('common:'.length) : k));
}

/** Set nested path if missing */
function setPathIfMissing(obj, pathStr, value) {
  const parts = pathStr.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i === parts.length - 1) {
      if (cur[p] === undefined) cur[p] = value;
    } else {
      if (typeof cur[p] !== 'object' || cur[p] === null) cur[p] = {};
      cur = cur[p];
    }
  }
}

function startCase(s) {
  const last = s.split('.').pop() || s;
  return last
    .replace(/[-_.]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function main() {
  if (!fs.existsSync(enJsonPath)) {
    console.error(`English locale not found at ${enJsonPath}`);
    process.exit(1);
  }

  const enObj = readJson(enJsonPath);
  const found = new Set();

  for (const file of walk(srcDir)) {
    const content = fs.readFileSync(file, 'utf8');
    for (const k of extractKeys(content)) {
      // ignore namespaced keys that are not 'common'
      if (k.includes(':')) continue;
      found.add(k);
    }
  }

  const missing = [];
  for (const key of Array.from(found).sort()) {
    const parts = key.split('.');
    // check presence
    let cur = enObj;
    let exists = true;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        exists = false;
        break;
      }
    }
    if (!exists) missing.push(key);
  }

  for (const key of missing) {
    setPathIfMissing(enObj, key, startCase(key));
  }

  if (missing.length > 0) {
    writeJson(enJsonPath, enObj);
    console.log(`Added ${missing.length} missing key(s) to en/common.json`);
    for (const k of missing) console.log(`  + ${k}`);
  } else {
    console.log('No missing keys. en/common.json is up to date.');
  }
}

main();
