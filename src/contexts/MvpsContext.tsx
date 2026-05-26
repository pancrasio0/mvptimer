import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import dayjs from 'dayjs';

import type { RealtimeChannel } from '@supabase/supabase-js';

import { useSettings } from './SettingsContext';

import { supabase, initAnonAuth, getPlayerName } from '@/lib/supabase';
import { getMvpRespawnTime, getServerData } from '@/utils';
import { loadKills, upsertKill, updateKillTime, deleteKill } from '@/controllers/mvp';

interface MvpProviderProps {
  children: ReactNode;
}

interface MvpsContextData {
  activeMvps: IMvp[];
  allMvps: IMvp[];
  editingMvp: IMvp | undefined;
  isLoading: boolean;
  resetMvpTimer: (mvp: IMvp) => void;
  killMvp: (mvp: IMvp, time?: Date | null) => void;
  removeMvpByMap: (mvpID: number, deathMap: string) => void;
  setEditingMvp: (mvp: IMvp) => void;
  closeEditMvpModal: () => void;
}

export const MvpsContext = createContext({} as MvpsContextData);

export function MvpProvider({ children }: MvpProviderProps) {
  const { server } = useSettings();

  const [isLoading, setIsLoading] = useState(true);
  const [editingMvp, setEditingMvp] = useState<IMvp>();
  const [activeMvps, setActiveMvps] = useState<IMvp[]>([]);
  const [allMvps, setAllMvps] = useState<IMvp[]>([]);
  const [kills, setKills] = useState<IKill[]>([]);

  useEffect(() => {
    let channel: RealtimeChannel;

    async function init() {
      await initAnonAuth();

      const existingKills = await loadKills();
      setKills(existingKills);

      channel = supabase
        .channel('kills')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'kills' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setKills((prev) => [...prev, payload.new as IKill]);
            } else if (payload.eventType === 'UPDATE') {
              setKills((prev) =>
                prev.map((k) =>
                  k.id === (payload.new as IKill).id ? (payload.new as IKill) : k
                )
              );
            } else if (payload.eventType === 'DELETE') {
              setKills((prev) =>
                prev.filter((k) => k.id !== (payload.old as IKill).id)
              );
            }
          }
        )
        .subscribe();

      setIsLoading(false);
    }

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    async function hydrate() {
      if (isLoading) return;

      if (kills.length === 0) {
        setActiveMvps([]);
        return;
      }

      const mvpData = await getServerData(server);

      const hydrated = kills
        .map((k) => {
          const mvp = mvpData.find((m) => m.id === k.mvp_id);
          if (!mvp) return null;
          return {
            ...mvp,
            deathTime: new Date(k.death_time),
            deathMap: k.death_map,
            deathPosition: k.death_position ?? undefined,
            killedBy: k.killed_by_name || undefined,
          };
        })
        .filter(Boolean) as IMvp[];

      hydrated.sort((a, b) => {
        const aTime = dayjs(a.deathTime).add(getMvpRespawnTime(a), 'ms');
        const bTime = dayjs(b.deathTime).add(getMvpRespawnTime(b), 'ms');
        return aTime.diff(bTime);
      });

      setActiveMvps(hydrated);
    }

    hydrate();
  }, [kills, server, isLoading]);

  useEffect(() => {
    if (isLoading) return;

    async function filterAllMvps() {
      const originalServerData = await getServerData(server);
      const activeSpawns = activeMvps.map((m) => m.deathMap);
      const activeIds = activeMvps.map((m) => m.id);

      const filteredAllMvps = originalServerData
        .map((mvp) => {
          const isActive = activeIds.includes(mvp.id);
          if (!isActive) return mvp;

          return {
            ...mvp,
            spawn: mvp.spawn.filter(
              (spawn) => !activeSpawns.includes(spawn.mapname)
            ),
          };
        })
        .filter((mvp) => mvp.spawn.length > 0);

      setAllMvps(filteredAllMvps);
    }

    filterAllMvps();
  }, [isLoading, activeMvps, server]);

  const killMvp = useCallback(
    async (mvp: IMvp, deathTime?: Date | null) => {
      const time = (deathTime || new Date()).toISOString();
      const name = getPlayerName();
      await upsertKill(mvp.id, mvp.deathMap!, time, mvp.deathPosition ?? null);

      setKills((prev) => {
        const filtered = prev.filter(
          (k) => !(k.mvp_id === mvp.id && k.death_map === mvp.deathMap)
        );
        return [
          ...filtered,
          {
            mvp_id: mvp.id,
            death_map: mvp.deathMap!,
            death_time: time,
            death_position: mvp.deathPosition ?? null,
            killed_by: '',
            killed_by_name: name,
          } as IKill,
        ];
      });
    },
    []
  );

  const resetMvpTimer = useCallback(async (mvp: IMvp) => {
    const time = new Date().toISOString();
    await updateKillTime(mvp.id, mvp.deathMap!, time);

    setKills((prev) =>
      prev.map((k) =>
        k.mvp_id === mvp.id && k.death_map === mvp.deathMap
          ? { ...k, death_time: time }
          : k
      )
    );
  }, []);

  const removeMvpByMap = useCallback(
    async (mvpID: number, deathMap: string) => {
      await deleteKill(mvpID, deathMap);

      setKills((prev) =>
        prev.filter((k) => !(k.mvp_id === mvpID && k.death_map === deathMap))
      );
    },
    []
  );

  const closeEditMvpModal = useCallback(() => setEditingMvp(undefined), []);

  return (
    <MvpsContext.Provider
      value={{
        activeMvps,
        allMvps,
        editingMvp,
        killMvp,
        resetMvpTimer,
        removeMvpByMap,
        setEditingMvp,
        closeEditMvpModal,
        isLoading,
      }}
    >
      {children}
    </MvpsContext.Provider>
  );
}

export function useMvpsContext() {
  const context = useContext(MvpsContext);
  if (!context) {
    throw new Error('useMvpsContext must be used within a MvpProvider');
  }
  return context;
}
