import { LOCALES } from '../locales';

export const DEFAULT_THEME = 'light';

export const DEFAULT_LANG = LOCALES.ENGLISH;
export const DEFAULT_SERVER = 'pow4ever';

export const DEFAULT_SETTINGS = {
  respawnAsCountdown: true,
  animatedSprites: false,
  use24HourFormat: true,
  isNotificationSoundEnabled: true,
  language: DEFAULT_LANG,
  server: DEFAULT_SERVER,
  isOnline: true,
};

export const LOCAL_STORAGE_THEME_KEY = 'theme';
export const LOCAL_STORAGE_SETTINGS_KEY = 'settings';
export const LOCAL_STORAGE_ACTIVE_MVPS_KEY = 'activeMvps';

export const SUPPORTED_SERVERS = [
  'pow4ever',
];

export const LOCAL_STORAGE_OFFLINE_KILLS_KEY = 'offlineKills';
