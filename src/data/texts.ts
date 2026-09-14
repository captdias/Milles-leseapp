import { DifficultyLevel, GeneratedText, TextCategory, TopicKey } from '../types';

export const TOPIC_METADATA: Record<TopicKey, { label: string; icon: string; color: string; desc: string }> = {
  space: {
    label: 'Verdensrommet',
    icon: '🚀',
    color: 'from-blue-500 to-indigo-600',
    desc: 'Planeter, stjerner og universets hemmeligheter'
  },
  nature: {
    label: 'Natur og miljø',
    icon: '🌲',
    color: 'from-emerald-500 to-teal-600',
    desc: 'Trær, fjell, hav og planetens krefter'
  },
  animals: {
    label: 'Dyr og insekter',
    icon: '🦊',
    color: 'from-amber-500 to-orange-600',
    desc: 'Bier, rever, hunder og ville dyr'
  },
  body: {
    label: 'Kroppen og hjernen',
    icon: '🧠',
    color: 'from-rose-500 to-pink-600',
    desc: 'Muskler, sanser og hvordan vi tenker'
  },
  history: {
    label: 'Historie og oppdagelser',
    icon: '⚔️',
    color: 'from-amber-600 to-yellow-700',
    desc: 'Vikinger, gamle gåter og store oppfinnelser'
  },
  tech: {
    label: 'Teknologi og framtid',
    icon: '🤖',
    color: 'from-cyan-500 to-blue-600',
    desc: 'Roboter, koder og hvordan datamaskiner virker'
  },
  mystery: {
    label: 'Mysterier og spenning',
    icon: '🔍',
    color: 'from-purple-500 to-violet-600',
    desc: 'Hemmelige spor, koder og uforklarlige lys'
  },
  everyday: {
    label: 'Hverdag og venner',
    icon: '🎒',
    color: 'from-sky-500 to-teal-500',
    desc: 'Skole, familie, utfordringer og gode valg'
  },
  adventure: {
    label: 'Eventyr og reiser',
    icon: '🧭',
    color: 'from-teal-500 to-emerald-600',
    desc: 'Skattekart, ukjente stier og spennende ferder'
  }
};

export const FACT_SEEDS: Record<TopicKey, [string, string][]> = {
  space: [
    [
      "Hvorfor månen skifter form",
      "Månen lager ikke sitt eget lys. Vi ser den fordi sollys treffer overflaten. Når månen beveger seg rundt jorda, ser vi ulike deler av den opplyste siden. Derfor ser den ut til å skifte form gjennom måneden. Vi kaller dette månefaser. Noen ganger ser vi nesten hele månen, andre ganger bare en smal bue. Selve månen forandrer seg ikke. Det er vinkelen mellom sola, jorda og månen som gjør at den ser forskjellig ut."
    ],
    [
      "Et år på Mars",
      "Mars bruker mye lengre tid enn jorda på én runde rundt sola. Derfor varer et år på Mars omtrent 687 jorddøgn. Et døgn på Mars er derimot nesten like langt som et døgn på jorda. Forskere er interessert i Mars fordi planeten en gang hadde mye mer vann enn i dag. Spor etter gamle elver og innsjøer tyder på at forholdene tidligere kan ha vært annerledes."
    ],
    [
      "Stjernenes farger",
      "Når du titter opp på stjernehimmelen, ser stjernene ofte hvite ut. Men stjerner har faktisk mange ulike farger. Fargen forteller oss hvor varme stjernene er. De rødeste stjernene er de kjøligste, selv om de fortsatt er utrolig varme. Blå og hvite stjerner er de aller varmeste. Vår egen sol er en gul stjerne med en temperatur midt i mellom."
    ]
  ],
  nature: [
    [
      "Hvordan trær overlever vinteren",
      "Når dagene blir kortere om høsten, forbereder trærne seg på vinteren. Mange løvtrær slutter å lage det grønne stoffet klorofyll. Da blir andre farger i bladene synlige. Etter hvert faller bladene av. Det gjør at treet mister mindre vann gjennom vinteren. Inne i stammen og røttene lagres energi som treet kan bruke når våren kommer."
    ],
    [
      "Hvorfor regnbuer oppstår",
      "En regnbue dannes når solstråler treffer ørsmå regndråper i lufta. Dråpene virker som bitte små prismer som bøyer og deler det hvite sollyset i ulike farger. Sollyset inneholder nemlig alle regnbuens farger samtidig: rød, oransje, gul, grønn, blå, indigo og fiolett. For å se en regnbue må du ha regnet foran deg og sola i ryggen."
    ]
  ],
  animals: [
    [
      "Hvorfor bier er viktige",
      "Bier flytter pollen fra blomst til blomst når de leter etter nektar. Dette kalles pollinering. Mange planter trenger pollinering for å lage frø og frukt. Derfor er bier viktige både i naturen og for maten vi spiser. Epler, bær og mange grønnsaker er eksempler på planter som har nytte av pollinerende insekter. Hvis det blir færre bier, kan det påvirke både planter, dyr og mennesker."
    ],
    [
      "Uglens fantastiske hørsel",
      "Ugler er eksperter på å jakte i mørket. De har store øyne, men det er hørselen som er deres beste våpen. Øreåpningene på en ugle sitter ikke helt likt plassert på hver side av hodet. Det gjør at lyden når det ene øret en brøkdel av et sekund før det andre. Dermed kan uglen beregne nøyaktig hvor en liten mus beveger seg under snøen."
    ]
  ],
  body: [
    [
      "Hva hjernen gjør når vi lærer",
      "Når vi lærer noe nytt, samarbeider mange områder i hjernen. Nerveceller sender signaler til hverandre, og forbindelser mellom dem kan bli sterkere når vi øver. Derfor blir ting ofte lettere etter flere forsøk. Søvn er også viktig fordi hjernen bearbeider og lagrer informasjon mens vi hviler. Å lære handler altså ikke bare om å prøve én gang, men om å øve, hvile og prøve igjen."
    ],
    [
      "Hvorfor vi blir andpustne",
      "Når vi beveger oss raskt, trenger musklene mer oksygen. Hjertet begynner å slå fortere for å sende mer blod rundt i kroppen, og vi puster raskere for å hente inn mer oksygen. Derfor blir vi andpustne når vi løper eller går fort opp en bakke. Etter at vi stopper, roer kroppen seg gradvis ned igjen."
    ]
  ],
  history: [
    [
      "Hvordan folk sendte beskjeder før mobilen",
      "Før mobiltelefoner og internett måtte beskjeder reise på andre måter. Brev ble fraktet med hest, båt og senere tog. Viktige meldinger kunne ta dager eller uker før de kom fram. Etter hvert kom telegrafen, som gjorde det mulig å sende korte meldinger raskt over lange avstander. Senere kom telefonen, radioen og til slutt digitale meldinger som vi bruker i dag."
    ],
    [
      "Hvorfor vikingskip var spesielle",
      "Vikingskip var bygget slik at de både kunne seile raskt og komme inn på grunt vann. De var lange og smale, og plankene overlappet hverandre. Denne byggemåten gjorde skipene sterke og forholdsvis lette. Seil ga fart når vinden var god, mens årer kunne brukes når vinden manglet. Skipene gjorde det mulig å reise langt langs kysten og over havet."
    ]
  ],
  tech: [
    [
      "Hvordan en søkemotor finner svar",
      "Når du skriver noe i en søkemotor, leter den ikke gjennom hele internett akkurat da. Søkemotoren har allerede samlet informasjon fra enorme mengder nettsider. Den sammenligner ordene du skriver med denne informasjonen og prøver å vise de mest relevante resultatene først. Mange ulike regler avgjør rekkefølgen, blant annet hva siden handler om og hvor nyttig den ser ut til å være."
    ],
    [
      "Hva en algoritme er",
      "En algoritme er en oppskrift på hvordan en oppgave skal løses steg for steg. Vi bruker algoritmer både i dataprogrammer og i hverdagen. En oppskrift på pannekaker kan faktisk sammenlignes med en enkel algoritme: først gjør du én ting, så den neste. I datamaskiner brukes algoritmer til alt fra å sortere bilder til å finne raskeste vei på et kart."
    ]
  ],
  mystery: [
    [
      "Koder og hemmelige skrifter",
      "Gjennom historien har mennesker brukt hemmelige koder for å beskytte viktige beskjeder. Julius Cæsar oppfant en enkel kode der hver bokstav ble byttet ut med en bokstav tre plasser lenger ut i alfabetet. For en som ikke kjenner regelen, ser teksten ut som bare rot. I dag bruker datamaskiner avansert matematisk koding for å passe på passord og meldinger."
    ]
  ],
  everyday: [
    [
      "Hvorfor vi gjesper",
      "De fleste gjesper når de er slitne eller kjeder seg, men forskere er fortsatt ikke helt sikre på hvorfor. En teori er at et gjesp hjelper til med å kjøle ned hjernen med frisk luft. En annen morsom ting med gjesping er at det smitter. Hvis du ser noen andre gjespe, er sjansen stor for at du får lyst til å gjespe selv!"
    ]
  ],
  adventure: [
    [
      "Verdens dypeste havbunn",
      "Marianergropen i Stillehavet er det dypeste stedet på hele kloden. Bunnen ligger nesten elleve kilometer under havoverflaten. Trykket der nede er så enormt at bare spesialbygde ubåter tåler det. Likevel har forskere oppdaget merkelige, gjennomsiktige fisker og krepsdyr som trives i det stummende mørket."
    ]
  ]
};

export const FICTION_SEEDS: Record<TopicKey, [string, string][]> = {
  mystery: [
    [
      "Lyset i vinduet",
      "Emma var sikker på at huset på hjørnet sto tomt. Likevel så hun et lys i andre etasje hver kveld. En tirsdag bestemte hun seg for å gå nærmere. Hun tok med lommelykt og gikk sakte opp innkjørselen. Da hun kom til vinduet, så hun en skygge bevege seg bak gardinen. Hun frøs til. Så åpnet døra seg. En eldre dame sto der og smilte. Hun hadde akkurat flyttet inn, men hadde ennå ikke rukket å henge opp navneskilt."
    ],
    [
      "Den glemte nøkkelen",
      "På vei hjem fant Jonas en liten nøkkel på bakken. Den var gammel og hadde et rødt bånd festet til seg. Han tok den med hjem, men klarte ikke å slutte å tenke på hva den kunne åpne. Dagen etter så han en liten metallboks under benken ved busstoppet. Nøkkelen passet. Inne i boksen lå bare en lapp: Takk for at du fant den. Nå begynner jakten."
    ]
  ],
  everyday: [
    [
      "Den vanskelige starten",
      "Mina hadde bestemt seg for å gjøre leksene med en gang hun kom hjem. Likevel satt hun plutselig med mobilen i hånda. Ti minutter ble til tjue. Til slutt la hun mobilen i gangen og åpnet boka. Hun bestemte seg for bare å jobbe i fem minutter. Da de fem minuttene var gått, var det mye lettere å fortsette. Hun ble overrasket over hvor vanskelig det hadde vært å starte, og hvor greit det var når hun først var i gang."
    ],
    [
      "Bussen som aldri kom",
      "Noah sto på holdeplassen og så på klokka for tredje gang. Bussen skulle ha kommet for ti minutter siden. Rundt ham begynte folk å bli utålmodige. En dame ringte noen og sa at hun kom for sent. Noah vurderte å gå, men det var langt hjem. Da kom det endelig en buss rundt svingen. Alle gjorde seg klare, men bussen kjørte forbi. På skiltet sto det: Ikke i rute."
    ]
  ],
  nature: [
    [
      "Stormen",
      "Det hadde vært stille hele dagen, nesten for stille. Utover kvelden begynte vinden å ta tak i trærne. Familien samlet løse ting fra terrassen og lukket vinduene. Så kom regnet. Det slo hardt mot rutene, og strømmen blinket flere ganger. I mørket fant de fram stearinlys. Det ble plutselig veldig koselig inne i huset, selv om stormen raste utenfor."
    ],
    [
      "Bekken i skogen",
      "Matias fant en liten bekk ingen andre hadde snakket om. Vannet var krystallklart og rant over glatte, runde steiner. Han laget en liten båt av bark og festet et gult lønneblad som seil. Da han satte båten på vannet, suste den av sted med strømmen. Han løp langs bredden for å holde følge med den vesle farkosten."
    ]
  ],
  animals: [
    [
      "Sporet i snøen",
      "Sara oppdaget sporene da hun gikk ut med hunden. De startet ved skogkanten og fortsatte helt bort til boden. Sporene var større enn kattens, men mindre enn hundens. Hun fulgte dem sakte rundt huset. Bak boden fant hun svaret. En rev sto stille og så på henne før den plutselig snudde og forsvant mellom trærne."
    ],
    [
      "Katten som forsvant",
      "Felix var en katt som aldri pleide å være borte lenge. Da han ikke kom inn til middag, lette hele familien i nabolaget. De ropte og ristet med godbitposen, men ingenting skjedde. Først da kvelden kom hørte de et lite mjau fra klesskapet i gangen. Felix hadde sneket seg inn blant vinterjakkene og sovet seg gjennom hele ettermiddagen."
    ]
  ],
  space: [
    [
      "Signalet",
      "Lina satt alene i observatoriet da skjermen blinket. Et signal hadde dukket opp på en frekvens som vanligvis var helt stille. Hun trodde først det var en feil, men signalet kom igjen med nøyaktig samme mellomrom. Hun kalte på læreren. Sammen sjekket de utstyret. Alt virket normalt. Ingen av dem sa det høyt, men begge tenkte det samme: Hvor kom signalet fra?"
    ]
  ],
  adventure: [
    [
      "Kartet på loftet",
      "Kasper rotet i en gammel trekiste på bestefars loft da hånden traff noe rart. Det var et sammenrullet stykke tykt papir med gulnede kanter. Da han brettet det ut, så han et håndtegnet kart over øya der bestefar vokste opp. Et lite rødt kryss var tegnet like ved det gamle fyrtårnet. Under krysset sto tre ord: Søk ved soloppgang."
    ]
  ],
  history: [
    [
      "Mynten i jorda",
      "Under potethøstingen traff spaden noe hardt. Frida bøyde seg ned og børstet bort den fuktige jorda. Det var ikke en stein, men en rund metallplate. Da hun tørket den ren med genseren, skimtet hun et kongelig merke og et årstall fra syttenhundretallet. Hvordan hadde denne mynten havnet under jorden på deres lille gård?"
    ]
  ],
  body: [
    [
      "Det avgjørende sparket",
      "Stillingen var uavgjort og det var bare to minutter igjen av kampen. Tobias kjente hjertet hamre i brystet som en tromme. Ballen spratt mot ham like utenfor sekstenmeteren. Tiden virket som den stoppet opp. Han pustet dypt ut, tok tilløp og traff ballen med innsiden av foten. Et brøl fra tribunen fortalte alt."
    ]
  ],
  tech: [
    [
      "Koden som våknet",
      "Henrik hadde sittet i timevis foran datamaskinen for å programmere sin egen lille robot. Hver gang han trykket start, stoppet figuren opp i hjørnet av skjermen. Til slutt oppdaget han en manglende parentes på linje førtito. Han rettet feilen og trykket enter. På skjermen tok roboten en salto og vinket med armene."
    ]
  ]
};

// Safe word utility functions
export function getWords(text: string): string[] {
  if (!text || typeof text !== 'string') return [];
  return text.trim().split(/\s+/).filter(w => w.length > 0);
}

export function countWords(text: string): number {
  return getWords(text).length;
}

export function trimToTargetWords(text: string, target: number): string {
  const words = getWords(text);
  if (words.length <= target) return text;
  
  const sliced = words.slice(0, target);
  let result = sliced.join(' ');
  // Ensure neat punctuation at end
  if (!/[.!?]$/.test(result)) {
    result = result.replace(/[,;:]$/, '') + '.';
  }
  return result;
}

export function padText(text: string, target: number, type: TextCategory): string {
  const additionsFact = [
    "Dette viser hvordan små detaljer kan forklare større sammenhenger.",
    "Forskere lærer stadig mer når de undersøker slike spørsmål nærmere.",
    "Temaet henger sammen med både natur, teknologi og hverdagen vår.",
    "Det er et godt eksempel på hvordan kunnskap bygges litt etter litt.",
    "Når vi forstår hvordan ting henger sammen, blir verden rundt oss enda mer spennende.",
    "Mange oppdagelser starter med at noen stiller et enkelt spørsmål."
  ];

  const additionsFiction = [
    "Hun ble stående et øyeblikk og tenke over hva hun skulle gjøre videre.",
    "Det var først da hun merket hvor stille det hadde blitt rundt henne.",
    "Hun trakk pusten dypt og bestemte seg for å fortsette med friskt mot.",
    "Resten av dagen tenkte hun flere ganger på det som hadde skjedd.",
    "En god følelse bredte seg i kroppen da hun skjønte at hun klarte det.",
    "Det viste seg at løsningen var mye enklere enn de først hadde trodd."
  ];

  const pool = type === 'fact' ? additionsFact : additionsFiction;
  let result = text;
  let wordCount = countWords(result);
  let index = 0;
  const maxIterations = 20;

  while (wordCount < target - 5 && index < maxIterations) {
    const sentence = pool[index % pool.length];
    result += " " + sentence;
    wordCount = countWords(result);
    index++;
  }

  return trimToTargetWords(result, target);
}

export function adjustDifficulty(text: string, level: DifficultyLevel): string {
  if (!text) return '';
  let adjusted = text;

  if (level === 'easy') {
    adjusted = adjusted
      .replace(/\bimidlertid\b/gi, "men")
      .replace(/\bforholdsvis\b/gi, "ganske")
      .replace(/\bundersøke\b/gi, "se nærmere på")
      .replace(/\bberegne\b/gi, "finne ut")
      .replace(/\btilsvarer\b/gi, "er det samme som")
      .replace(/\btilstrekkelig\b/gi, "nok");
  } else if (level === 'challenge') {
    adjusted = adjusted
      .replace(/\bviktig\b/gi, "betydningsfullt")
      .replace(/\bviser\b/gi, "illustrerer")
      .replace(/\bfantastisk\b/gi, "eksepsjonell")
      .replace(/\braskt\b/gi, "hurtig")
      .replace(/\bhjelper\b/gi, "bidrar til");
  }

  return adjusted;
}

export function generateTextSafely(params: {
  category: 'mixed' | TextCategory;
  topic: 'random' | TopicKey;
  length: number;
  difficulty: DifficultyLevel;
}): GeneratedText {
  try {
    // 1. Resolve type
    const resolvedType: TextCategory = params.category === 'mixed' 
      ? (Math.random() < 0.5 ? 'fact' : 'fiction')
      : params.category;

    // 2. Resolve topic
    const validTopics = Object.keys(TOPIC_METADATA) as TopicKey[];
    let resolvedTopic: TopicKey = params.topic === 'random' 
      ? validTopics[Math.floor(Math.random() * validTopics.length)]
      : params.topic;

    // Fallback if topic is unknown
    if (!validTopics.includes(resolvedTopic)) {
      resolvedTopic = 'nature';
    }

    // 3. Pick seed bank
    const seedBank = resolvedType === 'fact' 
      ? (FACT_SEEDS[resolvedTopic] || FACT_SEEDS.nature)
      : (FICTION_SEEDS[resolvedTopic] || FICTION_SEEDS.nature);

    const safeSeedBank = seedBank && seedBank.length > 0 ? seedBank : FACT_SEEDS.nature;
    const chosenSeed = safeSeedBank[Math.floor(Math.random() * safeSeedBank.length)];

    const title = chosenSeed[0];
    let baseText = chosenSeed[1];

    // 4. Adjust vocabulary for difficulty
    baseText = adjustDifficulty(baseText, params.difficulty);

    // 5. Adjust target word length
    const targetWords = Number(params.length) || 110;
    const finalText = padText(baseText, targetWords, resolvedType);
    const actualWordCount = countWords(finalText);

    return {
      id: 'text_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title,
      text: finalText,
      type: resolvedType,
      topic: resolvedTopic,
      difficulty: params.difficulty,
      targetWords,
      wordCount: actualWordCount
    };
  } catch (err) {
    console.error('Error generating text, returning safe fallback:', err);
    return {
      id: 'fallback_' + Date.now(),
      title: 'Hvorfor bier er viktige',
      text: 'Bier flytter pollen fra blomst til blomst når de leter etter nektar. Dette kalles pollinering. Mange planter trenger pollinering for å lage frø og frukt. Derfor er bier viktige både i naturen og for maten vi spiser. Epler, bær og mange grønnsaker er eksempler på planter som har nytte av pollinerende insekter. Hvis det blir færre bier, kan det påvirke både planter, dyr og mennesker.',
      type: 'fact',
      topic: 'animals',
      difficulty: 'medium',
      targetWords: 110,
      wordCount: 68
    };
  }
}
