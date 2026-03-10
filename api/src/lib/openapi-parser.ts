type ParsedEndpoint = {
  method: string;
  path: string;
  priceCents: number;
};

const VALID_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export function parseOpenApiSpec(raw: string): ParsedEndpoint[] {
  const spec = JSON.parse(raw);
  const paths: Record<string, Record<string, unknown>> = spec.paths ?? {};
  const results: ParsedEndpoint[] = [];

  for (const [path, methods] of Object.entries(paths)) {
    const normalizedPath = path.replace(/\{([^}]+)\}/g, ":$1");

    for (const method of Object.keys(methods)) {
      const upper = method.toUpperCase();
      if (!VALID_METHODS.includes(upper)) continue;

      results.push({
        method: upper,
        path: normalizedPath,
        priceCents: 0,
      });
    }
  }

  return results;
}
