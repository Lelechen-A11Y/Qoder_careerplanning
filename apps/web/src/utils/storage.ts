export function saveData<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined') return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch { return false; }
}
export function getData<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value) as T;
  } catch { return fallback; }
}
export function removeData(key: string): void {
  try { if (typeof window !== 'undefined') window.localStorage.removeItem(key); } catch { /* 内存状态仍可使用 */ }
}
