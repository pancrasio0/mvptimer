import { LOCAL_STORAGE_OFFLINE_KILLS_KEY } from '@/constants';
import { getPlayerName } from '@/lib/supabase';

function loadAll(): IKill[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_OFFLINE_KILLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(kills: IKill[]) {
  localStorage.setItem(LOCAL_STORAGE_OFFLINE_KILLS_KEY, JSON.stringify(kills));
}

export function loadKills(): IKill[] {
  return loadAll();
}

export function upsertKill(
  mvpId: number,
  deathMap: string,
  deathTime: string,
  deathPosition: IMapMark | null
) {
  const kills = loadAll();
  const idx = kills.findIndex(
    (k) => k.mvp_id === mvpId && k.death_map === deathMap
  );
  const entry: IKill = {
    mvp_id: mvpId,
    death_map: deathMap,
    death_time: deathTime,
    death_position: deathPosition,
    killed_by: '',
    killed_by_name: getPlayerName(),
  };
  if (idx >= 0) {
    kills[idx] = entry;
  } else {
    kills.push(entry);
  }
  saveAll(kills);
}

export function updateKillTime(mvpId: number, deathMap: string, deathTime: string) {
  const kills = loadAll();
  const kill = kills.find(
    (k) => k.mvp_id === mvpId && k.death_map === deathMap
  );
  if (kill) {
    kill.death_time = deathTime;
    kill.killed_by_name = getPlayerName();
    saveAll(kills);
  }
}

export function deleteKill(mvpId: number, deathMap: string) {
  const kills = loadAll().filter(
    (k) => !(k.mvp_id === mvpId && k.death_map === deathMap)
  );
  saveAll(kills);
}
