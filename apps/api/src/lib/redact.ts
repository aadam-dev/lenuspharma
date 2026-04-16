/** Redact sensitive substrings from logs and error messages. */
const PATTERNS: RegExp[] = [
  /sk_(live|test)_[a-zA-Z0-9]+/gi,
  /Bearer\s+[a-zA-Z0-9._-]+/gi,
  /password["']?\s*[:=]\s*["'][^"']{3,}["']/gi,
];

export function redactString(input: string): string {
  let out = input;
  for (const re of PATTERNS) {
    out = out.replace(re, "[REDACTED]");
  }
  return out;
}

export function redactUnknown(value: unknown): unknown {
  if (typeof value === "string") return redactString(value);
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const o = value as Record<string, unknown>;
    const clone: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(o)) {
      const key = k.toLowerCase();
      if (
        key.includes("password") ||
        key.includes("secret") ||
        key.includes("authorization") ||
        key.includes("token")
      ) {
        clone[k] = "[REDACTED]";
      } else {
        clone[k] = redactUnknown(v);
      }
    }
    return clone;
  }
  if (Array.isArray(value)) return value.map(redactUnknown);
  return value;
}
