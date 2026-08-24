/**
 * Uma gravação para cada fotografia da reportagem.
 *
 * A escolha não é ilustrativa: cada faixa é a gravação que o texto ao lado da
 * foto já está citando, ou a que prova o que ele afirma. `West End Blues` está
 * debaixo de Armstrong porque a legenda fala dos doze segundos de abertura;
 * `Scrapple from the Apple` está debaixo de Parker porque é o quinteto de 1947
 * com Miles Davis e Max Roach que a legenda descreve.
 *
 * Os `id` são IDs de faixa do Spotify (22 caracteres, base62 — o trecho final
 * de uma URL `open.spotify.com/track/…`). Todos foram conferidos no endpoint
 * público de oEmbed:
 *
 *     curl "https://open.spotify.com/oembed?url=https://open.spotify.com/track/<id>"
 *
 * Se uma faixa sair do catálogo, o embed mostra o próprio aviso do Spotify e o
 * resto da página continua de pé — mas vale trocar o ID por outra gravação.
 */

export interface Track {
	/** ID da faixa no Spotify. */
	id: string;
	title: string;
	artist: string;
	/** Ano da gravação, não o da reedição que o Spotify costuma exibir. */
	year: string;
	/** Por que *esta* gravação está debaixo *desta* foto. */
	note: { pt: string; en: string };
}

/** Chaveado pelo `src` da `Plate` — o mesmo nome-base do arquivo de imagem. */
export const TRACKS: Record<string, Track> = {
	/* ── I · Trompete ─────────────────────────────────────────────────────── */

	armstrong: {
		id: "1nLZ9HuPCcnFuZVigALB0g",
		title: "West End Blues",
		artist: "Louis Armstrong & His Hot Five",
		year: "1928",
		note: {
			pt: "Os doze segundos de cadência que abrem a gravação — sem acompanhamento, sem compasso marcado, três pistões.",
			en: "The twelve-second unaccompanied cadenza that opens the record — no rhythm section, no bar lines, three valves."
		}
	},
	gillespie: {
		id: "1wZ45ssYu8JB7ynuys2lFD",
		title: "A Night in Tunisia",
		artist: "Dizzy Gillespie",
		year: "1946",
		note: {
			pt: "Gravado no ano anterior à foto, com o trompete ainda reto. A velocidade de frase que obrigou o resto do século a correr atrás.",
			en: "Recorded the year before the photograph, trumpet still straight. The phrasing speed the rest of the century had to chase."
		}
	},
	miles: {
		id: "4vLYewWIvqHfKtJDk8c8tq",
		title: "So What",
		artist: "Miles Davis",
		year: "1959",
		note: {
			pt: "A gravação que a legenda cita: dezesseis compassos numa escala só, e o espaço entre as frases fazendo tanto trabalho quanto elas. Coltrane entra logo depois dele.",
			en: "The record the caption names: sixteen bars on a single scale, the space between the phrases doing as much work as the phrases. Coltrane solos right after him."
		}
	},
	fanfarra: {
		id: "2yp6l4w0OdMBKs1yj75z3v",
		title: "Cisne Branco",
		artist: "Banda da Escola Preparatória de Cadetes do Exército",
		year: "1997",
		note: {
			pt: "O dobrado que toda fanfarra de escola aprende. É esta a música que está saindo da rua de paralelepípedo da foto.",
			en: "The dobrado every Brazilian school band learns. This is what is coming off the cobblestones in the photograph."
		}
	},

	/* ── II · Saxofone ────────────────────────────────────────────────────── */

	hawkins: {
		id: "5bvAFF8k5LFVcqcVOdUUUc",
		title: "Body and Soul",
		artist: "Coleman Hawkins",
		year: "1939",
		note: {
			pt: "A gravação que a legenda cita: dois coros inteiros sem nunca tocar a melodia, e meio milímetro de cana decidindo tudo.",
			en: "The record the caption names: two full choruses without ever stating the melody, decided by half a millimetre of cane."
		}
	},
	parker: {
		id: "7l6Z8GYY00r0sBHMybTcs5",
		title: "Scrapple from the Apple",
		artist: "Charlie Parker Quintet",
		year: "1947",
		note: {
			pt: "O quinteto exato da foto — Parker no alto, Miles Davis, Duke Jordan, Tommy Potter e Max Roach —, gravado em novembro de 1947.",
			en: "The exact quintet in the photograph — Parker on alto, Miles Davis, Duke Jordan, Tommy Potter, Max Roach — cut in November 1947."
		}
	},
	coltrane: {
		id: "5GV0ILBSh0da0iTbQfth5P",
		title: "Giant Steps",
		artist: "John Coltrane",
		year: "1959",
		note: {
			pt: "O disco que ele está recebendo na foto: vinte e seis acordes em dezesseis compassos, a quase 290 batidas por minuto — tudo isso passando pelas sapatilhas do mecanismo.",
			en: "The record he is being handed in the photograph: twenty-six chords in sixteen bars at nearly 290 beats per minute, every one of them going through the pads of the keywork."
		}
	},
	spok: {
		id: "3nKdYvpgcwsdVWytZAh3aH",
		title: "Passo de Anjo (ao vivo)",
		artist: "Spok Frevo Orquestra",
		year: "2008",
		note: {
			pt: "Frevo de rua tocado como quem assume a primeira pessoa: a orquestra de pé, sem estante, e o sax improvisando por cima.",
			en: "Street frevo played in the first person: the orchestra standing, no music stands, the sax improvising on top."
		}
	},

	/* ── III · Trombone ───────────────────────────────────────────────────── */

	teagarden: {
		id: "3CozpaSFygJG3jJcL1zdYj",
		title: "Basin Street Blues",
		artist: "Jack Teagarden",
		year: "1947",
		note: {
			pt: "Ele canta e toca na mesma frase. Ouça sem olhar a letra e tente dizer onde termina a voz e começa a vara.",
			en: "He sings and plays within the same phrase. Listen without reading along and try to say where the voice ends and the slide starts."
		}
	},
	frevo: {
		id: "7FyKjs9DQGolq9rolaLa3f",
		title: "Olinda no Frevo",
		artist: "Maestro Duda e Sua Orquestra",
		year: "1976",
		note: {
			pt: "O rasgo ascendente que abre os arranjos de frevo — o glissando que só o trombone consegue fazer passando por todas as notas do caminho.",
			en: "The rising tear that opens frevo arrangements — the glissando only the trombone can play through every pitch on the way."
		}
	},
	raul: {
		id: "5dqBcqwU3WF7vOi8umwp9J",
		title: "Sweet Lucy",
		artist: "Raul de Souza",
		year: "1977",
		note: {
			pt: "Gravado em Los Angeles com produção de George Duke, no meio dos anos em que ele estava fora do Brasil.",
			en: "Cut in Los Angeles with George Duke producing, in the middle of his years away from Brazil."
		}
	},

	/* ── HONK! ────────────────────────────────────────────────────────────── */

	// Vai na foto de São Paulo, não na de Seattle: é fanfarra brasileira, e a
	// gravação tem de tocar debaixo da imagem que ela descreve.
	"honk-sp-1": {
		id: "1uLsYv7VCMsHndVan70oUD",
		title: "São S P",
		artist: "Filarmônica de Pasárgada",
		year: "2016",
		note: {
			pt: "Fanfarra de rua brasileira do mesmo circuito que o HONK!: sem palco, sem eletricidade, tocando no meio do público.",
			en: "A Brazilian street fanfarra from the same circuit as HONK!: no stage, no electricity, playing inside the crowd."
		}
	}
};

export const trackFor = (plateSrc: string): Track | undefined => TRACKS[plateSrc];
