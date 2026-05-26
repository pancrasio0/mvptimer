import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function initAnonAuth() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) console.error('Anon auth error:', error.message);
  return data;
}

const PLAYER_NAME_KEY = 'playerName';

export function getPlayerName(): string {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) || '';
  } catch {
    return '';
  }
}

export function setPlayerName(name: string) {
  localStorage.setItem(PLAYER_NAME_KEY, name);
}
