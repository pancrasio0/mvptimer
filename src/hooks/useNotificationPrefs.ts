import { useCallback, useState } from 'react';
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

function persistPrefs(prefs: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function useNotificationPrefs() {
  const { isOnline } = useSettings();
  const [prefs, setPrefs] = useState<Record<string, boolean>>(loadPrefs);

  const toggle = useCallback((key: string) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      persistPrefs(next);
      return next;
    });
  }, []);

  const has = useCallback(
    (key: string) => prefs[key] ?? !isOnline,
    [prefs, isOnline]
  );

  return { toggle, has };
}
