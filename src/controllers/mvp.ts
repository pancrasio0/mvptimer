import { supabase, getPlayerName } from '@/lib/supabase';

export async function loadKills(): Promise<IKill[]> {
  const { data, error } = await supabase
    .from('kills')
    .select('*');

  if (error) {
    console.error('Failed to load kills', error);
    return [];
  }

  return data || [];
}

export async function upsertKill(
  mvpId: number,
  deathMap: string,
  deathTime: string,
  deathPosition: IMapMark | null
) {
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('kills')
    .upsert({
      mvp_id: mvpId,
      death_map: deathMap,
      death_time: deathTime,
      death_position: deathPosition,
      killed_by: user?.id,
      killed_by_name: getPlayerName(),
    }, {
      onConflict: 'mvp_id, death_map',
    });

  if (error) console.error('Failed to upsert kill', error);
}

export async function updateKillTime(mvpId: number, deathMap: string, deathTime: string) {
  const { error } = await supabase
    .from('kills')
    .update({ death_time: deathTime })
    .match({ mvp_id: mvpId, death_map: deathMap });

  if (error) console.error('Failed to update kill time', error);
}

export async function deleteKill(mvpId: number, deathMap: string) {
  const { error } = await supabase
    .from('kills')
    .delete()
    .match({ mvp_id: mvpId, death_map: deathMap });

  if (error) console.error('Failed to delete kill', error);
}
