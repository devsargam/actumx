const RAW_KEYS_STORAGE_KEY = "x402-dashboard-raw-keys";

function safeParse(value: string | null): Record<string, string> {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, string>;
    }
  } catch {
    return {};
  }

  return {};
}

export function getRawKeys(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  return safeParse(window.localStorage.getItem(RAW_KEYS_STORAGE_KEY));
}

export function setRawKey(apiKeyId: string, rawKey: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const current = getRawKeys();
  current[apiKeyId] = rawKey;
  window.localStorage.setItem(RAW_KEYS_STORAGE_KEY, JSON.stringify(current));
}

export function clearRawKeys(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(RAW_KEYS_STORAGE_KEY);
}
