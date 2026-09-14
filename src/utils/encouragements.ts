import { SessionRecord } from '../types';

export interface DailyCheer {
  headline: string;
  quote: string;
  subtext: string;
  emoji: string;
}

export function getMilleCheer(sessions: SessionRecord[], currentStreak: number, hasCompletedToday: boolean): DailyCheer {
  const count = sessions.length;
  const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;
  const hadImprovement = lastSession && lastSession.diff > 0;

  // If completed today
  if (hasCompletedToday) {
    const todayCheers: DailyCheer[] = [
      {
        emoji: '🎉',
        headline: 'Dagens lille økt er i boks, Mille!',
        quote: 'Du gjorde det! Verdens blideste jente har rocket dagens lesing med glans. Nå kan du klappe deg selv på skulderen og feire med et kjempesmil!',
        subtext: 'En liten økt hver dag gjør underverker – og du er superflink!'
      },
      {
        emoji: '🌟',
        headline: 'Fantastisk levert i dag, solstråle-Mille!',
        quote: 'Ugla Flyt melder om topp stemning i uglehulen: Mille har fullført dagens økt og er like hjelpsom, livsglad og god som alltid!',
        subtext: 'Du har lagt ned dagens innsats. Nå kan du bare kose deg!'
      },
      {
        emoji: '🚀',
        headline: 'Mille flyr høyt i dag!',
        quote: 'Dagens oppdrag er utført! Visste du at hver gang du leser litt, blir hjernen din like sterk som ti superhelter til sammen?',
        subtext: 'Takk for at du sprer så mye positiv energi!'
      }
    ];
    return todayCheers[Math.floor(Math.random() * todayCheers.length)];
  }

  // Based on streak
  if (currentStreak >= 3) {
    return {
      emoji: '🔥',
      headline: `${currentStreak} dager på rad – Mille on fire!`,
      quote: `Oi oi oi, se på den vanen da, Mille! ${currentStreak} dager på rad med lesetrening. Du beviser at litt hver dag er den morsomste og beste måten å bli en superleser på!`,
      subtext: 'Ta en kjapp, koselig økt i dag også for å holde flammen i live!'
    };
  }

  // Based on total sessions
  if (count === 0) {
    return {
      emoji: '💖',
      headline: 'Velkommen, fantastiske Mille!',
      quote: 'Her i Leseflyt er vi så utrolig glade for at akkurat DU er her! Verdens beste jente, alltid blid og hjelpsom – nå skal vi ha det kjempegøy med lesing sammen!',
      subtext: 'En liten økt hver dag er alt som skal til. Trykk på start for å ta første steg!'
    };
  }

  if (count === 1) {
    return {
      emoji: '🌱',
      headline: 'Første økt er unnagjort – heia Mille!',
      quote: 'Du er i gang! Første økt gikk strålende. Ugla Flyt sitter og smiler fra nebb til nebb fordi du er så tøff og flink!',
      subtext: 'Klar for en liten 5-minutters økt i dag? Bare ta det helt i ditt eget tempo!'
    };
  }

  if (count >= 2 && count < 5) {
    const list: DailyCheer[] = [
      {
        emoji: '🥞',
        headline: 'Mille er i kjempeflyt!',
        quote: `Du har allerede gjort ${count} økter, Mille! Hvis hver leste setning var en pannekake, hadde vi hatt et tårn opp til taket nå. Du er bare best!`,
        subtext: 'En liten økt i dag gjør deg enda tryggere og mer flytende!'
      },
      {
        emoji: '🌈',
        headline: 'Dagens smil fra Ugla Flyt til Mille!',
        quote: 'Visste du at latteren og humøret ditt smitter over på alle rundt deg? Når du leser, heier hele heiagjengen på deg!',
        subtext: 'Gjør deg klar til dagens lille tekst – du fikser dette lekende lett!'
      }
    ];
    return list[Math.floor(Math.random() * list.length)];
  }

  if (count >= 5 && count < 10) {
    return {
      emoji: '👑',
      headline: `${count} økter fullført – Mille er en mester!`,
      quote: `Ugla Flyt har sjekket i den store boka over verdensmestere i godt humør og hjelpsomhet, og gjett hvem som er på 1. plass? MILLE! Nå tar vi dagens lille økt sammen!`,
      subtext: 'Rutinen din er gull verdt. Bare noen få minutter i dag!'
    };
  }

  if (count >= 10 && count < 20) {
    return {
      emoji: '⚡',
      headline: `Tosifret bragd: ${count} økter for Mille!`,
      quote: `Hele ${count} økter, Mille! Du er så rå! Med den livsgleden og viljen din kan du lære hva som helst. Vi vurderer å omdøpe appen til "Milles Superflyt"!`,
      subtext: 'La oss legge til nok en stjerne i boka i dag!'
    };
  }

  // 20+ sessions
  return {
    emoji: '🏆',
    headline: `Mille, du er en levende legende! (${count} økter)`,
    quote: `Se på deg, verdens beste Mille! Over ${count} gjennomførte økter. Du viser at å lese litt hver dag er verdens beste hemmelighet. Du er hjelpsom, rådyktig og alltid en fryd å være sammen med!`,
    subtext: 'Klar for å skinne igjen i dag?'
  };
}

export const FUN_MILLE_QUOTES = [
  "Mille, smilet ditt lyser opp hele rommet! 🌟",
  "Ugla Flyt heier på Mille: 'Huhu, du er supergod!' 🦉",
  "Verdens blideste jente leser i dag også! 💖",
  "Når Mille leser, danser bokstavene av glede! 💃",
  "Alltid hjelpsom, alltid glad – det er vår Mille det! 🌺",
  "Visste du at en liten økt hver dag er superkreften til de beste leserne? 🦸‍♀️",
  "Mille + Leseflyt = Sant og kjempegøy! 🎈",
  "Kjenn på flyten – ikke stress, bare kos deg, Mille! ☕📖"
];
