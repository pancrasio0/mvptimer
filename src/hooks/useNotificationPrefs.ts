import { useCallback, useSyncExternalStore } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

const STORAGE_KEY = 'notificationPrefs';

export function notifKey(mvpId: number, map?: string): string {
  return map ? `${mvpId}-${map}` : `${mvpId}`;
}

function loadPrefs(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

let cachedPrefs: Record<string, boolean> | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Record<string, boolean> {
  if (!cachedPrefs) {
    cachedPrefs = loadPrefs();
  }
  return cachedPrefs;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function emitChange() {
  cachedPrefs = null;
  listeners.forEach((cb) => cb());
}

function persistPrefs(prefs: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  emitChange();
}

export function useNotificationPrefs() {
  const { isOnline } = useSettings();
  const prefs = useSyncExternalStore(subscribe, getSnapshot);

  const toggle = useCallback((key: string) => {
    const current = getSnapshot();
    persistPrefs({ ...current, [key]: !current[key] });
  }, []);

  const has = useCallback(
    (key: string) => prefs[key] ?? !isOnline,
    [prefs, isOnline]
  );

  return { toggle, has };
}
