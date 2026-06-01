import { useCallback, useEffect, useMemo, useState } from 'react';

const VOTE_KEY = 'mvptimer_vote_timestamp';
const VOTE_DURATION_MS = 24 * 60 * 60 * 1000;

export function useVoteTimer() {
  const [voteTimestamp, setVoteTimestamp] = useState<number | null>(() => {
    try {
      const stored = localStorage.getItem(VOTE_KEY);
      if (!stored) return null;
      const ts = parseInt(stored, 10);
      return isNaN(ts) ? null : ts;
    } catch {
      return null;
    }
  });

  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsed = voteTimestamp !== null ? now - voteTimestamp : 0;
  const remaining = Math.max(0, VOTE_DURATION_MS - elapsed);
  const canVote = remaining <= 0;

  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    if (!canVote || notificationSent) return;
    setNotificationSent(true);

    const permissionGranted = 'Notification' in window && Notification.permission === 'granted';
    if (!permissionGranted) return;

    new Notification('Vote Timer', {
      body: 'Ya puedes votar de nuevo!',
    });

    const audio = new Audio('notification.mp3');
    audio.volume = 0.2;
    audio.play();
  }, [canVote, notificationSent]);

  const formattedRemaining = useMemo(() => {
    if (remaining <= 0) return null;
    const totalSec = Math.floor(remaining / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [remaining]);

  const vote = useCallback(() => {
    const ts = Date.now();
    localStorage.setItem(VOTE_KEY, String(ts));
    setVoteTimestamp(ts);
    setNotificationSent(false);
  }, []);

  return { canVote, formattedRemaining, vote };
}
