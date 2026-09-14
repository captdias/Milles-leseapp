import { SessionRecord } from '../types';

export interface DailyCheer {
  headline: string;
  quote: string;
  subtext: string;
  emoji: string;
}

export function getMilleCheer(
  sessions: SessionRecord[], 
  currentStreak: number, 
  hasCompletedToday: boolean,
  userName: string = 'Mille'
): DailyCheer {
  const name = userName.trim() || 'Mille';
  const count = sessions.length;

  // If completed today
  if (hasCompletedToday) {
    const todayCheers: DailyCheer[] = [
      {
        emoji: '🎉',
        headline: `Dagens lille økt er i boks, ${name}!`,
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
        emoji: '🚀',
        headline: `${name} flyr høyt i dag!`,
        quote: `Dagens oppdrag er utført! Visste du at hver gang du leser litt, blir hjernen din like sterk som ti superhelter til sammen?`,
        subtext: 'Takk for at du sprer så mye positiv energi!'
      }
    ];
    return todayCheers[Math.floor(Math.random() * todayCheers.length)];
  }

  // Based on streak
  if (currentStreak >= 3) {
    return {
      emoji: '🔥',
      headline: `${currentStreak} dager på rad – ${name} on fire!`,
      quote: `Oi oi oi, se på den vanen da, ${name}! ${currentStreak} dager på rad med lesetrening. Du beviser at litt hver dag er den morsomste og beste måten å bli en superleser på!`,
      subtext: 'Ta en kjapp, koselig økt i dag også for å holde flammen i live!'
    };
  }

  // Based on total sessions
  if (count === 0) {
    return {
      emoji: '💖',
      headline: `Velkommen, fantastiske ${name}!`,
      quote: `Her i Leseflyt er vi så utrolig glade for at akkurat DU er her! Verdens beste jente, alltid blid og hjelpsom – nå skal vi ha det kjempegøy med lesing sammen!`,
      subtext: 'En liten økt hver dag er alt som skal til. Trykk på start for å ta første steg!'
    };
  }

  if (count === 1) {
    return {
      emoji: '🌱',
      headline: `Første økt er unnagjort – heia ${name}!`,
      quote: `Du er i gang! Første økt gikk strålende. Ugla Flyt sitter og smiler fra nebb til nebb fordi du er så tøff og flink!`,
      subtext: 'Klar for en liten 5-minutters økt i dag? Bare ta det helt i ditt eget tempo!'
    };
  }

  if (count >= 2 && count < 5) {
    const list: DailyCheer[] = [
      {
        emoji: '🥞',
        headline: `${name} er i kjempeflyt!`,
        quote: `Du har allerede gjort ${count} økter, ${name}! Hvis hver leste setning var en pannekake, hadde vi hatt et tårn opp til taket nå. Du er bare best!`,
        subtext: 'En liten økt i dag gjør deg enda tryggere og mer flytende!'
      },
      {
        emoji: '🌈',
        headline: `Dagens smil fra Ugla Flyt til ${name}!`,
        quote: `Visste du at latteren og humøret ditt smitter over på alle rundt deg? Når du leser, heier hele heiagjengen på deg!`,
        subtext: 'Gjør deg klar til dagens lille tekst – du fikser dette lekende lett!'
      }
    ];
    return list[Math.floor(Math.random() * list.length)];
  }

  if (count >= 5 && count < 10) {
    return {
      emoji: '👑',
      headline: `${count} økter fullført – ${name} er en mester!`,
      quote: `Ugla Flyt har sjekket i den store boka over verdensmestere i godt humør og hjelpsomhet, og gjett hvem som er på 1. plass? ${name.toUpperCase()}! Nå tar vi dagens lille økt sammen!`,
      subtext: 'Rutinen din er gull verdt. Bare noen få minutter i dag!'
    };
  }

  if (count >= 10 && count < 20) {
    return {
      emoji: '⚡',
      headline: `Tosifret bragd: ${count} økter for ${name}!`,
      quote: `Hele ${count} økter, ${name}! Du er så rå! Med den livsgleden og viljen din kan du lære hva som helst. Vi vurderer å omdøpe appen til "${name}s Superflyt"!`,
      subtext: 'La oss legge til nok en stjerne i boka i dag!'
    };
  }

  // 20+ sessions
  return {
    emoji: '🏆',
    headline: `${name}, du er en levende legende! (${count} økter)`,
    quote: `Se på deg, verdens beste ${name}! Over ${count} gjennomførte økter. Du viser at å lese litt hver dag er verdens beste hemmelighet. Du er hjelpsom, rådyktig og alltid en fryd å være sammen med!`,
    subtext: 'Klar for å skinne igjen i dag?'
  };
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
