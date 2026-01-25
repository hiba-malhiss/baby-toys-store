export type JsonValue = any;

export type ChangeType = 'added' | 'removed' | 'updated' | 'type-changed';

export type JsonChange = {
  path: string;          // e.g. "order.status" or "items[0].price"
  type: ChangeType;
  before: JsonValue;
  after: JsonValue;
};

export function safeParseJson(raw?: string | null): { ok: boolean; value: any; error?: string }{
  if(!raw) return { ok: true, value: null };
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch(e: any) {
    return { ok: false, value: raw, error: e?.message || 'Invalid JSON' };
  }
}

export function isPrimitive(v: any){
  return v === null || v === undefined || typeof v !== 'object';
}

export function toPath(parent: string, key: string | number){
  if(typeof key === 'number') return `${parent}[${key}]`;
  return parent ? `${parent}.${key}` : key;
}

export function summarizeValue(v: any){
  if(v === undefined) return '—';
  if(v === null) return 'null';
  if(typeof v === 'string') return v.length > 80 ? `${v.slice(0, 80)}…` : v;
  if(typeof v === 'number' || typeof v === 'boolean') return String(v);
  try {
    const s = JSON.stringify(v);
    return s.length > 120 ? `${s.slice(0, 120)}…` : s;
  } catch {
    return String(v);
  }
}

export function valueType(v: any){
  if(Array.isArray(v)) return 'array';
  if(v === null) return 'null';
  return typeof v;
}

/**
 * Structural JSON diff: returns a flat list of changed paths.
 * - Detects added/removed/updated/type-changed
 * - Stops once it reaches maxChanges to prevent UI overload
 */
export function diffJson(before: any, after: any, maxChanges: number): { changes: JsonChange[]; truncated: boolean }{
  const changes: JsonChange[] = [];
  let truncated = false;

  const push = (c: JsonChange) => {
    if(changes.length >= maxChanges) {
      truncated = true;
      return;
    }
    changes.push(c);
  };

  const walk = (b: any, a: any, path: string) => {
    if(truncated) return;

    // same reference or strictly equal
    if(b === a) return;

    const tb = valueType(b);
    const ta = valueType(a);

    // added / removed
    if(b === undefined && a !== undefined) {
      push({ path, type: 'added', before: undefined, after: a });
      return;
    }
    if(b !== undefined && a === undefined) {
      push({ path, type: 'removed', before: b, after: undefined });
      return;
    }

    // type changed
    if(tb !== ta) {
      push({ path, type: 'type-changed', before: b, after: a });
      return;
    }

    // primitives updated
    if(isPrimitive(b) || isPrimitive(a)) {
      push({ path, type: 'updated', before: b, after: a });
      return;
    }

    // arrays
    if(Array.isArray(b) && Array.isArray(a)) {
      const maxLen = Math.max(b.length, a.length);
      for(let i = 0; i < maxLen; i++) {
        walk(b[i], a[i], toPath(path, i));
        if(truncated) return;
      }
      return;
    }

    // objects
    const bKeys = b ? Object.keys(b) : [];
    const aKeys = a ? Object.keys(a) : [];
    const keys = new Set<string>([...bKeys, ...aKeys]);
    for(const k of keys) {
      walk(b?.[k], a?.[k], toPath(path, k));
      if(truncated) return;
    }
  };

  walk(before, after, '');
  // drop empty path (root) if it appears
  const normalized = changes
    .filter((c) => c.path !== '')
    .map((c) => ({ ...c, path: c.path || '(root)' }));

  return { changes: normalized, truncated };
}
