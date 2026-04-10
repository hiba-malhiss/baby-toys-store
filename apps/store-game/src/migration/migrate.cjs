const axios = require('axios');
const fs = require('fs');

// =====================
// CONFIG
// =====================
const FILE_PATH = './u361656965_playwithnumber.sql'; // your SQL file
const API_URL = 'http://localhost:8080/api/admin/boards';
const TOKEN =
  'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJoaWJhbWFsaGlzc0BnbWFpbC5jb20iLCJhdXRob3JpdGllcyI6IlJPTEVfQURNSU4iLCJpYXQiOjE3NzU4OTQ0NjUsImV4cCI6MTc3NTg5NTM2NSwidXNlcklkIjoyfQ.mJEH95szlT4d3EelDNS59aHX0gnMVucyqXwm2jc-bLTiLMoT1G8x3A_y4NgxmsoI';
// =====================
// SAFE JSON PARSER
// =====================
function safeParse(val, fallback = []) {
  try {
    if (!val) return fallback;

    let parsed = val;

    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }

    // Handle double-encoded strings
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }

    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    console.warn('⚠️ Failed JSON parse:', String(val).slice(0, 100));
    return fallback;
  }
}

// =====================
// SAFE COLUMN SPLITTER
// =====================
function splitColumns(rowStr) {
  const cols = [];
  let current = '';
  let inString = false;
  let escape = false;

  for (let i = 0; i < rowStr.length; i++) {
    const char = rowStr[i];

    if (escape) {
      current += char;
      escape = false;
      continue;
    }

    if (char === '\\') {
      current += char;
      escape = true;
      continue;
    }

    if (char === "'" && rowStr[i - 1] !== '\\') {
      inString = !inString;
      continue;
    }

    if (char === ',' && !inString) {
      cols.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cols.push(current.trim());

  return cols.map((v) => v.replace(/^'/, '').replace(/'$/, '').replace(/\\"/g, '"'));
}

// =====================
// MAP SQL ROW
// =====================
function mapRow(cols) {
  return {
    id: cols[0],
    name: `${cols[1]} ${cols[2]}`,
    image: cols[2],
    engName: `${cols[3]} ${cols[2]}`,
    cols: Number(cols[4]),
    rows: Number(cols[5]),
    equations: cols[6],
    operationType: cols[7],
    pixels: cols[8],
    level: cols[9],
    hiddenFromPublic: cols[10],
    tags: cols[11],
  };
}

// =====================
// EXTRACT ROWS FROM SQL
// =====================
function extractRowsFromSQL(sql) {
  const insertRegex = /INSERT INTO\s+`pixel-game`[\s\S]*?VALUES\s*([\s\S]*?);/gi;

  const matches = [...sql.matchAll(insertRegex)];
  const rows = [];

  for (const match of matches) {
    const valuesPart = match[1];

    const rowRegex = /\(([\s\S]*?)\)(?=,|$)/g;
    let rowMatch;

    while ((rowMatch = rowRegex.exec(valuesPart)) !== null) {
      const cols = splitColumns(rowMatch[1]);
      const row = mapRow(cols);

      if (!row.pixels || !row.equations) {
        console.warn('⚠️ BAD ROW:', row.id, {
          pixels: row.pixels?.slice(0, 40),
          equations: row.equations?.slice(0, 40),
        });
      }

      rows.push(row);
    }
  }

  return rows;
}

// =====================
// TRANSFORM ROW → API PAYLOAD (new structure)
// =====================
function transformRow(row) {
  const equations = safeParse(row.equations, []);
  const pixels = safeParse(row.pixels, []);

  if (!equations.length) {
    console.warn('❌ EQUATIONS EMPTY:', row.id);
  }

  if (!pixels.length) {
    console.warn('❌ PIXELS EMPTY:', row.id);
  }

  if (!equations.length || !pixels.length) {
    console.warn('⏭️ Skipping row:', row.id);
    return null;
  }

  // Build the colors array from equations.
  // Each equation has: { color: "#hex", value: "2-1" }
  // The new API expects: { id, hex, equation (string), sortOrder }
  const colors = equations.map((eq, index) => ({
    id: `c${index + 1}`,
    hex: eq.color,
    equation: String(eq.value), // equation string e.g. "2-1", "3+4"
    sortOrder: index,
  }));

  // Build a hex → colorId lookup map (lowercase for safe matching).
  const hexToColorId = {};
  for (const c of colors) {
    hexToColorId[c.hex.toLowerCase()] = c.id;
  }

  // Build solution in the NEW format.
  // Each pixel becomes one solution entry with:
  //   cellIndex, splitMode: "none", top: colorId, bottom: colorId
  // (old structure had no splitting — top and bottom are always the same color)
  const solution = [];
  let missingCount = 0;

  pixels.forEach((p, index) => {
    const colorId = hexToColorId[p.color.toLowerCase()] ?? null;

    if (colorId === null) {
      missingCount++;
      console.warn(`⚠️ [row ${row.id}] No colorId for hex "${p.color}" at pixel ${index}`);
    }

    solution.push({
      cellIndex: index,
      splitMode: 'none',
      top: colorId,
      bottom: colorId,
    });
  });

  if (missingCount > 0) {
    console.warn(`⚠️ [row ${row.id}] ${missingCount} pixels had no matching colorId`);
  }

  return {
    isActive: true,
    width: row.cols,
    height: row.rows,

    translations: [
      {
        locale: 'ar',
        name: row.name,
        description: '',
      },
      {
        locale: 'en',
        name: row.engName,
        description: '',
      },
    ],

    colors,
    solution,
  };
}

// =====================
// SEND TO API
// =====================
async function sendBoard(payload, id) {
  try {
    console.log('➡️ Sending:', id);

    await axios.post(API_URL, payload, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Success:', id);
  } catch (err) {
    console.error('❌ Error:', id);
    console.error(err?.response?.data || err.message);
  }
}

// =====================
// MAIN
// =====================
async function run() {
  const sql = fs.readFileSync(FILE_PATH, 'utf-8');

  const rows = extractRowsFromSQL(sql);

  console.log(`📦 Total rows found: ${rows.length}`);

  let success = 0;
  let skipped = 0;

  for (const row of rows) {
    const payload = transformRow(row);

    if (!payload) {
      skipped++;
      continue;
    }

    await sendBoard(payload, row.id);
    success++;
  }

  console.log('\n🎉 DONE');
  console.log('✅ Success:', success);
  console.log('⏭️ Skipped:', skipped);
}

run();
