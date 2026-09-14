import { SessionRecord } from '../types';

export interface DailyCheer {
  headline: string;
  quote: string;
  subtext: string;
  emoji: string;
}

export function getAllCheersPool(
  sessions: SessionRecord[], 
  currentStreak: number, 
  hasCompletedToday: boolean,
  userName: string = 'Mille'
): DailyCheer[] {
  const name = userName.trim() || 'Mille';
  const count = sessions.length;

  const cheers: DailyCheer[] = [
    {
      emoji: '💖',
      headline: `Heia verdens beste ${name}!`,
      quote: `Smilet ditt, det gode humøret og den hjelpsomme energien din gjør hele dagen lysere. Nå skal vi kose oss med lesing!`,
      subtext: 'Litt hver dag er superkreften til god flyt!'
    },
    {
      emoji: '🦉',
      headline: `Ugla Flyt hilser til ${name}!`,
      quote: `Huhu! Ugla Flyt har pusset brillene sine og heier alt hun kan: «Du er så modig og flink som øver på lesing!»`,
      subtext: 'Bli med inn i bokas verden – helt i ditt eget tempo!'
    },
    {
      emoji: '🥞',
      headline: `Pannekakerekord for ${name}!`,
      quote: `Hvis hvert ord du leste var en nystekt pannekake med syltetøy, hadde vi hatt et tårn helt opp til skyene nå!`,
      subtext: 'Det er bare å nyte hver eneste setning!'
    },
    {
      emoji: '🌈',
      headline: `Dagens solstråle: ${name}!`,
      quote: `Visste du at latteren din smitter over på alle rundt deg? Når du leser, heier hele heiagjengen på deg!`,
      subtext: 'Gjør deg klar til dagens tekst – du fikser dette lekende lett!'
    },
    {
      emoji: '🚀',
      headline: `Superleser ${name} gjør seg klar!`,
      quote: `Hver gang du leser to runder, bygger hjernen din nye super-motorveier for ord. Du blir raskere og tryggere for hver eneste gang!`,
      subtext: 'Repetert lesing er den hemmelige nøkkelen til suksess!'
    },
    {
      emoji: '⭐',
      headline: `Stjerneleser ${name}!`,
      quote: `Du trenger ikke lese fortest i hele verden – det aller viktigste er å ha det gøy, leve seg inn i teksten og gjøre sitt beste!`,
      subtext: 'Gode lesere er de som tør å prøve!'
    },
    {
      emoji: '🌺',
      headline: `Blid, omtenksom og rågod!`,
      quote: `Du er ikke bare en super leser, ${name} – du er også verdens snilleste og mest hjelpsomme jente! Det gjør deg til en ekte helt.`,
      subtext: 'Ugla Flyt gir deg ti av ti tomler opp!'
    },
    {
      emoji: '☕📖',
      headline: `Tid for kosestund, ${name}!`,
      quote: `Pust med magen, senk skuldrene og finn en god sittestilling. Lesing er som en liten reise i hodet der du bestemmer farten selv.`,
      subtext: 'Nyt roen og historiene vi skal oppleve sammen!'
    },
    {
      emoji: '⚡',
      headline: `Ren magi med bokstavene!`,
      quote: `Når du åpner en tekst, våkner figurene og ordene til liv. Med fantasien din kan du oppleve de utroligste eventyr!`,
      subtext: 'Klar for dagens oppdagelsesferd?'
    },
    {
      emoji: '👑',
      headline: `Mesterklasse i innsats!`,
      quote: `Mestere blir ikke født ferdige – de øver litt og litt hver dag. Og akkurat det er du verdensmester i, ${name}!`,
      subtext: 'Ugla Flyt klapper med vingene av beundring!'
    },
    {
      emoji: '🎈',
      headline: `Leseglede på høygir!`,
      quote: `Ingen dager er helt like, men en ting er sikkert: Med et smil og litt nysgjerrighet blir lesestunden alltid en fest!`,
      subtext: 'Ta det med ro og kos deg med ordene!'
    },
    {
      emoji: '🦁',
      headline: `Modig som en løve!`,
      quote: `Vanskelige ord kan virke litt skumle med en gang, men når du møter dem i runde 2, kjenner du dem igjen som gamle venner!`,
      subtext: 'Runde 1 viser vei, runde 2 gir flyt!'
    }
  ];

  if (hasCompletedToday) {
    cheers.unshift(
      {
        emoji: '🎉',
        headline: `Dagens økt er i boks, ${name}!`,
        quote: `Du gjorde det! Verdens blideste jente har rocket dagens lesing med glans. Nå kan du klappe deg selv på skulderen og feire med et kjempesmil!`,
        subtext: 'En liten økt hver dag gjør underverker – og du er superflink!'
      },
      {
        emoji: '🌟',
        headline: `Fantastisk levert i dag, solstråle-${name}!`,
        quote: `Ugla Flyt melder om topp stemning i uglehulen: ${name} har fullført dagens økt og er like hjelpsom, livsglad og god som alltid!`,
        subtext: 'Du har lagt ned dagens innsats. Nå kan du bare kose deg!'
      },
      {
        emoji: '🏆',
        headline: `${name} flyr høyt i dag!`,
        quote: `Dagens oppdrag er utført! Visste du at hver gang du leser litt, blir hjernen din like sterk som ti superhelter til sammen?`,
        subtext: 'Takk for at du sprer så mye positiv energi!'
      }
    );
  }

  if (currentStreak >= 2) {
    cheers.unshift({
      emoji: '🔥',
      headline: `${currentStreak} dager på rad – ${name} on fire!`,
      quote: `Oi oi oi, se på den vanen da, ${name}! ${currentStreak} dager på rad med lesetrening. Du beviser at litt hver dag er den morsomste og beste måten å bli en superleser på!`,
      subtext: 'Ta en kjapp, koselig økt i dag også for å holde flammen i live!'
    });
  }

  if (count >= 5) {
    cheers.unshift({
      emoji: '🏅',
      headline: `${count} økter gjennomført – heia ${name}!`,
      quote: `Tenk at du allerede har samlet ${count} fulle leseøkter! Du viser at stødig innsats og godt humør knuser alle utfordringer.`,
      subtext: 'Vi er så stolte av deg!'
    });
  }

  return cheers;
}

export function getMilleCheer(
  sessions: SessionRecord[], 
  currentStreak: number, 
  hasCompletedToday: boolean,
  userName: string = 'Mille',
  excludeHeadline?: string
): DailyCheer {
  const pool = getAllCheersPool(sessions, currentStreak, hasCompletedToday, userName);
  const filtered = excludeHeadline ? pool.filter(c => c.headline !== excludeHeadline) : pool;
  const candidates = filtered.length > 0 ? filtered : pool;
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

export function getMilleQuotes(userName: string = 'Mille'): string[] {
  const name = userName.trim() || 'Mille';
  return [
    `${name}, smilet ditt lyser opp hele rommet! 🌟`,
    `Ugla Flyt heier på ${name}: 'Huhu, du er supergod!' 🦉`,
    `Verdens blideste jente leser i dag også! 💖`,
    `Når ${name} leser, danser bokstavene av glede! 💃`,
    `Alltid hjelpsom, alltid glad – det er vår ${name} det! 🌺`,
    `Visste du at en liten økt hver dag er superkreften til de beste leserne? 🦸‍♀️`,
    `${name} + Leseflyt = Sant og kjempegøy! 🎈`,
    `Kjenn på flyten – ikke stress, bare kos deg, ${name}! ☕📖`
  ];
}

export const FUN_MILLE_QUOTES = getMilleQuotes('Mille');

