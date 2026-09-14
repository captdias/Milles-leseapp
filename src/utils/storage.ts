import { BadgeDef, LevelInfo, SessionRecord, UserSettings } from '../types';

const STORAGE_KEY_SESSIONS = 'leseflyt_sessions_v5';
const STORAGE_KEY_POINTS = 'leseflyt_points_v5';
const STORAGE_KEY_PRAISE = 'leseflyt_praise_v5';
const STORAGE_KEY_SETTINGS = 'leseflyt_settings_v5';

// Memory fallback if localStorage is blocked/unavailable
let memoryStore: Record<string, string> = {};

function safeGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (err) {
    console.warn(`LocalStorage read failed for ${key}, using in-memory store:`, err);
  }
  return memoryStore[key] || null;
}

function safeSet(key: string, value: string): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return true;
    }
  } catch (err) {
    console.warn(`LocalStorage write failed for ${key}, falling back to memory:`, err);
  }
  memoryStore[key] = value;
  return true;
}

export const LEVELS: LevelInfo[] = [
  { name: 'Spire', title: 'Oppdageren', min: 0, max: 49, color: 'from-amber-400 to-amber-600', badge: '🌱' },
  { name: 'På vei', title: 'Stødig leser', min: 50, max: 119, color: 'from-blue-400 to-indigo-600', badge: '🚀' },
  { name: 'God flyt', title: 'Flytmesteren', min: 120, max: 219, color: 'from-teal-400 to-emerald-600', badge: '🌊' },
  { name: 'Fokus', title: 'Superfokusert', min: 220, max: 349, color: 'from-purple-400 to-violet-600', badge: '⚡' },
  { name: 'Driv', title: 'Fartsfenomen', min: 350, max: 519, color: 'from-pink-400 to-rose-600', badge: '🔥' },
  { name: 'Momentum', title: 'Lesechampion', min: 520, max: 749, color: 'from-orange-400 to-amber-600', badge: '🏆' },
  { name: 'Mesterflyt', title: 'Legende', min: 750, max: 999999, color: 'from-indigo-500 via-purple-500 to-pink-500', badge: '👑' }
];

export const BADGE_DEFINITIONS: BadgeDef[] = [
  {
    id: 'first',
    icon: '✨',
    name: 'Første steg',
    desc: 'Fullfør din aller første leseøkt.',
    category: 'innsats',
    test: (s) => s.length >= 1
  },
  {
    id: 'daily_habit',
    icon: '🔥',
    name: 'Dagsrutine',
    desc: 'Les minst to dager på rad – litt hver dag er superkreften!',
    category: 'rutine',
    test: (s) => calculateStreak(s) >= 2
  },
  {
    id: 'three',
    icon: '🥉',
    name: 'Godt i gang',
    desc: 'Fullfør tre leseøkter.',
    category: 'innsats',
    test: (s) => s.length >= 3
  },
  {
    id: 'mille_sunshine',
    icon: '💖',
    name: 'Verdens beste jente',
    desc: 'Viser ekte leseglede og sprer smil i lesestunden.',
    category: 'mestring',
    test: (s) => s.length >= 2
  },
  {
    id: 'week_goal',
    icon: '🎯',
    name: 'Ukesmål',
    desc: 'Gjennomfør minst 3 økter i samme uke.',
    category: 'rutine',
    test: (s) => calculateSessionsThisWeek(s) >= 3
  },
  {
    id: 'super_week',
    icon: '⭐',
    name: 'Superuke',
    desc: 'Fullfør 5 økter i samme uke.',
    category: 'rutine',
    test: (s) => calculateSessionsThisWeek(s) >= 5
  },
  {
    id: 'variety',
    icon: '📚',
    name: 'Bokorm',
    desc: 'Les både faktatekster og skjønnlitteratur.',
    category: 'variasjon',
    test: (s) => new Set(s.map(x => x.type)).size >= 2
  },
  {
    id: 'themes',
    icon: '🧭',
    name: 'Eventyrer',
    desc: 'Utforsk tekster fra minst fire forskjellige temaer.',
    category: 'variasjon',
    test: (s) => new Set(s.map(x => x.topic)).size >= 4
  },
  {
    id: 'ten_sessions',
    icon: '🏅',
    name: 'Stødig innsats',
    desc: 'Fullfør ti fulle leseøkter.',
    category: 'innsats',
    test: (s) => s.length >= 10
  },
  {
    id: 'progress',
    icon: '🚀',
    name: 'Fart og flyt',
    desc: 'Oppnå høyere fart i 2. runde i minst 5 økter.',
    category: 'mestring',
    test: (s) => s.filter(x => x.r2 > x.r1).length >= 5
  },
  {
    id: 'double_boost',
    icon: '⚡',
    name: 'Kjempehopp',
    desc: 'Øk med 15 eller flere ord/minutt fra runde 1 til runde 2.',
    category: 'mestring',
    test: (s) => s.some(x => (x.r2 - x.r1) >= 15)
  },
  {
    id: 'century',
    icon: '💯',
    name: 'Hundreklubben',
    desc: 'Nå 100 ord per minutt i en økt.',
    category: 'mestring',
    test: (s) => s.some(x => x.r2 >= 100 || x.r1 >= 100)
  }
];

export const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Mille',
  soundEnabled: true,
  rulerEnabled: false,
  fontSize: 'medium',
  dyslexicFont: false,
  ttsSpeed: 1.0,
  theme: 'nordic'
};

export function loadSettings(): UserSettings {
  try {
    const raw = safeGet(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to parse settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  safeSet(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

// Initial migration and load of sessions
export function loadSessions(): SessionRecord[] {
  try {
    // Check new format first
    const rawNew = safeGet(STORAGE_KEY_SESSIONS);
    if (rawNew) {
      const parsed = JSON.parse(rawNew);
      if (Array.isArray(parsed)) return parsed;
    }

    // Check old format (leseflytDataV4) for seamless migration!
    const rawOld = safeGet('leseflytDataV4');
    if (rawOld) {
      const parsedOld = JSON.parse(rawOld);
      if (Array.isArray(parsedOld)) {
        const migrated: SessionRecord[] = parsedOld.map((item, idx) => ({
          id: 'migrated_' + idx + '_' + (item.date || Date.now()),
          date: item.date || new Date().toISOString(),
          title: item.title || 'Leseøkt ' + (idx + 1),
          type: item.type || 'fact',
          topic: item.topic || 'nature',
          target: item.target || 110,
          r1: Number(item.r1) || 0,
          r2: Number(item.r2) || 0,
          points: Number(item.points) || 10,
          diff: (Number(item.r2) || 0) - (Number(item.r1) || 0)
        }));
        saveSessions(migrated);
        return migrated;
      }
    }
  } catch (err) {
    console.error('Failed to load sessions from storage:', err);
  }
  return [];
}

export function saveSessions(sessions: SessionRecord[]): boolean {
  return safeSet(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
}

export function loadPoints(): number {
  try {
    const rawNew = safeGet(STORAGE_KEY_POINTS);
    if (rawNew !== null && !isNaN(Number(rawNew))) {
      return Number(rawNew);
    }
    // Migration check
    const rawOld = safeGet('leseflytPointsV4');
    if (rawOld !== null && !isNaN(Number(rawOld))) {
      const pts = Number(rawOld);
      safeSet(STORAGE_KEY_POINTS, String(pts));
      return pts;
    }
  } catch (err) {
    console.error('Failed to load points:', err);
  }
  return 0;
}

export function savePoints(points: number): boolean {
  return safeSet(STORAGE_KEY_POINTS, String(points));
}

export function loadPraise(): string {
  try {
    const praise = safeGet(STORAGE_KEY_PRAISE) || safeGet('leseflytPraiseV4');
    if (praise) return praise;
  } catch (err) {
    console.error('Failed to load praise:', err);
  }
  return 'Det viktigste er at du møter opp, har det gøy og gjør ditt beste!';
}

export function savePraise(praise: string): boolean {
  return safeSet(STORAGE_KEY_PRAISE, praise);
}

export function hasCompletedToday(sessions: SessionRecord[]): boolean {
  if (!sessions || sessions.length === 0) return false;
  const todayStr = new Date().toISOString().slice(0, 10);
  return sessions.some(s => {
    try {
      return s.date && s.date.slice(0, 10) === todayStr;
    } catch {
      return false;
    }
  });
}

export function calculateStreak(sessions: SessionRecord[]): number {
  if (!sessions || sessions.length === 0) return 0;

  // Collect unique sorted date strings (YYYY-MM-DD)
  const uniqueDates = Array.from(
    new Set(
      sessions
        .map(s => {
          try {
            return s.date ? s.date.slice(0, 10) : '';
          } catch {
            return '';
          }
        })
        .filter(Boolean)
    )
  ).sort().reverse();

  if (uniqueDates.length === 0) return 0;

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  // If latest is neither today nor yesterday, streak is broken
  const latestDate = uniqueDates[0];
  if (latestDate !== todayStr && latestDate !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(latestDate);

  for (const dStr of uniqueDates) {
    const expectedStr = checkDate.toISOString().slice(0, 10);
    if (dStr === expectedStr) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (dStr < expectedStr) {
      break;
    }
  }

  return streak;
}

export interface DayStatus {
  dayIndex: number;
  dayName: string;
  shortName: string;
  dateStr: string;
  isToday: boolean;
  isPast: boolean;
  completed: boolean;
}

export function getWeekDaysStatus(sessions: SessionRecord[]): DayStatus[] {
  const dayNames = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
  const shortNames = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];
  
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // 0 for Monday, 6 for Sunday
  
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - dayOfWeek);

  const completedDateStrings = new Set(
    sessions.map(s => {
      try {
        return s.date ? s.date.slice(0, 10) : '';
      } catch {
        return '';
      }
    })
  );

  return dayNames.map((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);

    return {
      dayIndex: i,
      dayName: name,
      shortName: shortNames[i],
      dateStr,
      isToday: i === dayOfWeek,
      isPast: i < dayOfWeek,
      completed: completedDateStrings.has(dateStr)
    };
  });
}

export function calculateSessionsThisWeek(sessions: SessionRecord[]): number {
  try {
    const now = new Date();
    // Monday as start of week in Norway
    const day = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - day);

    return sessions.filter(x => {
      try {
        return new Date(x.date) >= monday;
      } catch {
        return false;
      }
    }).length;
  } catch (e) {
    console.error('Error calculating week sessions:', e);
    return 0;
  }
}

export function getLevelForPoints(points: number): LevelInfo {
  const current = LEVELS.find(l => points >= l.min && points <= l.max);
  return current || LEVELS[LEVELS.length - 1];
}

export function getNextLevel(points: number): LevelInfo | null {
  const current = getLevelForPoints(points);
  const idx = LEVELS.indexOf(current);
  if (idx >= 0 && idx < LEVELS.length - 1) {
    return LEVELS[idx + 1];
  }
  return null;
}

export function exportDataAsJson(): string {
  const data = {
    version: 5,
    exportDate: new Date().toISOString(),
    sessions: loadSessions(),
    points: loadPoints(),
    settings: loadSettings(),
    praise: loadPraise()
  };
  return JSON.stringify(data, null, 2);
}

export function importDataFromJson(jsonString: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Ugyldig filformat. Kunne ikke tolke data.' };
    }
    if (Array.isArray(parsed.sessions)) {
      saveSessions(parsed.sessions);
    }
    if (typeof parsed.points === 'number') {
      savePoints(parsed.points);
    }
    if (parsed.settings && typeof parsed.settings === 'object') {
      saveSettings(parsed.settings);
    }
    if (typeof parsed.praise === 'string') {
      savePraise(parsed.praise);
    }
    return { success: true, message: 'Dataene ble importert uten feil!' };
  } catch (err: any) {
    return { success: false, message: `Feil ved import: ${err?.message || 'Ugyldig JSON'}` };
  }
}

export function clearAllData(): void {
  try {
    safeSet(STORAGE_KEY_SESSIONS, JSON.stringify([]));
    safeSet(STORAGE_KEY_POINTS, '0');
    safeSet(STORAGE_KEY_PRAISE, 'Ny start! La oss bygge gode lesevaner.');
  } catch (err) {
    console.error('Failed to clear data:', err);
  }
}
