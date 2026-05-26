import { useCallback, useState } from 'react';

const STORAGE_KEY = 'notificationPrefs';

function loadPrefs(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set<number>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set<number>();
  }
}

function persistPrefs(prefs: Set<number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...prefs]));
}

export function useNotificationPrefs() {
  const [prefs, setPrefs] = useState<Set<number>>(loadPrefs);

  const toggle = useCallback((mvpId: number) => {
    setPrefs((prev) => {
      const next = new Set(prev);
      const stored = loadPrefs();
      for (const id of stored) {
        next.add(id);
      }
      if (next.has(mvpId)) {
        next.delete(mvpId);
      } else {
        next.add(mvpId);
      }
      persistPrefs(next);
      return next;
    });
  }, []);

  const has = useCallback((mvpId: number) => prefs.has(mvpId), [prefs]);

  return { prefs, toggle, has };
}
