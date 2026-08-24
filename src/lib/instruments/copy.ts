import type { InstrumentId } from "./types";

/**
 * Todo o texto da reportagem, em pt/en.
 *
 * Fica aqui, e não em `src/translations.js`, porque são dezenas de parágrafos
 * longos específicos desta página — misturá-los ao dicionário global deixaria
 * aquele arquivo impraticável.
 *
 * A narrativa é uma lista de passos. Cada passo carrega o texto *e* o estado do
 * modelo 3D naquele momento: qual instrumento, quanto ele está desmontado, qual
 * peça está em foco e que notas tocar para animar o mecanismo. É isso que
 * amarra a leitura à animação.
 */

export interface Step {
	id: string;
	instrument: InstrumentId;
	/** 0 = montado, 1 = totalmente desmontado. */
	explode: number;
	/** Peça que a câmera enquadra. */
	focus: string | null;
	/** Notas (em altura real) que o mecanismo executa em loop, sem som. */
	notes?: number[];
	rotate?: boolean;
	kicker?: string;
	title?: string;
	body: string[];
	pull?: string;
}

/**
 * Uma foto de página inteira, com o texto que a contextualiza.
 *
 * As imagens vêm do Wikimedia Commons e estão em `static/images/instruments`,
 * em duas larguras (900 e "1600" — o arquivo grande guarda a largura real do
 * original quando ele era menor que isso, por isso `full`).
 */
export interface Plate {
	/** Nome-base do arquivo: `<src>-900.webp`, `<src>-1600.jpg`… */
	src: string;
	/** Largura real do arquivo grande, para o `srcset` não mentir. */
	full: number;
	/** Proporção do recorte na tela (largura ÷ altura). */
	ratio: number;
	/** `object-position` do recorte: onde está o que importa. */
	position?: string;
	alt: string;
	/** Texto que dá contexto à foto. */
	body: string[];
	/** Crédito, na forma exigida pela licença. */
	credit: string;
	/** Página do arquivo no Commons. */
	creditUrl: string;
}

export interface Gallery {
	kicker: string;
	title: string;
	plates: Plate[];
}

export interface Chapter {
	id: InstrumentId;
	numeral: string;
	/** Marcador do capítulo: o comprimento do tubo. */
	marker: string;
	markerLabel: string;
	name: string;
	standfirst: string;
	steps: Step[];
	/** Fecha o capítulo: três fotos e o texto entre elas. */
	gallery: Gallery;
}

export interface PartCopy {
	name: string;
	description: string;
}

export interface PageCopy {
	opener: {
		kicker: string;
		title: string;
		titleBreak: string;
		standfirst: string;
		meta: string;
		cue: string;
	};
	prologue: Step[];
	chapters: Chapter[];
	honk: {
		kicker: string;
		title: string;
		/** Abertura da seção, na coluna de leitura, antes das fotos. */
		body: string[];
		/** Cada foto leva o trecho da história que ela ilustra na legenda. */
		plates: Plate[];
		linkLabel: string;
		linkUrl: string;
	};
	/** Rótulos do player que fica sobre cada fotografia. */
	player: {
		cue: string;
		close: string;
		hint: string;
	};
	spec: {
		kicker: string;
		title: string;
		lede: string;
		rows: { label: string; values: Record<InstrumentId, string> }[];
	};
	coda: {
		kicker: string;
		title: string;
		lede: string;
		enableAudio: string;
		audioReady: string;
		audioPrompt: string;
		volume: string;
		explode: string;
		assembled: string;
		disassembled: string;
		autoRotate: string;
		resetView: string;
		partsTitle: string;
		partsHint: string;
		selectPart: string;
		keyboardHint: string;
		monophonicNote: string;
		nowPlaying: string;
		spectrumTitle: string;
		spectrumHint: string;
		midiTitle: string;
		midiUnsupported: string;
		midiDenied: string;
		midiSearching: string;
		midiConnected: string;
		midiConnect: string;
	};
	readout: {
		valves: string;
		valvesRest: string;
		slide: string;
		slideRest: string;
		keys: string;
		keysRest: string;
		octave: string;
	};
	names: Record<InstrumentId, string>;
	parts: Record<InstrumentId, Record<string, PartCopy>>;
	webglError: string;
	skipToPlay: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Português
   ────────────────────────────────────────────────────────────────────────── */

const pt: PageCopy = {
	opener: {
		kicker: "Trompete, saxofone, trombone",
		title: "Três instrumentos de sopro",
		titleBreak: "como funcionam e uma breve história sobre eles",
		standfirst:
			"Três instrumentos que passam a noite inteira resolvendo o mesmo problema — como controlar uma coluna de ar — de três jeitos que não conversam entre si. Um levou trezentos anos para conseguir tocar uma escala. Outro foi inventado por uma pessoa só. O terceiro está pronto desde o século XV. Desmonte os três.",
		meta: "Leia a Reportagem interativa",
		cue: "role"
	},

	prologue: [
		{
			id: "prologue-1",
			instrument: "trumpet",
			explode: 0,
			focus: null,
			rotate: true,
			kicker: "Antes do primeiro chorus",
			body: [
				"Todo sopro é a mesma ideia repetida: um tubo, e um jeito de fazer o ar dentro dele vibrar. O tubo não amplifica o sopro — ele <em>escolhe</em>. De todas as frequências que a vibração produz, só algumas cabem inteiras lá dentro. Essas são as notas que saem.",
				"Um tubo de comprimento fixo toca um punhado fixo de notas. Para tocar o resto, é preciso mudar o comprimento. E é exatamente aí que estes três param de ser o mesmo objeto."
			]
		},
		{
			id: "prologue-2",
			instrument: "trumpet",
			explode: 0,
			focus: null,
			rotate: true,
			body: [
				"São duas perguntas. <strong>O que vibra?</strong> Os lábios do músico, ou uma lâmina de cana. <strong>Como se muda o comprimento?</strong> Somando trechos fixos de tubo, escorregando uma vara, ou abrindo buracos na lateral.",
				"Três respostas de engenharia — e três histórias de gente que descobriu o que fazer com elas."
			],
			pull: "O tubo não amplifica o sopro. Ele escolhe."
		}
	],

	chapters: [
		/* ── I · Trompete ─────────────────────────────────────────────────── */
		{
			id: "trumpet",
			numeral: "I",
			marker: "148 cm",
			markerLabel: "de tubo",
			name: "Trompete",
			standfirst:
				"Em 1928, doze segundos de trompete sozinho mudaram o assunto do jazz. Cem anos antes, o mesmo instrumento não conseguia tocar uma escala.",
			steps: [
				{
					id: "trumpet-armstrong",
					instrument: "trumpet",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "Chicago, junho de 1928",
					title: "Doze segundos sozinho",
					body: [
						"A gravação de <em>West End Blues</em> começa sem banda. Louis Armstrong entra sozinho, despejando uma cadência de doze segundos que ninguém pediu, e quando o resto entra o jazz já mudou de assunto: deixou de ser música de conjunto e virou arte de solista.",
						"O que torna isso estranho é a data. Cem anos antes, esse instrumento mal conseguia tocar uma escala — e o que estava entre uma coisa e outra não foi um músico, foi uma peça de metal do tamanho de um dedo.",
						"Este capítulo é sobre essa peça."
					]
				},
				{
					id: "trumpet-mouthpiece",
					instrument: "trumpet",
					explode: 0.16,
					focus: "mouthpiece",
					kicker: "O bocal",
					title: "Não existe palheta aqui",
					body: [
						"Não há nada vibrante dentro de um trompete. O que vibra são os lábios, apertados um contra o outro dentro desta taça, abrindo e fechando centenas de vezes por segundo e picotando o sopro em pulsos. O instrumento começa no corpo do músico e o metal é o resto da frase.",
						"É por isso que trompetista fala em <em>chops</em> como quem fala de condicionamento físico, e por que a embocadura de cada um soa diferente na mesma nota. A taça e a garganta moldam esses pulsos: rasas puxam o brilho, fundas devolvem um som largo e escuro.",
						"Trocar de bocal muda mais o som do que trocar de trompete."
					],
					pull: "O instrumento começa no corpo do músico. O metal é o resto da frase."
				},
				{
					id: "trumpet-valves",
					instrument: "trumpet",
					explode: 0.28,
					focus: "valve-block",
					notes: [60, 62, 64, 65, 67, 65, 64, 62],
					kicker: "1815",
					title: "Três pistões, e o bebop fica possível",
					body: [
						"Sem pistões, o trompete só tocava a série harmônica: no grave, saltos enormes — dó, sol, dó, mi. Bom para fanfarra militar, inútil para melodia. Foi por isso que ele passou séculos como som de corte e de sinal, e que os barrocos tiveram que escrever no agudo extremo, onde as notas ficam próximas, para arrancar dele alguma linha cantável.",
						"O pistão resolve por combinatória: cada um desvia o ar por um trecho extra de tubo que baixa a nota em um tom, meio tom ou um tom e meio. Sozinhos e combinados, os três cobrem os seis semitons que faltavam.",
						"É um sistema de três bits. E é ele que, um século depois, permite que Dizzy Gillespie toque frases na velocidade que o bebop exige — porque três dedos são mais rápidos que qualquer outra solução mecânica já inventada para um sopro."
					],
					pull: "Um sistema de três bits — e é ele que faz o bebop caber na mão."
				},
				{
					id: "trumpet-bell",
					instrument: "trumpet",
					explode: 0.1,
					focus: "bell",
					kicker: "A campana",
					title: "Projetar, e recusar a projeção",
					body: [
						"Um tubo estreito e o ar livre são meios muito diferentes. Sem uma transição, quase toda a energia bateria na saída e voltaria para dentro. A abertura exponencial da campana é essa transição — e ela não trata todas as frequências igual: quanto mais aguda a onda, mais direcionada ela sai.",
						"É daí que vem a capacidade de atravessar uma big band inteira. Dizzy empenou a dele em 1953, depois de alguém cair em cima do instrumento numa festa, e resolveu manter: apontada para cima, ele se ouvia mais rápido.",
						"Miles Davis fez o movimento oposto. Enfiou uma surdina Harmon sem o tubo, encostou o microfone e recusou tudo o que a campana foi construída para fazer. O resultado é o som mais reconhecível do jazz moderno — feito contra o projeto do instrumento."
					]
				},
				{
					id: "trumpet-miles",
					instrument: "trumpet",
					explode: 0,
					focus: null,
					rotate: true,
					notes: [62, 64, 65, 67, 69, 67, 65, 64],
					kicker: "Nova York, 1959",
					title: "Miles Davis, ou tocar menos",
					body: [
						"<em>Kind of Blue</em> foi gravado em duas sessões, com esboços em vez de partes escritas e quase nenhum ensaio. A ideia era retirar: onde o bebop empilhava um acorde a cada dois tempos, <em>So What</em> deixa uma escala só durar oito, dezesseis compassos. Não sobra grade para correr atrás — sobra espaço, e é preciso ter o que dizer nele.",
						"A decisão musical tem uma versão mecânica exata, e ela está no instrumento. Registro médio, sem vibrato, poucas notas, e a surdina Harmon sem tubo colada ao microfone. Gillespie pediu à campana que atravessasse uma big band inteira; Miles pediu à campana que calasse a boca e passou a tarefa de projetar para o microfone. A partir dele, a eletricidade do estúdio faz parte do instrumento.",
						"E ele repetiu o gesto a vida inteira. As sessões do <em>Birth of the Cool</em>, em 1949 e 1950, tinham trocado o brilho da big band por um naipe de câmara. O segundo quinteto, formado em 1964 com Wayne Shorter, Herbie Hancock, Ron Carter e Tony Williams, dissolveu a forma fixa do tema por dentro. Em 1969, <em>Bitches Brew</em> jogou tudo isso em cima de um estúdio de rock, e nos anos 1970 o trompete já saía por amplificador e pedal de wah-wah.",
						"É um instrumento sem nenhuma peça nova em cento e cinquenta anos, usado cinco vezes para mudar de assunto. O que mudou, todas as vezes, foi o que ele decidiu não tocar."
					],
					pull: "Gillespie pediu à campana que atravessasse a big band. Miles pediu que ela calasse a boca."
				},
				{
					id: "trumpet-apart",
					instrument: "trumpet",
					explode: 1,
					focus: null,
					rotate: true,
					kicker: "Onze peças",
					title: "Tudo isso desmonta",
					body: [
						"Bocal, tudel, bomba de afinação, três pistões, três bombas de pistão, o corpo das caixas e a campana. Cada caixa é usinada com folga de micrômetros: o pistão precisa cair rápido e ainda assim não vazar ar.",
						"Gire, clique nas peças. Nenhuma volta de tubo está ali por estética — cada uma existe para acrescentar um comprimento específico."
					]
				},
				{
					id: "trumpet-culture",
					instrument: "trumpet",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "A linhagem",
					title: "De Armstrong ao coreto",
					body: [
						"Depois de Armstrong e Gillespie veio Clifford Brown, com uma articulação limpa que virou régua; depois Lee Morgan e Freddie Hubbard, que praticamente definiram o som da Blue Note nos anos 1960; depois Booker Little e Woody Shaw, que empurraram a harmonia adiante antes de morrerem cedo demais.",
						"No Brasil, o trompete tem outra biografia. Cláudio Roditi e Márcio Montarroyos levaram o instrumento brasileiro para o circuito internacional, mas a história mais importante é anterior e mais coletiva: o trompete é a linha de frente do frevo e o instrumento das bandas de música e filarmônicas.",
						"No interior do país, essas bandas foram por gerações a única escola formal de música ao alcance de quem quisesse aprender. Muito músico brasileiro leu sua primeira partitura num coreto, num instrumento emprestado pela própria banda.",
						"E o trompete brasileiro tem repertório próprio: Silvério Pontes tocando choro e frevo ao lado do trombone de Zé da Velha é uma linhagem que não passa por Nova York em momento nenhum."
					]
				}
			],
			gallery: {
				kicker: "Retratos",
				title: "Quem fez este tubo falar",
				plates: [
					{
						src: "armstrong",
						full: 1600,
						ratio: 1.5,
						position: "center 42%",
						alt: "Louis Armstrong tocando trompete, de terno claro, com um lenço branco na mão que segura o instrumento.",
						body: [
							"Armstrong em 1953 — vinte e cinco anos depois dos doze segundos de <em>West End Blues</em>, e ainda com o lenço na mão. Não era adereço: ele suava tocando, enxugava o rosto entre as frases, e aquilo virou parte da silhueta tanto quanto o sorriso.",
							"Repare em como os dedos caem nos pistões. As três hastes que este capítulo inteiro tentou explicar cabem debaixo de uma mão só — e é essa economia que faz o trompete ser rápido. Repare também na boca: tocar no agudo por décadas cobra caro, e Armstrong conviveu com feridas no lábio a vida inteira sem nunca abrir mão do som que todos depois dele tentaram copiar."
						],
						credit:
							"Louis Armstrong, 1953. Foto: fotógrafo do New York World-Telegram & Sun — Library of Congress, domínio público, via Wikimedia Commons.",
						creditUrl: "https://commons.wikimedia.org/wiki/File:Louis_Armstrong_restored.jpg"
					},
					{
						src: "gillespie",
						full: 1600,
						ratio: 1.35,
						position: "center 44%",
						alt: "Dizzy Gillespie de boina e óculos redondos, sorrindo, com o trompete apoiado no braço.",
						body: [
							"Gillespie em 1947, fotografado por William P. Gottlieb — o repórter que documentou quase todos os rostos citados nesta reportagem e depois colocou o acervo inteiro em domínio público.",
							"O trompete aqui ainda é reto. A campana torta, o traço pelo qual ele é reconhecido até hoje, só apareceria em 1953, por acidente, e virou escolha quando ele percebeu que gostava de ouvir o próprio som chegar mais cedo. Fora isso: um instrumento de série, três pistões, e a velocidade de frase que obrigou o resto do século a correr atrás."
						],
						credit:
							"Dizzy Gillespie, Nova York, c. maio de 1947. Foto: William P. Gottlieb — Library of Congress, Music Division (gottlieb.03141), domínio público, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Portrait_of_Dizzy_Gillespie,_New_York,_N.Y.,_ca._May_1947.jpg"
					},
					{
						src: "miles",
						full: 1600,
						ratio: 1.5,
						position: "center 50%",
						alt: "Miles Davis tocando trompete num palco de festival, de boné e óculos escuros, cercado de teclados e bateria.",
						body: [
							"Miles Davis no North Sea Jazz Festival, em Haia, julho de 1984 — vinte e cinco anos depois de <em>Kind of Blue</em>. O palco é elétrico: teclados empilhados à direita, guitarra atrás, bateria à esquerda. No meio disso tudo, o objeto mais antigo em cena é o que está na mão dele: três pistões, um sistema que não muda desde 1815.",
							"Olhe a campana. Pintada de preto, com o nome dele escrito em cursiva, virada para dentro do palco em vez de para a plateia, e com a haste de um microfone presa na borda. É a decisão do capítulo inteiro, agora em forma de hardware: desde a surdina Harmon dos anos 1950, projetar deixou de ser tarefa do metal. O metal faz a nota; a eletricidade faz o resto do caminho até o público."
						],
						credit:
							"Miles Davis no North Sea Jazz Festival, Haia, 15 de julho de 1984. Foto: Rob Bogaerts / Anefo — Nationaal Archief, CC0, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:North_Sea_Jazzfestival_in_Den_Haag_Miles_Davis,_Bestanddeelnr_933-0327.jpg"
					},
					{
						src: "fanfarra",
						full: 1440,
						ratio: 1.6,
						position: "center 58%",
						alt: "Fanfarra escolar desfilando numa rua de paralelepípedos de cidade pequena, com moradores assistindo da calçada.",
						body: [
							"Sete de setembro de 1971, Conceição dos Ouros, sul de Minas. A fanfarra do grupo escolar desfila na rua de paralelepípedo e a cidade inteira assiste da calçada. Com pequenas variações, é esta a cena que formou a maior parte dos sopristas brasileiros.",
							"Não é folclore: é infraestrutura. Banda de música, filarmônica, fanfarra de colégio e corporação musical foram, por gerações, a rede de ensino de música do país fora das capitais — instrumento emprestado, partitura no coreto, mestre que aprendeu com outro mestre. Do frevo à orquestra sinfônica, é impressionante a quantidade de currículos brasileiros que começam exatamente aqui."
						],
						credit:
							"Fanfarra do G.E.C.O. no desfile de 7 de setembro de 1971, Conceição dos Ouros (MG). Arquivos Históricos de Conceição dos Ouros, domínio público, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Concei%C3%A7%C3%A3o_dos_Ouros_-_fanfarra_do_G.E.C.O._no_desfile_de_7_de_setembro_de_1971_(10).jpg"
					}
				]
			}
		},

		/* ── II · Saxofone ────────────────────────────────────────────────── */
		{
			id: "saxophone",
			numeral: "II",
			marker: "110 cm",
			markerLabel: "de tubo cônico",
			name: "Saxofone",
			standfirst:
				"Rejeitado pela orquestra para a qual foi feito, ele foi adotado por outra música — e virou a voz do século.",
			steps: [
				{
					id: "sax-voice",
					instrument: "saxophone",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "Nova York, outubro de 1939",
					title: "O dia em que o tenor virou uma voz",
					body: [
						"Coleman Hawkins entra num estúdio, grava <em>Body and Soul</em> quase inteiro sem tocar a melodia, e o saxofone tenor deixa de ser um instrumento de naipe para virar um narrador em primeira pessoa. O disco vira sucesso comercial — o que ninguém esperava de três minutos de improviso sobre uma balada.",
						"De lá para cá, o saxofone é o instrumento em que o jazz mais fala. Lester Young responde a Hawkins com o oposto: som leve, atrás do tempo, frase econômica. Charlie Parker leva o alto para uma velocidade e uma harmonia que ninguém tinha imaginado. John Coltrane toca como quem reza.",
						"Nada disso estava no plano. O saxofone nem sequer devia estar ali."
					]
				},
				{
					id: "sax-history",
					instrument: "saxophone",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "1846",
					title: "O instrumento que ninguém queria",
					body: [
						"Quase todo instrumento é resultado de séculos de ajuste anônimo. O saxofone não: tem autor, data e patente. Adolphe Sax, fabricante belga instalado em Paris, registrou-o em 1846 querendo unir duas famílias que não se falavam — o corpo cônico e a projeção dos metais com a palheta e as chaves das madeiras.",
						"Ele projetou para bandas militares, e para lá foi. A orquestra sinfônica nunca o adotou de fato: até hoje o saxofone é convidado ocasional, não membro. O inventor passou boa parte da vida em litígios de patente que o levaram à falência mais de uma vez.",
						"Meio século depois, do outro lado do Atlântico, um instrumento sem cânone, sem repertório obrigatório e sem tradição para respeitar caiu nas mãos exatamente certas. A ausência de regras foi a sorte dele."
					],
					pull: "Chegou ao século XX sem cânone e sem regras. Foi essa a sorte dele."
				},
				{
					id: "sax-reed",
					instrument: "saxophone",
					explode: 0.22,
					focus: "reed",
					kicker: "A palheta",
					title: "Meio milímetro de cana",
					body: [
						"Esta é a única peça que realmente vibra, e a única descartável. Uma lâmina de <em>Arundo donax</em> com menos de meio milímetro na ponta, batendo contra a face do bocal e cortando o ar em pulsos.",
						"Dura poucas semanas, custa quase nada e define quase tudo. Duas palhetas do mesmo maço soam diferente — e é por isso que saxofonista abre a caixa, testa uma por uma e joga metade fora. O rosnado de Ben Webster e a lâmina de Dexter Gordon começam aqui, num pedaço de capim seco."
					],
					pull: "A peça mais barata do instrumento é a que decide como ele soa."
				},
				{
					id: "sax-cone",
					instrument: "saxophone",
					explode: 0.12,
					focus: "body",
					kicker: "O tubo",
					title: "O cone muda tudo",
					body: [
						"O clarinete também é tocado com palheta simples, e mesmo assim soa e se comporta de outro jeito. A diferença está aqui: o clarinete é cilíndrico, o saxofone é cônico do começo ao fim.",
						"A consequência é enorme. Um cone aberto produz a série harmônica completa e sobe para o registro seguinte na <strong>oitava</strong>; um cilindro fechado por palheta pula a <strong>duodécima</strong>. Por isso o sax repete a mesma digitação uma oitava acima com uma chave só, e o clarinete precisa reaprender o dedilhado ao mudar de registro.",
						"Traduzindo para a prática: o sax é mais fácil de tocar rápido em todo o âmbito. Foi um dos motivos de ele, e não o clarinete, ter herdado o jazz depois da era das big bands."
					]
				},
				{
					id: "sax-keys",
					instrument: "saxophone",
					explode: 0.2,
					focus: "keywork",
					notes: [49, 51, 53, 55, 56, 58, 60, 58, 56, 55, 53, 51],
					kicker: "O mecanismo",
					title: "Chaves porque a mão não alcança",
					body: [
						"Encurtar a coluna de ar é simples: abre-se um furo. O problema é que os furos acusticamente corretos são grandes demais para um dedo tapar e ficam longe demais uns dos outros.",
						"O mecanismo é a ponte entre a acústica ideal e a anatomia humana. Eixos, molas de agulha, braços e sapatilhas de couro fazem com que um dedo pequeno feche, no lugar certo, um buraco que ele jamais cobriria.",
						"Veja as sapatilhas fechando de cima para baixo conforme a escala desce. Multiplique isso pela velocidade de um chorus de Parker e você entende por que regulagem de sax é profissão."
					]
				},
				{
					id: "sax-coltrane",
					instrument: "saxophone",
					explode: 0,
					focus: "keywork",
					notes: [53, 56, 53, 58, 55, 58, 55, 60],
					kicker: "Nova York, 1959–1965",
					title: "John Coltrane leva o mecanismo ao limite",
					body: [
						"Em maio de 1959, poucas semanas depois de gravar <em>Kind of Blue</em> na banda de Miles, Coltrane entra em estúdio com <em>Giant Steps</em>: um tema que troca de centro tonal a cada dois tempos, andando de terça maior em terça maior, perto de 290 batidas por minuto. Os dois discos saem do mesmo ano e apontam para lados opostos — um tirando harmonia, o outro colocando mais do que cabe no compasso.",
						"O crítico Ira Gitler já tinha batizado aquilo de <em>sheets of sound</em>, lençóis de som: notas em densidade tal que deixam de ser ouvidas uma a uma e passam a ser ouvidas como textura. E é aqui que o mecanismo da peça anterior vira o assunto. Cada nota dessas é um evento mecânico — um braço que gira, uma mola que devolve, uma sapatilha que precisa vedar no tempo certo. As horas absurdas de estudo diário que a lenda atribui a ele não eram só disciplina: eram o treino de uma interface entre a ideia e o couro.",
						"Depois ele faz o caminho contrário. <em>A Love Supreme</em>, gravado em dezembro de 1964 com o quarteto de McCoy Tyner, Jimmy Garrison e Elvin Jones, se apoia num motivo de quatro notas — o mesmo que o mecanismo está tocando agora, na tela — repetido e transposto por doze tonalidades. É o menor número de notas possível, usado com a mesma obstinação com que ele antes usava o maior.",
						"E em 1960, em <em>My Favorite Things</em>, ele tira do armário o saxofone soprano, que quase ninguém levava a sério desde Sidney Bechet: o mesmo cone, metade do comprimento, uma oitava acima. No fim da vida, tocando por cima do registro previsto, com multifônicos e harmônicos forçados, ele já estava produzindo sons que nenhuma tabela de digitação prevê. O projeto de Adolphe Sax tinha pouco mais de cem anos; Coltrane achou onde ele acabava."
					],
					pull: "As horas de estudo não eram disciplina: eram o treino de uma interface entre a ideia e o couro."
				},
				{
					id: "sax-apart",
					instrument: "saxophone",
					explode: 1,
					focus: null,
					rotate: true,
					kicker: "Oito peças",
					title: "Latão por fora, madeira por dentro",
					body: [
						"Palheta, bocal, braçadeira, tudel, corpo, mecanismo, curva e campana. É tudo latão — e mesmo assim o saxofone toca no naipe das madeiras, porque o que define a família não é o material do tubo, é como o som nasce.",
						"É a exceção que explica a regra de classificação inteira."
					]
				},
				{
					id: "sax-brazil",
					instrument: "saxophone",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "A linhagem",
					title: "Do bebop ao forró",
					body: [
						"Sonny Rollins provou que dava para sustentar um trio inteiro sem instrumento harmônico. Ornette Coleman jogou fora as grades. Wayne Shorter e Joe Henderson reescreveram o que um tenor podia dizer dentro de um disco da Blue Note.",
						"No Brasil, Pixinguinha trocou a flauta pelo sax tenor na maturidade e levou o choro junto na mudança. Paulo Moura transitou entre o erudito e o popular a vida inteira sem pedir licença a ninguém.",
						"Depois deles, Carlos Malta e Nailor Proveta mostraram que dava para tocar choro, baião e big band no mesmo instrumento sem trocar de sotaque.",
						"E o saxofone é peça fixa do frevo e do forró: nordeste adentro, ele é tão popular quanto a sanfona, e igualmente pouco cerimonioso. Nenhum outro instrumento desta página atravessa tantos gêneros sem parecer estrangeiro em nenhum."
					]
				}
			],
			gallery: {
				kicker: "Retratos",
				title: "A cana, o metal e a voz",
				plates: [
					{
						src: "hawkins",
						full: 1600,
						ratio: 1.5,
						position: "center 34%",
						alt: "Coleman Hawkins tocando saxofone tenor num clube, de olhos fechados, com um microfone antigo ao lado.",
						body: [
							"Hawkins no Spotlite, na 52nd Street, por volta de setembro de 1946 — sete anos depois de <em>Body and Soul</em>, no clube onde essa maneira de tocar já era o padrão que os outros tinham de responder.",
							"A foto mostra bem a única peça que vibra: a palheta está lá dentro, escondida entre o lábio inferior e a mesa do bocal, custando o preço de um café e decidindo tudo. Tudo o mais que aparece na imagem — o cone de latão, as chaves, a campana virada para cima — existe só para filtrar o que aquele meio milímetro de cana está fazendo."
						],
						credit:
							"Coleman Hawkins no Spotlite, Nova York, c. setembro de 1946. Foto: William P. Gottlieb — Library of Congress, domínio público, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:(Portrait_of_Coleman_Hawkins,_Spotlite_(Club),_New_York,_N.Y.,_ca._Sept._1946)_(LOC)_(4843746292).jpg"
					},
					{
						src: "parker",
						full: 1600,
						ratio: 1.35,
						position: "center 8%",
						alt: "Charlie Parker de perfil tocando saxofone alto, de terno risca de giz, com um contrabaixo ao fundo.",
						body: [
							"Charlie Parker em 1947, no auge do quinteto com Miles Davis e Max Roach. Está tocando alto, não tenor: o instrumento é menor, a mão anda menos e a escala fica mais rápida — o que importa quando as frases são estas.",
							"Olhe a boca. O lábio inferior dobrado sobre os dentes, o queixo esticado, a bochecha firme: essa é a máquina de verdade, e ela é feita de músculo. O mecanismo que a página inteira desmonta só resolve o problema geométrico — quem decide se sai um som fino ou o som de Parker é a embocadura."
						],
						credit:
							"Charlie Parker, c. agosto de 1947. Foto: William P. Gottlieb — Library of Congress, Music Division (gottlieb.06851), domínio público, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Charlie_Parker,_(Gottlieb_06851)_(cropped).jpg"
					},
					{
						src: "coltrane",
						full: 1600,
						ratio: 1.35,
						position: "center 55%",
						alt: "John Coltrane recebendo um prêmio no palco do Concertgebouw, com o saxofone tenor pendurado no pescoço e um soprano atravessado na mão, ao lado da capa do disco Giant Steps.",
						body: [
							"Amsterdã, 20 de novembro de 1961. Coltrane recebe o prêmio Edison no palco do Concertgebouw, e alguém segura ao lado dele a capa do disco premiado: <em>Giant Steps</em> — o tema que troca de centro tonal a cada dois tempos, gravado dois anos antes.",
							"A foto tem os dois saxofones do capítulo no mesmo quadro. No pescoço, o tenor, com o mecanismo de chaves aparecendo de cima a baixo — eixos, braços e sapatilhas, a ponte entre a acústica e a mão. Embaixo, atravessado, o soprano: mesmo cone, metade do comprimento, uma oitava acima. Era o instrumento que quase ninguém levava a sério, e que ele tinha tirado do esquecimento treze meses antes, gravando <em>My Favorite Things</em>."
						],
						credit:
							"John Coltrane recebe o prêmio Edison pelo disco Giant Steps, Concertgebouw, Amsterdã, 20 de novembro de 1961. Foto: Dave Brinkman / Anefo — Nationaal Archief, CC0, via Wikimedia Commons.",
						creditUrl: "https://commons.wikimedia.org/wiki/File:JohnColtrane1961orig.jpg"
					},
					{
						src: "spok",
						full: 1600,
						ratio: 1.6,
						position: "center 45%",
						alt: "Maestro Spok tocando saxofone num palco de rua em Olinda, com crianças fantasiadas ao fundo.",
						body: [
							"Maestro Spok no aniversário de Olinda, em 2011. À frente da Spok Frevo Orquestra, ele faz com o frevo mais ou menos o que Hawkins fez com a balada: pega uma música de função — feita para a rua andar — e improvisa por cima dela como quem assume a primeira pessoa.",
							"É o mesmo saxofone das duas fotos anteriores, tocado a 130 passos por minuto sob o sol de Pernambuco. Vale reparar em quem está atrás: o público do frevo é a criançada de fantasia, e a orquestra toca de pé, sem estante, andando. Pixinguinha, Paulo Moura, Spok — a linhagem brasileira do instrumento passa por onde tem gente na rua."
						],
						credit:
							"Maestro Spok no aniversário de Olinda, 2011. Foto: Ádria de Sousa / Prefeitura de Olinda, CC BY 2.0, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Maestro_Spok_-_Anivers%C3%A1rio_de_Olinda_2011.jpg"
					}
				]
			}
		},

		/* ── III · Trombone ──────────────────────────────────────────────── */
		{
			id: "trombone",
			numeral: "III",
			marker: "274 cm",
			markerLabel: "de tubo",
			name: "Trombone",
			standfirst:
				"Quinhentos anos sem mudar de mecanismo, e mesmo assim ele aprendeu a tocar bebop.",
			steps: [
				{
					id: "trombone-tailgate",
					instrument: "trombone",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "Nova Orleans, anos 1910",
					title: "O único que precisava de espaço",
					body: [
						"As bandas desfilavam em carroças, e o trombonista era o único que precisava de espaço livre à frente para estender a vara. Sobrava para ele a tampa traseira. O estilo que saiu dali — cheio de portamentos, rosnados e respostas atravessadas embaixo da melodia — ficou conhecido como <em>tailgate</em>, e Kid Ory é o nome colado nessa história.",
						"O trombone entrou no jazz pela posição física que ocupava na carroça. Poucos instrumentos têm uma origem estética tão literalmente logística.",
						"Depois veio Jack Teagarden, que provou que dava para cantar nele com a mesma naturalidade com que se canta com a boca."
					]
				},
				{
					id: "trombone-slide",
					instrument: "trombone",
					explode: 0,
					focus: "outer-slide",
					notes: [58, 57, 56, 55, 54, 53, 52, 53, 54, 55, 56, 57],
					kicker: "A vara",
					title: "O único que não tem degraus",
					body: [
						"Pistões somam pedaços fixos de tubo; chaves abrem furos em posições fixas. Os dois trabalham com alturas discretas: existe o dó e existe o dó sustenido, e nada entre eles.",
						"A vara não tem esse limite. Ela varia o comprimento de forma contínua, o que significa que entre duas notas existem infinitas outras. É por isso que o trombone faz glissando de verdade e nenhum outro sopro faz — os demais apenas imitam, forçando a embocadura.",
						"É também a razão de ele ser o mais difícil de afinar. Não há mecanismo que coloque a nota no lugar: o lugar é uma memória do braço."
					],
					pull: "Não há mecanismo que coloque a nota no lugar. O lugar é uma memória do braço."
				},
				{
					id: "trombone-positions",
					instrument: "trombone",
					explode: 0,
					focus: "inner-slide",
					notes: [58, 56, 54, 52],
					kicker: "Sete posições",
					title: "Por que elas ficam mais longas",
					body: [
						"São sete referências, cada uma um semitom abaixo da anterior. Mas não são igualmente espaçadas: da primeira para a segunda o braço anda alguns centímetros; da sexta para a sétima, bem mais.",
						"A razão é que frequência cai por proporção, não por subtração. Baixar meio tom exige uma porcentagem do tubo — e a mesma porcentagem de um tubo já alongado dá mais centímetros. A escala é geométrica.",
						"Agora imagine acertar isso na velocidade do bebop. Em 1947, J. J. Johnson começou a tocar linhas de bop no trombone com uma articulação que ninguém achava fisicamente possível num instrumento sem pistões — e reescreveu, sozinho, o que se esperava do braço direito."
					],
					pull: "J. J. Johnson reescreveu sozinho o que se esperava do braço direito."
				},
				{
					id: "trombone-bell",
					instrument: "trombone",
					explode: 0.12,
					focus: "bell",
					kicker: "A campana",
					title: "A mesma física, o dobro do tubo",
					body: [
						"Acusticamente, trombone e trompete são quase o mesmo instrumento: lábios vibrando, tubo cilíndrico em dois terços, campana exponencial. O trombone só tem o dobro de tubo — e por isso soa uma oitava abaixo.",
						"A campana acompanha: vinte centímetros de diâmetro, o dobro da área da do trompete. Superfície maior irradia melhor as frequências graves, exatamente as que este instrumento produz.",
						"Vale dizer de onde ele veio, porque o contraste é engraçado: antes da carroça em Nova Orleans, o trombone passou séculos dentro de igrejas dobrando vozes de coro, e era o timbre do solene. Mozart o usa assim no <em>Tuba mirum</em> do Réquiem. Beethoven o tirou de lá em 1808, no finale da Quinta."
					]
				},
				{
					id: "trombone-apart",
					instrument: "trombone",
					explode: 1,
					focus: null,
					rotate: true,
					kicker: "Duas metades",
					title: "Por isso ele cabe no estojo",
					body: [
						"O trombone se separa em duas seções que se encaixam: a da vara e a da campana. É a única razão pela qual um instrumento de quase um metro e meio viaja numa caixa retangular.",
						"E a vara é a peça de tolerância mais fina de toda a família dos metais. Ela desliza sobre um filme de água e lubrificante; um amassado invisível a olho nu é suficiente para travá-la. Daí a primeira regra que todo trombonista aprende: nunca se pega um trombone pela vara."
					]
				},
				{
					id: "trombone-brazil",
					instrument: "trombone",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "A linhagem",
					title: "Do bop ao frevo",
					body: [
						"Curtis Fuller entra no <em>Blue Train</em> de Coltrane em 1957 e mostra o trombone como voz de frente, não como recheio de naipe. Slide Hampton e Grachan Moncur III levam o instrumento para dentro da harmonia moderna.",
						"No Brasil, Raul de Souza levou o trombone brasileiro para o mundo, gravando com Milton Nascimento, Sérgio Mendes, Airto Moreira e George Duke — e trouxe de volta um fraseado que não era nem americano nem exatamente de mais ninguém.",
						"Zé da Velha e Bocato seguiram por outro caminho: choro, forró e frevo tocados com o mesmo braço direito, longe do circuito de jazz e sem nenhuma cerimônia com ele.",
						"E no carnaval de Pernambuco o trombone é espinha dorsal da orquestra de frevo: o naipe que dá o peso, o rasgo e a insistência do gênero. É o mesmo tubo do século XV, ainda ganhando repertório."
					]
				}
			],
			gallery: {
				kicker: "Retratos",
				title: "O braço direito, em três continentes",
				plates: [
					{
						src: "teagarden",
						full: 1024,
						ratio: 1.35,
						position: "center 62%",
						alt: "Jack Teagarden no estúdio, com a mão no ouvido e o trombone apoiado no braço, diante de um microfone.",
						body: [
							"Jack Teagarden no estúdio da Victor, em 1947, com a mão no ouvido — o gesto de quem está conferindo a própria afinação por dentro da cabeça, e não por um mecanismo.",
							"É a imagem exata do que o capítulo diz: num instrumento sem pistões e sem chaves, a nota não tem lugar marcado. O braço decora a distância e o ouvido corrige o resto. Teagarden cantava e tocava alternadamente na mesma frase, e a semelhança entre as duas coisas não é coincidência: os dois casos são altura contínua, ajustada de ouvido."
						],
						credit:
							"Jack Teagarden no estúdio da Victor, Nova York, c. maio de 1947. Foto: William P. Gottlieb — Library of Congress, domínio público, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Jack_Teagarden,_Victor_studio,_New_York,_N.Y.,_ca._May_1947_(William_P._Gottlieb_08381).jpg"
					},
					{
						src: "frevo",
						full: 1600,
						ratio: 1.6,
						position: "center 48%",
						alt: "Naipe de metais tocando na rua em Olinda: trombones de vara em primeiro plano, saxofones e um sousafone atrás.",
						body: [
							"Olinda, carnaval. Três trombones em primeiro plano, varas estendidas sobre a ladeira, e atrás deles o naipe inteiro: saxofones, trompetes, um sousafone segurando o baixo.",
							"Aqui a vara deixa de ser um problema de afinação e vira um problema de espaço — exatamente como na carroça de Nova Orleans, cem anos antes. Quem toca trombone em desfile passa a tarde negociando um metro e meio de tubo com a multidão. E o rasgo característico do frevo, aquele glissando ascendente que abre os arranjos, só existe porque este é o único sopro capaz de passar por todas as notas do caminho."
						],
						credit:
							"Orquestra de frevo em Olinda, 2013. Foto: Prefeitura de Olinda, CC BY 2.0, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Frevo_orchestra_-_Olinda,_Pernambuco,_Brazil.jpg"
					},
					{
						src: "raul",
						full: 1600,
						ratio: 1.6,
						position: "center 42%",
						alt: "Raul de Souza tocando trombone em close, de olhos fechados, com a campana ocupando o centro da imagem.",
						body: [
							"Raul de Souza em 2018, num festival austríaco, aos 84 anos. Carioca formado na banda da Aeronáutica, ele saiu do Brasil nos anos 1960 e gravou com Milton Nascimento, Sérgio Mendes, Airto Moreira e George Duke antes de voltar — sempre com um fraseado que não era americano nem exatamente de mais ninguém.",
							"A foto pega o instrumento pelo lado em que ele é mais fotogênico e mais mal compreendido: a campana enorme, que é só o fim da história. O que decide a nota está fora do quadro, na mão direita, a um metro dali. Raul morreu em 2021, tocando até quase o fim."
						],
						credit:
							"Raul de Souza no festival Inntöne, 2018. Foto: Schorle, CC BY-SA 4.0, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Raul_de_Souza_Next_Generation_Band_17.jpg"
					}
				]
			}
		}
	],

	honk: {
		kicker: "Onde isso continua",
		title: "A fanfarra é o formato original",
		body: [
			"Nada nesta reportagem começou em sala de concerto. O trompete veio da sinalização militar e do coreto; o saxofone foi projetado para banda militar e adotado pela rua; o trombone entrou no jazz porque era o único que precisava de espaço livre na traseira de uma carroça. Os três são, na origem, instrumentos de deslocamento — feitos para soar ao ar livre, sem amplificação, andando.",
			"É por isso que eles aparecem em tanta música diferente e quase nunca no mesmo papel. Em Nova Orleans, as bandas de sopro tocavam enterro e desfile antes de tocarem jazz, e o jazz se formou juntando o que já estava na rua: marcha militar, ragtime, blues e a levada caribenha que Jelly Roll Morton chamou de <em>Spanish tinge</em>. O caminho nunca foi de mão única — oitenta anos depois foi a vez de as brass bands de lá reabsorverem o funk e o hip hop das mesmas calçadas, com a Dirty Dozen e a Rebirth, e o desfile voltou a soar como a cidade em volta dele.",
			"No Brasil os mesmos três tubos entraram por outra porta: as bandas de música das praças e dos coretos do interior, que formaram gerações de sopristas antes de qualquer escola. Delas saíram os metais que o choro carioca aproveitou, os naipes do samba e a orquestra de frevo — que nasce no carnaval do Recife cruzando a marcha das bandas militares com o maxixe e é, até hoje, música de metal tocada andando. A troca com o Norte também correu nos dois sentidos: os Oito Batutas de Pixinguinha desembarcaram em Paris em 1922, a bossa nova e o cool jazz se encontraram nos anos 1960, e trombonistas como Raul de Souza foram gravar lá — voltando com um fraseado que não era de nenhum dos dois lugares.",
			"O HONK! é a versão contemporânea desse arranjo — e é a partir daqui que a história tem fotografia."
		],
		plates: [
			{
				src: "honk",
				full: 1600,
				ratio: 1.6,
				position: "center 45%",
				alt: "Multidão em volta de uma fanfarra ao anoitecer, vista do alto por entre galhos floridos, durante o Honk Fest West, em Seattle.",
				body: [
					"A primeira edição reuniu fanfarras de rua em <strong>Somerville, Massachusetts, em 2006</strong>: sem fins lucrativos, sem cachê para os músicos, sem palco, sem ingresso e sem eletricidade, produzida coletivamente, com as bandas tocando no meio do público em vez de de frente para ele. De lá a receita se espalhou por outras cidades e outros países.",
					"Esta é uma delas, quatro anos depois: o Honk Fest West, em Seattle, fotografado do alto ao anoitecer. Não há palco na imagem porque não há palco — a banda está lá embaixo, dentro do círculo que se fechou em volta dela."
				],
				credit:
					"Honk Fest West, bairro de Georgetown, Seattle (EUA), 2010. Foto: Joe Mabel, CC BY-SA 3.0, via Wikimedia Commons.",
				creditUrl: "https://commons.wikimedia.org/wiki/File:Honk_Fest_West_2010-137.jpg"
			},
			{
				src: "honk-sp-1",
				full: 1600,
				ratio: 1.6,
				position: "center 45%",
				alt: "Fanfarra e público lotando um túnel em São Paulo durante o HONK! SP: uma placa escrita HONK!, uma bandeira vermelha e amarela, artistas em pernas de pau e caixas de percussão no meio da multidão.",
				body: [
					"O primeiro HONK! brasileiro aconteceu em <strong>2016</strong>, e desde então o festival passou pelo Rio de Janeiro, São Paulo, Brasília e Porto Alegre. Belo Horizonte entrou no mapa em <strong>2019</strong>, com três dias de programação bancados do mesmo jeito que o festival se organiza: 147 pessoas financiaram a primeira edição numa vaquinha coletiva, que fechou em 151% da meta.",
					"Esta é a edição paulistana de 2025, dentro de um túnel — teto de concreto, que devolve o som inteiro para quem está embaixo dele. Caixas de um lado, sopros do outro, gente em cima do viaduto olhando, e nenhum lugar marcado, porque não existe frente."
				],
				credit:
					"HONK! SP 2025, túnel José Roberto Fanganiello Melhem, São Paulo, novembro de 2025. Foto: ProtoplasmaKid, CC BY-SA 4.0, via Wikimedia Commons.",
				creditUrl:
					"https://commons.wikimedia.org/wiki/File:Festival_de_fanfarrias_HONK!_SP_2025_06.jpg"
			},
			{
				src: "honk-sp-2",
				full: 1600,
				ratio: 1.6,
				position: "center 50%",
				alt: "De dentro da fanfarra: o latão de um sopro carregado no ombro em primeiro plano e, à frente, as costas de um músico com uma camiseta onde se lê “quem sopra respira”.",
				body: [
					"Esta foto foi tirada de dentro da banda, não da calçada. O que se vê primeiro é o latão de um sopro carregado no ombro; depois, as costas de quem toca ao lado, com a frase que resume o assunto desta reportagem inteira — <em>quem sopra respira</em>.",
					"No Brasil o HONK! caiu em terreno preparado. O carnaval de rua já era o lugar onde essas bandas existem: o bloco de sopro ensaia o ano inteiro para tocar andando, sem microfone, com a mesma formação de metais e percussão que a neofanfarra usa — e que ela herda, ao mesmo tempo, das brass bands de jazz, das <em>fanfares</em> francesas e das bandas de coreto daqui. Em Belo Horizonte, cidade que refez o próprio carnaval de rua na última década, a distância entre a fanfarra ativista e o bloco é quase só a data no calendário.",
					"O <strong>Festival Internacional de Fanfarras HONK!BH</strong> acontece em <strong>29 de agosto de 2026</strong>, de graça, nas ruas da cidade. Se você chegou até aqui desmontando os três instrumentos na tela, esta é a versão montada: os mesmos tubos, na calçada, com a acústica que eles foram desenhados para ter."
				],
				credit:
					"HONK! SP 2025, túnel José Roberto Fanganiello Melhem, São Paulo, novembro de 2025. Foto: ProtoplasmaKid, CC BY-SA 4.0, via Wikimedia Commons.",
				creditUrl:
					"https://commons.wikimedia.org/wiki/File:Festival_de_fanfarrias_HONK!_SP_2025_21.jpg"
			}
		],
		linkLabel: "HONK!BH · 29 de agosto de 2026 · Belo Horizonte",
		linkUrl:
			"https://portalbelohorizonte.com.br/eventos/festival/cultural/festival-internacional-de-fanfarras-honkbh"
	},

	player: {
		cue: "Ouvir",
		close: "Fechar o player",
		hint: "Trecho de 30 segundos. Quem estiver logado no Spotify ouve a gravação inteira."
	},

	spec: {
		kicker: "Ficha técnica",
		title: "Lado a lado",
		lede: "Nem tudo que é de latão é metal. O que define a família é como o som nasce, não do que o tubo é feito.",
		rows: [
			{
				label: "Família",
				values: {
					trumpet: "Metais",
					saxophone: "Madeiras (apesar do latão)",
					trombone: "Metais"
				}
			},
			{
				label: "O que vibra",
				values: {
					trumpet: "Os lábios do músico",
					saxophone: "Uma palheta simples de cana",
					trombone: "Os lábios do músico"
				}
			},
			{
				label: "Formato do tubo",
				values: {
					trumpet: "Cilíndrico em ~2/3, depois campana",
					saxophone: "Cônico do começo ao fim",
					trombone: "Cilíndrico em ~2/3, depois campana"
				}
			},
			{
				label: "Como muda de nota",
				values: {
					trumpet: "3 pistões inserem tubo extra",
					saxophone: "Chaves abrem e fecham furos",
					trombone: "A vara alonga o tubo continuamente"
				}
			},
			{
				label: "Comprimento do tubo",
				values: { trumpet: "≈ 148 cm", saxophone: "≈ 110 cm", trombone: "≈ 274 cm" }
			},
			{
				label: "Afinação",
				values: {
					trumpet: "Sib — soa 1 tom abaixo do escrito",
					saxophone: "Mib — soa uma 6ª maior abaixo",
					trombone: "Dó — lê em som real"
				}
			},
			{
				label: "Extensão usual",
				values: { trumpet: "Mi3 – Ré6", saxophone: "Réb3 – Lá5", trombone: "Mi2 – Ré5" }
			},
			{
				label: "Glissando real",
				values: {
					trumpet: "Não — alturas discretas",
					saxophone: "Só aproximado, com a embocadura",
					trombone: "Sim — é o único"
				}
			},
			{
				label: "Data de nascimento",
				values: {
					trumpet: "Pistões, c. 1815",
					saxophone: "Adolphe Sax, 1846",
					trombone: "Sacabuxa, séc. XV"
				}
			}
		]
	},

	coda: {
		kicker: "Oficina",
		title: "Agora é com você",
		lede: "Escolha um instrumento, desmonte à vontade e toque. As teclas acionam o mecanismo de verdade: cada nota mostra a digitação, a posição de vara ou as chaves que ela exige.",
		enableAudio: "Ativar som",
		audioReady: "Som ativo",
		audioPrompt: "O áudio começa desligado — navegadores exigem um clique antes de tocar som.",
		volume: "Volume",
		explode: "Desmontar",
		assembled: "montado",
		disassembled: "desmontado",
		autoRotate: "Girar",
		resetView: "Enquadrar",
		partsTitle: "Peças",
		partsHint: "Clique em uma peça — na lista ou no próprio modelo.",
		selectPart: "Selecione uma peça para ver o que ela faz.",
		keyboardHint: "A W S E D F T G Y H U J · Z e X mudam de oitava",
		monophonicNote:
			"Sopros são monofônicos: uma nota nova substitui a anterior, ligada. Não dá para tocar acorde — nem aqui, nem de verdade.",
		nowPlaying: "Tocando",
		spectrumTitle: "Espectro",
		spectrumHint: "A distribuição dos harmônicos é o que faz cada timbre soar diferente.",
		midiTitle: "MIDI",
		midiUnsupported: "Este navegador não implementa a Web MIDI API (use Chrome ou Edge).",
		midiDenied: "Permissão de MIDI negada.",
		midiSearching: "Nenhum dispositivo encontrado.",
		midiConnected: "Conectado a",
		midiConnect: "Conectar teclado MIDI"
	},

	readout: {
		valves: "pistões",
		valvesRest: "em repouso",
		slide: "posição da vara",
		slideRest: "1ª posição",
		keys: "furos fechados",
		keysRest: "tudo aberto",
		octave: "oitava"
	},

	names: {
		trumpet: "Trompete",
		saxophone: "Saxofone",
		trombone: "Trombone"
	},

	webglError: "Seu navegador não conseguiu iniciar o WebGL.",
	skipToPlay: "Ir direto para tocar",

	parts: {
		trumpet: {
			mouthpiece: {
				name: "Bocal",
				description:
					"Taça, garganta e cabo. Os lábios vibram dentro da taça e a garganta estrangula o fluxo — mudar de bocal muda mais o som do que mudar de trompete."
			},
			leadpipe: {
				name: "Tudel",
				description:
					"O primeiro trecho depois do bocal, levemente cônico. Essa conicidade determina a resistência que o músico sente ao soprar e o quanto cada harmônico cai no lugar."
			},
			"tuning-slide": {
				name: "Bomba de afinação geral",
				description:
					"A volta em U da frente. Puxada para fora, alonga o tubo e baixa a afinação do instrumento inteiro — é o ajuste grosso, feito antes de tocar."
			},
			"valve-block": {
				name: "Corpo dos pistões",
				description:
					"As três caixas cilíndricas e os joelhos que as ligam. Cada caixa é usinada com folga de micrômetros para que o pistão desça rápido sem vazar ar."
			},
			"piston-1": {
				name: "1º pistão",
				description:
					"Desvia o ar pela bomba mais longa das três: baixa a nota em um tom inteiro. É o dedo indicador."
			},
			"piston-2": {
				name: "2º pistão",
				description: "O desvio mais curto do instrumento: baixa a nota em meio tom. Dedo médio."
			},
			"piston-3": {
				name: "3º pistão",
				description:
					"Baixa a nota em um tom e meio — equivale a 1+2, e existe para dar alternativas de digitação e afinação. Dedo anelar."
			},
			"slide-1": {
				name: "Bomba do 1º pistão",
				description:
					"O tubo extra que o 1º pistão insere. Em muitos trompetes ela tem gatilho de polegar, porque as digitações 1+3 e 1+2+3 saem altas e precisam de correção em tempo real."
			},
			"slide-2": {
				name: "Bomba do 2º pistão",
				description:
					"A menor de todas, com poucos centímetros de tubo. Meio tom custa pouco: é a diferença proporcionalmente menor do sistema."
			},
			"slide-3": {
				name: "Bomba do 3º pistão",
				description:
					"A mais longa, e a que tem o anel para o dedo anelar. O anel não é enfeite: nas digitações altas o músico empurra a bomba enquanto toca."
			},
			bell: {
				name: "Campana",
				description:
					"A curva de trás e o pavilhão. A abertura exponencial casa a impedância do tubo estreito com o ar livre — sem ela, quase toda a energia voltaria para dentro."
			}
		},
		saxophone: {
			reed: {
				name: "Palheta",
				description:
					"Uma lâmina de cana com menos de meio milímetro na ponta. É a única peça que vibra e a única descartável — dura poucas semanas e define quase todo o caráter do som."
			},
			mouthpiece: {
				name: "Bocal",
				description:
					"Ebonite ou metal, com uma mesa plana onde a palheta se apoia e uma câmara interna. Abertura de ponta e curvatura mudam completamente a resposta."
			},
			ligature: {
				name: "Braçadeira",
				description:
					"A abraçadeira que prende a palheta ao bocal. Parece trivial, mas o quanto ela deixa a palheta livre para vibrar altera o timbre de forma audível."
			},
			neck: {
				name: "Tudel",
				description:
					"O tubo curvo que liga o bocal ao corpo, com a chave de oitava embutida. Deslizar o bocal sobre a cortiça afina o instrumento inteiro."
			},
			body: {
				name: "Corpo",
				description:
					"O cone principal, com as chaminés dos furos soldadas ao longo dele. A conicidade é o que separa o sax do clarinete."
			},
			keywork: {
				name: "Mecanismo de chaves",
				description:
					"Eixos, molas de agulha, braços e sapatilhas. Ele existe porque os furos acusticamente corretos são grandes e distantes demais para a mão humana."
			},
			bow: {
				name: "Curva",
				description:
					"A volta em U do fundo. É praticidade pura: dobrar o cone mantém o comprimento necessário sem transformar o sax em um tubo vertical de um metro e meio."
			},
			bell: {
				name: "Campana",
				description:
					"O pavilhão voltado para cima, com as chaves de Si e Sib graves montadas nele. Só as notas mais graves saem de fato por aqui."
			}
		},
		trombone: {
			mouthpiece: {
				name: "Bocal",
				description:
					"Bem maior e mais fundo que o do trompete. Uma taça larga pede lábios vibrando mais devagar — é o que coloca o instrumento no registro grave."
			},
			"outer-slide": {
				name: "Vara externa",
				description:
					"A parte que a mão direita move. Desliza sobre um filme de água e lubrificante; é a peça de tolerância mais fina de toda a família dos metais."
			},
			"inner-slide": {
				name: "Vara interna",
				description:
					"Os dois tubos fixos por onde a vara externa corre, com as meias que fazem a vedação. A escora entre eles é onde a mão esquerda segura o instrumento inteiro."
			},
			gooseneck: {
				name: "Tubo de ligação",
				description:
					"O trecho curvo que leva o ar da vara até a bomba de afinação. É também a junta que separa o trombone em duas metades."
			},
			"tuning-slide": {
				name: "Bomba de afinação",
				description:
					"O U do fundo, atrás da cabeça do músico. Ajusta a afinação geral sem mexer nas posições da vara, que são referências corporais decoradas ao longo de anos."
			},
			counterweight: {
				name: "Contrapeso",
				description:
					"Um disco de latão preso entre os ramos da bomba de afinação. Sem ele, todo o peso ficaria à frente da mão esquerda e o braço direito perderia liberdade."
			},
			bell: {
				name: "Campana",
				description:
					"Vinte centímetros de diâmetro — o dobro da área da do trompete. Uma campana maior irradia melhor as frequências graves."
			}
		}
	}
};

/* ─────────────────────────────────────────────────────────────────────────────
   English
   ────────────────────────────────────────────────────────────────────────── */

const en: PageCopy = {
	opener: {
		kicker: "Trumpet, saxophone, trombone",
		title: "Three brass instruments",
		titleBreak: "how they work and a brief story about them",
		standfirst:
			"Three instruments that spend all night solving the same problem — how to control a column of air — in three ways that don't speak to each other. One took three hundred years to manage a scale. One was invented by a single person. One has been finished since the 15th century. Take all three apart.",
		meta: "Interactive feature · scroll to take them apart",
		cue: "scroll"
	},

	prologue: [
		{
			id: "prologue-1",
			instrument: "trumpet",
			explode: 0,
			focus: null,
			rotate: true,
			kicker: "Before the first chorus",
			body: [
				"Every wind instrument is the same idea repeated: a tube, and a way to make the air inside it vibrate. The tube doesn't amplify the breath — it <em>selects</em>. Of all the frequencies the vibration produces, only some fit whole inside. Those are the notes that come out.",
				"A tube of fixed length plays a fixed handful of notes. To play the rest, you have to change the length. And that is exactly where these three stop being the same object."
			]
		},
		{
			id: "prologue-2",
			instrument: "trumpet",
			explode: 0,
			focus: null,
			rotate: true,
			body: [
				"Two questions. <strong>What vibrates?</strong> The player's lips, or a blade of cane. <strong>How do you change the length?</strong> By adding fixed sections of tube, by sliding one tube inside another, or by opening holes along the side.",
				"Three engineering answers — and three stories about the people who worked out what to do with them."
			],
			pull: "The tube doesn't amplify the breath. It selects."
		}
	],

	chapters: [
		{
			id: "trumpet",
			numeral: "I",
			marker: "148 cm",
			markerLabel: "of tubing",
			name: "Trumpet",
			standfirst:
				"In 1928, twelve seconds of solo trumpet changed what jazz was about. A century earlier, the same instrument couldn't play a scale.",
			steps: [
				{
					id: "trumpet-armstrong",
					instrument: "trumpet",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "Chicago, June 1928",
					title: "Twelve seconds alone",
					body: [
						"The recording of <em>West End Blues</em> starts with no band. Louis Armstrong comes in alone, pouring out a twelve-second cadenza nobody asked for, and by the time the rest arrive jazz has changed subject: it has stopped being ensemble music and become a soloist's art.",
						"What makes that strange is the date. A century earlier this instrument could barely play a scale — and what stood between the two wasn't a musician, it was a piece of metal the size of a finger.",
						"This chapter is about that piece."
					]
				},
				{
					id: "trumpet-mouthpiece",
					instrument: "trumpet",
					explode: 0.16,
					focus: "mouthpiece",
					kicker: "The mouthpiece",
					title: "There is no reed here",
					body: [
						"Nothing vibrates inside a trumpet. What vibrates is the lips, pressed together inside this cup, opening and closing hundreds of times a second and chopping the breath into pulses. The instrument starts in the player's body; the metal is the rest of the sentence.",
						"That's why trumpet players talk about <em>chops</em> the way athletes talk about conditioning, and why two embouchures sound different on the same note. The cup and throat shape those pulses: shallow ones pull out the brightness, deep ones give back something broad and dark.",
						"Changing mouthpieces changes the sound more than changing trumpets."
					],
					pull: "The instrument starts in the player's body. The metal is the rest of the sentence."
				},
				{
					id: "trumpet-valves",
					instrument: "trumpet",
					explode: 0.28,
					focus: "valve-block",
					notes: [60, 62, 64, 65, 67, 65, 64, 62],
					kicker: "1815",
					title: "Three valves, and bebop becomes possible",
					body: [
						"Without valves the trumpet played only the harmonic series: down low, enormous gaps — C, G, C, E. Fine for a military signal, useless for melody. That's why it spent centuries as the sound of courts and fanfares, and why Baroque composers had to write in the extreme high register, where the notes crowd together, to get a singable line out of it.",
						"The valve solves it by combinatorics: each one diverts the air through an extra length of tube that lowers the note by a tone, a semitone, or a tone and a half. Alone and combined, the three cover the six missing semitones.",
						"It's a three-bit system. And it's what lets Dizzy Gillespie, a century later, play lines at the speed bebop demands — because three fingers are faster than any other mechanical solution ever invented for a wind instrument."
					],
					pull: "A three-bit system — and it's what makes bebop fit in the hand."
				},
				{
					id: "trumpet-bell",
					instrument: "trumpet",
					explode: 0.1,
					focus: "bell",
					kicker: "The bell",
					title: "Projecting, and refusing to project",
					body: [
						"A narrow tube and open air are very different media. With no transition, almost all the energy would hit the opening and reflect back inside. The bell's exponential flare is that transition — and it doesn't treat all frequencies alike: the higher the wave, the more directional it leaves.",
						"That's where the ability to cut through an entire big band comes from. Dizzy bent his in 1953, after someone fell on the instrument at a party, and decided to keep it: angled up, he heard himself sooner.",
						"Miles Davis went the other way. He jammed in a Harmon mute with the stem pulled out, leaned into the microphone and refused everything the bell was built to do. The result is the most recognisable sound in modern jazz — made against the design of the instrument."
					]
				},
				{
					id: "trumpet-miles",
					instrument: "trumpet",
					explode: 0,
					focus: null,
					rotate: true,
					notes: [62, 64, 65, 67, 69, 67, 65, 64],
					kicker: "New York, 1959",
					title: "Miles Davis, or playing less",
					body: [
						"<em>Kind of Blue</em> was recorded in two sessions, from sketches rather than written parts, with almost no rehearsal. The idea was subtraction: where bebop stacked a chord every two beats, <em>So What</em> lets a single scale run for eight, sixteen bars. There is no grid to chase — there is space, and you had better have something to say in it.",
						"That musical decision has an exact mechanical version, and it lives in the instrument. Middle register, no vibrato, few notes, and the Harmon mute with the stem out, held against the microphone. Gillespie asked the bell to cut through an entire big band; Miles asked the bell to be quiet and handed the job of projecting to the microphone. From him on, the electricity of the studio is part of the instrument.",
						"And he made the same move his whole life. The <em>Birth of the Cool</em> sessions, in 1949 and 1950, had already traded big-band brightness for a chamber-sized front line. The second quintet, formed in 1964 with Wayne Shorter, Herbie Hancock, Ron Carter and Tony Williams, dissolved fixed song form from the inside. In 1969 <em>Bitches Brew</em> threw all of it into a rock studio, and by the 1970s the trumpet was coming out through an amplifier and a wah-wah pedal.",
						"An instrument with no new part in a hundred and fifty years, used five times over to change the subject. What changed, every time, was what he decided not to play."
					],
					pull: "Gillespie asked the bell to cut through the big band. Miles asked it to be quiet."
				},
				{
					id: "trumpet-apart",
					instrument: "trumpet",
					explode: 1,
					focus: null,
					rotate: true,
					kicker: "Eleven parts",
					title: "All of this comes apart",
					body: [
						"Mouthpiece, leadpipe, tuning slide, three valves, three valve slides, the casing block and the bell. Each casing is machined to micrometre clearances: the piston has to drop fast and still not leak air.",
						"Turn it, click the parts. No loop of tube is there for looks — each one exists to add a specific length."
					]
				},
				{
					id: "trumpet-culture",
					instrument: "trumpet",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "The lineage",
					title: "From Armstrong to the bandstand",
					body: [
						"After Armstrong and Gillespie came Clifford Brown, whose clean articulation became the ruler everyone measured against; then Lee Morgan and Freddie Hubbard, who all but defined the Blue Note sound of the 1960s; then Booker Little and Woody Shaw, who pushed the harmony forward before dying far too early.",
						"In Brazil the trumpet has another biography. Cláudio Roditi and Márcio Montarroyos carried the Brazilian instrument into the international circuit, but the more important story is older and more collective: the trumpet leads the frevo line, and it is the instrument of the <em>bandas de música</em> and <em>filarmônicas</em>.",
						"In the interior of the country those civic brass bands were, for generations, the only formal music school within reach. A great many Brazilian musicians read their first score in a bandstand, on an instrument the band itself lent them.",
						"And the Brazilian trumpet has a repertoire of its own: Silvério Pontes playing choro and frevo alongside Zé da Velha's trombone is a lineage that never passes through New York at all."
					]
				}
			],
			gallery: {
				kicker: "Portraits",
				title: "The people who made this tube talk",
				plates: [
					{
						src: "armstrong",
						full: 1600,
						ratio: 1.5,
						position: "center 42%",
						alt: "Louis Armstrong playing the trumpet in a light suit, a white handkerchief in the hand holding the instrument.",
						body: [
							"Armstrong in 1953 — twenty-five years after the twelve seconds of <em>West End Blues</em>, still with the handkerchief in his hand. It wasn't a prop: he sweated while playing and wiped his face between phrases, and it became as much a part of the silhouette as the smile.",
							"Look at how the fingers fall on the valves. The three stems this whole chapter tried to explain fit under one hand — and that economy is why the trumpet is fast. Look at the mouth, too: playing high for decades has a price, and Armstrong lived with lip damage his whole career without ever giving up the sound everyone after him tried to copy."
						],
						credit:
							"Louis Armstrong, 1953. Photo: New York World-Telegram & Sun staff photographer — Library of Congress, public domain, via Wikimedia Commons.",
						creditUrl: "https://commons.wikimedia.org/wiki/File:Louis_Armstrong_restored.jpg"
					},
					{
						src: "gillespie",
						full: 1600,
						ratio: 1.35,
						position: "center 44%",
						alt: "Dizzy Gillespie in a beret and round glasses, smiling, the trumpet resting on his arm.",
						body: [
							"Gillespie in 1947, photographed by William P. Gottlieb — the reporter who documented nearly every face named in this feature and later placed the whole archive in the public domain.",
							"The trumpet here is still straight. The bent bell, the detail he is recognised by to this day, only appeared in 1953, by accident, and became a choice once he realised he liked hearing his own sound arrive sooner. Otherwise: a stock instrument, three valves, and the phrasing speed that made the rest of the century run to keep up."
						],
						credit:
							"Dizzy Gillespie, New York, ca. May 1947. Photo: William P. Gottlieb — Library of Congress, Music Division (gottlieb.03141), public domain, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Portrait_of_Dizzy_Gillespie,_New_York,_N.Y.,_ca._May_1947.jpg"
					},
					{
						src: "miles",
						full: 1600,
						ratio: 1.5,
						position: "center 50%",
						alt: "Miles Davis playing trumpet on a festival stage in a cap and dark glasses, surrounded by keyboards and drums.",
						body: [
							"Miles Davis at the North Sea Jazz Festival in The Hague, July 1984 — twenty-five years after <em>Kind of Blue</em>. The stage is electric: keyboards stacked to the right, guitar behind, drums to the left. In the middle of all that, the oldest object in the picture is the one in his hands: three valves, a system unchanged since 1815.",
							"Look at the bell. Painted black, his name written across it in script, turned into the stage rather than out at the audience, with the stem of a microphone clipped to its rim. It is the decision this whole chapter is about, in hardware form: ever since the Harmon mute of the 1950s, projecting stopped being the metal's job. The metal makes the note; the electricity covers the rest of the distance to the audience."
						],
						credit:
							"Miles Davis at the North Sea Jazz Festival, The Hague, 15 July 1984. Photo: Rob Bogaerts / Anefo — Nationaal Archief, CC0, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:North_Sea_Jazzfestival_in_Den_Haag_Miles_Davis,_Bestanddeelnr_933-0327.jpg"
					},
					{
						src: "fanfarra",
						full: 1440,
						ratio: 1.6,
						position: "center 58%",
						alt: "A school marching band parading down a cobbled street in a small town, residents watching from the kerb.",
						body: [
							"7 September 1971, Conceição dos Ouros, in southern Minas Gerais. The school band parades on the cobblestones and the whole town watches from the kerb. With small variations, this is the scene that trained most Brazilian wind players.",
							"It isn't folklore, it's infrastructure. Civic bands, philharmonics, school <em>fanfarras</em> and municipal corporations were, for generations, the country's music education network outside the capitals — a borrowed instrument, a score on the bandstand, a teacher who learned from another teacher. From frevo to the symphony orchestra, a striking number of Brazilian careers start exactly here."
						],
						credit:
							"G.E.C.O. marching band, Independence Day parade, 7 September 1971, Conceição dos Ouros (MG). Arquivos Históricos de Conceição dos Ouros, public domain, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Concei%C3%A7%C3%A3o_dos_Ouros_-_fanfarra_do_G.E.C.O._no_desfile_de_7_de_setembro_de_1971_(10).jpg"
					}
				]
			}
		},
		{
			id: "saxophone",
			numeral: "II",
			marker: "110 cm",
			markerLabel: "of conical tubing",
			name: "Saxophone",
			standfirst:
				"Rejected by the orchestra it was built for, it was adopted by another music — and became the voice of the century.",
			steps: [
				{
					id: "sax-voice",
					instrument: "saxophone",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "New York, October 1939",
					title: "The day the tenor became a voice",
					body: [
						"Coleman Hawkins walks into a studio, records <em>Body and Soul</em> almost without touching the melody, and the tenor saxophone stops being a section instrument and becomes a first-person narrator. The record becomes a commercial hit — which nobody expected from three minutes of improvising over a ballad.",
						"Ever since, the saxophone is the instrument jazz talks in most. Lester Young answers Hawkins with the opposite: light tone, behind the beat, economical phrasing. Charlie Parker takes the alto to a speed and a harmony nobody had imagined. John Coltrane plays it the way one prays.",
						"None of this was the plan. The saxophone wasn't even supposed to be there."
					]
				},
				{
					id: "sax-history",
					instrument: "saxophone",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "1846",
					title: "The instrument nobody wanted",
					body: [
						"Almost every instrument is the result of centuries of anonymous adjustment. Not the saxophone: it has an author, a date and a patent. Adolphe Sax, a Belgian maker working in Paris, registered it in 1846, wanting to join two families that didn't speak to each other — the conical body and projection of brass with the reed and keys of the woodwinds.",
						"He designed it for military bands, and there it went. The symphony orchestra never really adopted it: to this day the saxophone is an occasional guest, not a member. Its inventor spent much of his life in patent litigation that bankrupted him more than once.",
						"Half a century later, across the Atlantic, an instrument with no canon, no obligatory repertoire and no tradition to respect fell into exactly the right hands. Having no rules was its luck."
					],
					pull: "It reached the 20th century with no canon and no rules. That was its luck."
				},
				{
					id: "sax-reed",
					instrument: "saxophone",
					explode: 0.22,
					focus: "reed",
					kicker: "The reed",
					title: "Half a millimetre of cane",
					body: [
						"This is the only part that actually vibrates, and the only disposable one. A blade of <em>Arundo donax</em> under half a millimetre thick at the tip, slapping against the mouthpiece face and cutting the air into pulses.",
						"It lasts a few weeks, costs almost nothing, and decides almost everything. Two reeds from the same box sound different — which is why saxophonists open a box, test them one by one and throw half away. Ben Webster's growl and Dexter Gordon's edge both start here, in a piece of dried grass."
					],
					pull: "The cheapest part of the instrument is the one that decides how it sounds."
				},
				{
					id: "sax-cone",
					instrument: "saxophone",
					explode: 0.12,
					focus: "body",
					kicker: "The bore",
					title: "The cone changes everything",
					body: [
						"The clarinet is also played with a single reed, and still sounds and behaves differently. The difference is here: the clarinet is cylindrical, the saxophone is conical end to end.",
						"The consequence is enormous. An open cone produces the full harmonic series and overblows at the <strong>octave</strong>; a reed-stopped cylinder skips to the <strong>twelfth</strong>. That's why the sax repeats the same fingering an octave up with a single key, while the clarinet has to relearn its fingerings when it changes register.",
						"In practice: the sax is easier to play fast across its whole range. It's one of the reasons it, and not the clarinet, inherited jazz after the big band era."
					]
				},
				{
					id: "sax-keys",
					instrument: "saxophone",
					explode: 0.2,
					focus: "keywork",
					notes: [49, 51, 53, 55, 56, 58, 60, 58, 56, 55, 53, 51],
					kicker: "The mechanism",
					title: "Keys because the hand can't reach",
					body: [
						"Shortening the air column is simple: open a hole. The problem is that the acoustically correct holes are too big for a finger to cover and too far apart from each other.",
						"The keywork is the bridge between ideal acoustics and human anatomy. Hinge rods, needle springs, arms and leather pads let a small finger close, in exactly the right place, a hole it could never cover.",
						"Watch the pads shutting from the top down as the scale descends. Multiply that by the speed of a Parker chorus and you understand why saxophone repair is a profession."
					]
				},
				{
					id: "sax-coltrane",
					instrument: "saxophone",
					explode: 0,
					focus: "keywork",
					notes: [53, 56, 53, 58, 55, 58, 55, 60],
					kicker: "New York, 1959–1965",
					title: "John Coltrane takes the mechanism to its limit",
					body: [
						"In May 1959, a few weeks after recording <em>Kind of Blue</em> in Miles's band, Coltrane walked into a studio with <em>Giant Steps</em>: a tune that changes tonal centre every two beats, moving in major thirds, at close to 290 beats per minute. Both records come out of the same year and point in opposite directions — one taking harmony away, the other packing in more of it than the bar can hold.",
						"The critic Ira Gitler had already named it: <em>sheets of sound</em>. Notes at a density where they stop being heard one at a time and start being heard as texture. And this is where the mechanism from the previous step becomes the subject. Every one of those notes is a mechanical event — an arm that turns, a spring that returns it, a pad that has to seal on time. The famously absurd hours of daily practice weren't only discipline: they were training an interface between the idea and the leather.",
						"Then he goes the other way. <em>A Love Supreme</em>, recorded in December 1964 with the quartet of McCoy Tyner, Jimmy Garrison and Elvin Jones, rests on a four-note motif — the one the mechanism is playing on screen right now — repeated and transposed through all twelve keys. The smallest possible number of notes, worked with the same obstinacy he had brought to the largest.",
						"And in 1960, on <em>My Favorite Things</em>, he took the soprano saxophone out of the closet, an instrument almost nobody had taken seriously since Sidney Bechet: the same cone, half the length, an octave up. By the end of his life, playing above the intended register with multiphonics and forced overtones, he was producing sounds no fingering chart accounts for. Adolphe Sax's design was barely a century old; Coltrane found where it ended."
					],
					pull: "The practice hours weren't discipline: they were training an interface between the idea and the leather."
				},
				{
					id: "sax-apart",
					instrument: "saxophone",
					explode: 1,
					focus: null,
					rotate: true,
					kicker: "Eight parts",
					title: "Brass outside, woodwind inside",
					body: [
						"Reed, mouthpiece, ligature, neck, body, keywork, bow and bell. It is all brass — and the saxophone still plays in the woodwind section, because what defines the family isn't the material of the tube, it's how the sound is born.",
						"It is the exception that explains the entire classification."
					]
				},
				{
					id: "sax-brazil",
					instrument: "saxophone",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "The lineage",
					title: "From bebop to forró",
					body: [
						"Sonny Rollins proved you could hold up an entire trio with no chordal instrument. Ornette Coleman threw out the grid. Wayne Shorter and Joe Henderson rewrote what a tenor could say inside a Blue Note record.",
						"In Brazil, Pixinguinha swapped the flute for the tenor sax later in life and brought choro along with him in the move. Paulo Moura crossed between the concert hall and popular music his whole career without asking anyone's permission.",
						"After them, Carlos Malta and Nailor Proveta showed you could play choro, baião and big band on the same horn without changing accent.",
						"And the saxophone is a fixture of frevo and forró: across the northeast it is as popular as the accordion, and just as unceremonious. No other instrument on this page crosses so many genres without sounding foreign in any of them."
					]
				}
			],
			gallery: {
				kicker: "Portraits",
				title: "The cane, the brass and the voice",
				plates: [
					{
						src: "hawkins",
						full: 1600,
						ratio: 1.5,
						position: "center 34%",
						alt: "Coleman Hawkins playing tenor saxophone in a club, eyes closed, an old ribbon microphone beside him.",
						body: [
							"Hawkins at the Spotlite, on 52nd Street, around September 1946 — seven years after <em>Body and Soul</em>, in the club where this way of playing was already the standard everyone else had to answer.",
							"The photo frames the only part that vibrates without ever showing it: the reed is in there, hidden between his lower lip and the mouthpiece table, costing about as much as a coffee and deciding everything. Everything else in the picture — the brass cone, the keywork, the upturned bell — exists only to filter what that half-millimetre of cane is doing."
						],
						credit:
							"Coleman Hawkins at the Spotlite, New York, ca. September 1946. Photo: William P. Gottlieb — Library of Congress, public domain, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:(Portrait_of_Coleman_Hawkins,_Spotlite_(Club),_New_York,_N.Y.,_ca._Sept._1946)_(LOC)_(4843746292).jpg"
					},
					{
						src: "parker",
						full: 1600,
						ratio: 1.35,
						position: "center 8%",
						alt: "Charlie Parker in profile playing alto saxophone in a pinstriped suit, a double bass behind him.",
						body: [
							"Charlie Parker in 1947, at the height of the quintet with Miles Davis and Max Roach. That's an alto, not a tenor: a smaller instrument, less travel for the hand, a faster scale — which matters when the phrases are these.",
							"Look at the mouth. Lower lip folded over the teeth, chin stretched flat, cheek firm: that is the real machine, and it is made of muscle. The mechanism this whole page takes apart only solves the geometry. Whether a thin sound or Parker's sound comes out is decided by the embouchure."
						],
						credit:
							"Charlie Parker, ca. August 1947. Photo: William P. Gottlieb — Library of Congress, Music Division (gottlieb.06851), public domain, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Charlie_Parker,_(Gottlieb_06851)_(cropped).jpg"
					},
					{
						src: "coltrane",
						full: 1600,
						ratio: 1.35,
						position: "center 55%",
						alt: "John Coltrane receiving an award on the Concertgebouw stage, tenor saxophone around his neck and a soprano held across his hands, beside the sleeve of the album Giant Steps.",
						body: [
							"Amsterdam, 20 November 1961. Coltrane collects the Edison award on the Concertgebouw stage, and someone holds the winning record up beside him: <em>Giant Steps</em> — the tune that changes tonal centre every two beats, recorded two years earlier.",
							"The photo has both saxophones of this chapter in one frame. Around his neck, the tenor, its keywork visible top to bottom — rods, arms and pads, the bridge between the acoustics and the hand. Across the bottom, the soprano: same cone, half the length, an octave up. It was the instrument almost nobody took seriously, and he had pulled it back out of obscurity thirteen months before, recording <em>My Favorite Things</em>."
						],
						credit:
							"John Coltrane receives the Edison award for Giant Steps, Concertgebouw, Amsterdam, 20 November 1961. Photo: Dave Brinkman / Anefo — Nationaal Archief, CC0, via Wikimedia Commons.",
						creditUrl: "https://commons.wikimedia.org/wiki/File:JohnColtrane1961orig.jpg"
					},
					{
						src: "spok",
						full: 1600,
						ratio: 1.6,
						position: "center 45%",
						alt: "Maestro Spok playing saxophone on a street stage in Olinda, costumed children behind him.",
						body: [
							"Maestro Spok at Olinda's anniversary celebration in 2011. Leading the Spok Frevo Orquestra, he does to frevo roughly what Hawkins did to the ballad: he takes functional music — written to make a street move — and improvises over it in the first person.",
							"It's the same saxophone as in the two previous photos, played at 130 steps per minute under the Pernambuco sun. Note who is standing behind him: the frevo audience is children in costume, and the orchestra plays standing, without music stands, walking. Pixinguinha, Paulo Moura, Spok — the Brazilian lineage of this instrument runs wherever there are people in the street."
						],
						credit:
							"Maestro Spok at Olinda's anniversary, 2011. Photo: Ádria de Sousa / Prefeitura de Olinda, CC BY 2.0, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Maestro_Spok_-_Anivers%C3%A1rio_de_Olinda_2011.jpg"
					}
				]
			}
		},
		{
			id: "trombone",
			numeral: "III",
			marker: "274 cm",
			markerLabel: "of tubing",
			name: "Trombone",
			standfirst:
				"Five hundred years without changing its mechanism, and it still learned to play bebop.",
			steps: [
				{
					id: "trombone-tailgate",
					instrument: "trombone",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "New Orleans, 1910s",
					title: "The only one who needed room",
					body: [
						"The bands paraded on wagons, and the trombonist was the only one who needed clear space in front to extend the slide. He got the tailgate. The style that came out of there — full of smears, growls and cross-rhythm answers under the melody — became known as <em>tailgate</em>, and Kid Ory is the name attached to it.",
						"The trombone entered jazz through the physical position it occupied on a wagon. Few instruments have an aesthetic origin quite so literally logistical.",
						"Then came Jack Teagarden, who proved you could sing on it as naturally as you sing with your mouth."
					]
				},
				{
					id: "trombone-slide",
					instrument: "trombone",
					explode: 0,
					focus: "outer-slide",
					notes: [58, 57, 56, 55, 54, 53, 52, 53, 54, 55, 56, 57],
					kicker: "The slide",
					title: "The only one without steps",
					body: [
						"Valves add fixed pieces of tube; keys open holes in fixed positions. Both work in discrete pitches: there is C and there is C sharp, and nothing in between.",
						"The slide has no such limit. It varies the length continuously, which means that between any two notes there are infinitely many others. That's why the trombone plays a true glissando and no other wind instrument does — the others only imitate one, bending with the embouchure.",
						"It is also why it's the hardest to play in tune. No mechanism puts the note in place: the place is a memory in the arm."
					],
					pull: "No mechanism puts the note in place. The place is a memory in the arm."
				},
				{
					id: "trombone-positions",
					instrument: "trombone",
					explode: 0,
					focus: "inner-slide",
					notes: [58, 56, 54, 52],
					kicker: "Seven positions",
					title: "Why they get further apart",
					body: [
						"Seven references, each a semitone below the last. But they are not evenly spaced: from first to second the arm travels a few centimetres; from sixth to seventh, considerably more.",
						"The reason is that frequency falls by ratio, not by subtraction. Lowering a semitone requires a percentage of the tube — and the same percentage of an already lengthened tube is more centimetres. The scale is geometric.",
						"Now imagine hitting that at bebop speed. In 1947 J. J. Johnson started playing bop lines on the trombone with an articulation nobody thought physically possible on an instrument without valves — and rewrote, single-handedly, what could be expected of a right arm."
					],
					pull: "J. J. Johnson rewrote single-handedly what could be expected of a right arm."
				},
				{
					id: "trombone-bell",
					instrument: "trombone",
					explode: 0.12,
					focus: "bell",
					kicker: "The bell",
					title: "Same physics, twice the tube",
					body: [
						"Acoustically, trombone and trumpet are nearly the same instrument: buzzing lips, a bore cylindrical for two thirds of its length, an exponential bell. The trombone simply has twice the tubing — and so sounds an octave lower.",
						"The bell follows: twenty centimetres across, twice the area of the trumpet's. A larger surface radiates low frequencies better, exactly the ones this instrument produces.",
						"It's worth saying where it came from, because the contrast is funny: before the wagon in New Orleans, the trombone spent centuries inside churches doubling choir voices, and it was the timbre of the solemn. Mozart uses it that way in the <em>Tuba mirum</em> of the Requiem. Beethoven took it out in 1808, in the finale of the Fifth."
					]
				},
				{
					id: "trombone-apart",
					instrument: "trombone",
					explode: 1,
					focus: null,
					rotate: true,
					kicker: "Two halves",
					title: "This is how it fits in a case",
					body: [
						"The trombone separates into two sections that lock together: the slide and the bell. It is the only reason an instrument nearly a metre and a half long travels in a rectangular box.",
						"And the slide is the finest-tolerance part in the whole brass family. It rides on a film of water and lubricant; a dent invisible to the eye is enough to jam it. Hence the first rule every trombonist learns: never pick up a trombone by the slide."
					]
				},
				{
					id: "trombone-brazil",
					instrument: "trombone",
					explode: 0,
					focus: null,
					rotate: true,
					kicker: "The lineage",
					title: "From bop to frevo",
					body: [
						"Curtis Fuller walks into Coltrane's <em>Blue Train</em> in 1957 and shows the trombone as a front-line voice, not section filler. Slide Hampton and Grachan Moncur III take the instrument into modern harmony.",
						"In Brazil, Raul de Souza carried the Brazilian trombone into the world, recording with Milton Nascimento, Sérgio Mendes, Airto Moreira and George Duke — and brought back a phrasing that was neither American nor quite anyone else's.",
						"Zé da Velha and Bocato went another way: choro, forró and frevo played with the same right arm, far from the jazz circuit and with no ceremony about it.",
						"And in the carnival of Pernambuco the trombone is the backbone of the frevo orchestra: the section that gives the genre its weight, its tear and its insistence. It's the same tube from the 15th century, still picking up repertoire."
					]
				}
			],
			gallery: {
				kicker: "Portraits",
				title: "The right arm, on three continents",
				plates: [
					{
						src: "teagarden",
						full: 1024,
						ratio: 1.35,
						position: "center 62%",
						alt: "Jack Teagarden in a studio, hand cupped to his ear, trombone resting on his arm in front of a microphone.",
						body: [
							"Jack Teagarden at the Victor studio in 1947, hand cupped to his ear — the gesture of someone checking his own intonation inside his head rather than against a mechanism.",
							"It is the exact picture of what the chapter argues: on an instrument with no valves and no keys, the note has no marked place. The arm memorises the distance and the ear corrects the rest. Teagarden sang and played in alternating phrases, and the resemblance between the two isn't a coincidence: both are continuous pitch, tuned by ear."
						],
						credit:
							"Jack Teagarden at the Victor studio, New York, ca. May 1947. Photo: William P. Gottlieb — Library of Congress, public domain, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Jack_Teagarden,_Victor_studio,_New_York,_N.Y.,_ca._May_1947_(William_P._Gottlieb_08381).jpg"
					},
					{
						src: "frevo",
						full: 1600,
						ratio: 1.6,
						position: "center 48%",
						alt: "A brass section playing in the street in Olinda: slide trombones in the foreground, saxophones and a sousaphone behind.",
						body: [
							"Olinda, carnival. Three trombones in the foreground, slides extended over the hill, and behind them the whole section: saxophones, trumpets, a sousaphone holding down the bass.",
							"Here the slide stops being a tuning problem and becomes a space problem — exactly as on the New Orleans wagon a century earlier. Playing trombone in a parade means spending the afternoon negotiating a metre and a half of tubing with the crowd. And frevo's signature tear, the rising smear that opens the arrangements, exists only because this is the one wind instrument that can pass through every pitch on the way."
						],
						credit:
							"Frevo orchestra in Olinda, 2013. Photo: Prefeitura de Olinda, CC BY 2.0, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Frevo_orchestra_-_Olinda,_Pernambuco,_Brazil.jpg"
					},
					{
						src: "raul",
						full: 1600,
						ratio: 1.6,
						position: "center 42%",
						alt: "Raul de Souza playing trombone in close-up, eyes closed, the bell filling the centre of the frame.",
						body: [
							"Raul de Souza in 2018, at an Austrian festival, aged 84. A Rio native trained in an air force band, he left Brazil in the 1960s and recorded with Milton Nascimento, Sérgio Mendes, Airto Moreira and George Duke before coming back — always with a phrasing that was neither American nor quite anyone else's.",
							"The photo catches the instrument from its most photogenic and most misunderstood side: the enormous bell, which is only the end of the story. What decides the note is out of frame, in his right hand, a metre away. Raul died in 2021, playing almost to the end."
						],
						credit:
							"Raul de Souza at the Inntöne festival, 2018. Photo: Schorle, CC BY-SA 4.0, via Wikimedia Commons.",
						creditUrl:
							"https://commons.wikimedia.org/wiki/File:Raul_de_Souza_Next_Generation_Band_17.jpg"
					}
				]
			}
		}
	],

	honk: {
		kicker: "Where this continues",
		title: "The street band is the original format",
		body: [
			"Nothing in this feature started in a concert hall. The trumpet came from military signalling and the town bandstand; the saxophone was designed for military bands and adopted by the street; the trombone entered jazz because it was the only instrument that needed clear space at the back of a wagon. All three are, at heart, instruments of movement — built to sound outdoors, unamplified, walking.",
			"Which is why they turn up in so much different music, almost never in the same role. In New Orleans the brass bands played funerals and parades before they played jazz, and jazz took shape out of what was already on the street: military march, ragtime, blues and the Caribbean lilt Jelly Roll Morton called the <em>Spanish tinge</em>. The traffic never ran one way — eighty years later the city's brass bands took the funk and hip-hop of those same pavements back in, with the Dirty Dozen and Rebirth, and the parade started sounding like the city around it again.",
			"In Brazil the same three tubes came through another door: the town bands of the interior, playing in squares and bandstands, which trained generations of wind players before any school did. Out of them came the brass that Rio's choro put to use, the horn sections of samba and the frevo orchestra — born in the carnival of Recife by crossing the marches of military bands with maxixe, and still, today, brass music played walking. The exchange ran north as well: Pixinguinha's Oito Batutas landed in Paris in 1922, bossa nova and cool jazz met in the 1960s, and trombonists like Raul de Souza went to record in the United States — coming back with a phrasing that belonged to neither place.",
			"HONK! is the contemporary version of that arrangement — and from here on the story has photographs."
		],
		plates: [
			{
				src: "honk",
				full: 1600,
				ratio: 1.6,
				position: "center 45%",
				alt: "A crowd gathered around a street band at dusk, seen from above through blossoming branches, at Honk Fest West in Seattle.",
				body: [
					"The first edition gathered street bands in <strong>Somerville, Massachusetts, in 2006</strong>: non-profit, no fee for the musicians, no stage, no ticket and no electricity, collectively produced, with the bands playing in the middle of the crowd rather than facing it. From there the recipe spread to other cities and other countries.",
					"This is one of them, four years later: Honk Fest West, in Seattle, shot from above at dusk. There is no stage in the picture because there is no stage — the band is down there, inside the circle that closed around it."
				],
				credit:
					"Honk Fest West, Georgetown, Seattle, USA, 2010. Photo: Joe Mabel, CC BY-SA 3.0, via Wikimedia Commons.",
				creditUrl: "https://commons.wikimedia.org/wiki/File:Honk_Fest_West_2010-137.jpg"
			},
			{
				src: "honk-sp-1",
				full: 1600,
				ratio: 1.6,
				position: "center 45%",
				alt: "A street band and its crowd filling a road tunnel in São Paulo during HONK! SP: a sign reading HONK!, a red and yellow flag, stilt walkers and snare drums in the middle of the crowd.",
				body: [
					"The first Brazilian HONK! took place in <strong>2016</strong>, and since then the festival has passed through Rio de Janeiro, São Paulo, Brasília and Porto Alegre. Belo Horizonte joined the map in <strong>2019</strong>, with three days of programming paid for the same way the festival is organised: 147 people crowdfunded the first edition, closing at 151% of the target.",
					"This is the 2025 São Paulo edition, inside a road tunnel — a concrete ceiling, which hands the whole sound back to whoever is underneath it. Drums on one side, horns on the other, people watching from the overpass, and nobody with an assigned place, because there is no front."
				],
				credit:
					"HONK! SP 2025, José Roberto Fanganiello Melhem tunnel, São Paulo, November 2025. Photo: ProtoplasmaKid, CC BY-SA 4.0, via Wikimedia Commons.",
				creditUrl:
					"https://commons.wikimedia.org/wiki/File:Festival_de_fanfarrias_HONK!_SP_2025_06.jpg"
			},
			{
				src: "honk-sp-2",
				full: 1600,
				ratio: 1.6,
				position: "center 50%",
				alt: "From inside the band: the brass of a horn carried on a shoulder in the foreground and, ahead of it, the back of a musician in a shirt reading “quem sopra respira” — whoever blows, breathes.",
				body: [
					"This photograph was taken from inside the band, not from the pavement. What you see first is the brass of a horn carried on a shoulder; then the back of the player alongside, wearing the line that sums up this whole feature — <em>quem sopra respira</em>, whoever blows, breathes.",
					"In Brazil, HONK! landed on prepared ground. Street carnival was already where these bands live: a brass bloco rehearses all year to play walking, without microphones, in the same brass-and-percussion formation the new street bands use — which they inherit, at once, from jazz brass bands, French <em>fanfares</em> and the bandstand bands of the Brazilian interior. In Belo Horizonte, a city that rebuilt its own street carnival over the past decade, the distance between an activist brass band and a carnival bloco is close to just a date on the calendar.",
					"The <strong>HONK!BH International Street Band Festival</strong> takes place on <strong>29 August 2026</strong>, free, in the streets of the city. If you got here by taking three instruments apart on screen, this is the assembled version: the same tubes, on the pavement, with the acoustics they were designed for."
				],
				credit:
					"HONK! SP 2025, José Roberto Fanganiello Melhem tunnel, São Paulo, November 2025. Photo: ProtoplasmaKid, CC BY-SA 4.0, via Wikimedia Commons.",
				creditUrl:
					"https://commons.wikimedia.org/wiki/File:Festival_de_fanfarrias_HONK!_SP_2025_21.jpg"
			}
		],
		linkLabel: "HONK!BH · 29 August 2026 · Belo Horizonte",
		linkUrl:
			"https://portalbelohorizonte.com.br/eventos/festival/cultural/festival-internacional-de-fanfarras-honkbh"
	},

	player: {
		cue: "Listen",
		close: "Close player",
		hint: "30-second preview. Signed in to Spotify, you get the whole recording."
	},

	spec: {
		kicker: "Specifications",
		title: "Side by side",
		lede: "Not everything made of brass is a brass instrument. What defines the family is how the sound is born, not what the tube is made of.",
		rows: [
			{
				label: "Family",
				values: { trumpet: "Brass", saxophone: "Woodwind (despite the brass)", trombone: "Brass" }
			},
			{
				label: "What vibrates",
				values: {
					trumpet: "The player's lips",
					saxophone: "A single cane reed",
					trombone: "The player's lips"
				}
			},
			{
				label: "Bore shape",
				values: {
					trumpet: "Cylindrical for ~2/3, then the bell",
					saxophone: "Conical end to end",
					trombone: "Cylindrical for ~2/3, then the bell"
				}
			},
			{
				label: "How pitch changes",
				values: {
					trumpet: "3 valves add fixed lengths of tube",
					saxophone: "Keys open and close tone holes",
					trombone: "The slide lengthens the tube continuously"
				}
			},
			{
				label: "Tube length",
				values: { trumpet: "≈ 148 cm", saxophone: "≈ 110 cm", trombone: "≈ 274 cm" }
			},
			{
				label: "Transposition",
				values: {
					trumpet: "B♭ — sounds a tone lower",
					saxophone: "E♭ — sounds a major 6th lower",
					trombone: "C — reads at concert pitch"
				}
			},
			{
				label: "Usual range",
				values: { trumpet: "E3 – D6", saxophone: "D♭3 – A5", trombone: "E2 – D5" }
			},
			{
				label: "True glissando",
				values: {
					trumpet: "No — discrete pitches",
					saxophone: "Only approximated, with the embouchure",
					trombone: "Yes — the only one"
				}
			},
			{
				label: "Date of birth",
				values: {
					trumpet: "Valves, c. 1815",
					saxophone: "Adolphe Sax, 1846",
					trombone: "Sackbut, 15th century"
				}
			}
		]
	},

	coda: {
		kicker: "Workshop",
		title: "Now it's yours",
		lede: "Pick an instrument, take it apart, play it. The keys drive the real mechanism: every note shows the fingering, slide position or keywork it requires.",
		enableAudio: "Enable sound",
		audioReady: "Sound on",
		audioPrompt: "Audio starts muted — browsers require a click before any sound plays.",
		volume: "Volume",
		explode: "Disassemble",
		assembled: "assembled",
		disassembled: "apart",
		autoRotate: "Spin",
		resetView: "Reframe",
		partsTitle: "Parts",
		partsHint: "Click a part — in the list or on the model.",
		selectPart: "Pick a part to see what it does.",
		keyboardHint: "A W S E D F T G Y H U J · Z and X shift octave",
		monophonicNote:
			"Wind instruments are monophonic: a new note replaces the previous one, slurred. You can't play a chord — not here, and not for real.",
		nowPlaying: "Playing",
		spectrumTitle: "Spectrum",
		spectrumHint: "How the harmonics are distributed is what makes each timbre sound different.",
		midiTitle: "MIDI",
		midiUnsupported: "This browser doesn't implement the Web MIDI API (try Chrome or Edge).",
		midiDenied: "MIDI permission denied.",
		midiSearching: "No devices found.",
		midiConnected: "Connected to",
		midiConnect: "Connect MIDI keyboard"
	},

	readout: {
		valves: "valves",
		valvesRest: "at rest",
		slide: "slide position",
		slideRest: "1st position",
		keys: "holes closed",
		keysRest: "all open",
		octave: "octave"
	},

	names: {
		trumpet: "Trumpet",
		saxophone: "Saxophone",
		trombone: "Trombone"
	},

	webglError: "Your browser couldn't start WebGL.",
	skipToPlay: "Skip to the workshop",

	parts: {
		trumpet: {
			mouthpiece: {
				name: "Mouthpiece",
				description:
					"Cup, throat and shank. The lips buzz inside the cup and the throat constricts the flow — swapping mouthpieces changes the sound more than swapping trumpets."
			},
			leadpipe: {
				name: "Leadpipe",
				description:
					"The first stretch after the mouthpiece, slightly conical. That taper sets the resistance the player feels and how readily each harmonic locks in."
			},
			"tuning-slide": {
				name: "Main tuning slide",
				description:
					"The U-bend at the front. Pulled out, it lengthens the tube and flattens the whole instrument — the coarse adjustment made before playing."
			},
			"valve-block": {
				name: "Valve block",
				description:
					"The three cylindrical casings and the knuckles joining them. Each casing is machined to micrometre clearances so the piston can drop fast without leaking air."
			},
			"piston-1": {
				name: "1st valve",
				description:
					"Routes the air through the longest of the three slides: lowers the note by a whole tone. Index finger."
			},
			"piston-2": {
				name: "2nd valve",
				description:
					"The shortest detour on the instrument: lowers the note by a semitone. Middle finger."
			},
			"piston-3": {
				name: "3rd valve",
				description:
					"Lowers the note by a tone and a half — the equivalent of 1+2, and it exists to give alternative fingerings and better intonation. Ring finger."
			},
			"slide-1": {
				name: "1st valve slide",
				description:
					"The extra tube the 1st valve inserts. On many trumpets it carries a thumb trigger, because the 1+3 and 1+2+3 fingerings come out sharp and need correcting in real time."
			},
			"slide-2": {
				name: "2nd valve slide",
				description:
					"The smallest of them all, a few centimetres of tube. A semitone is cheap: proportionally it's the smallest change in the system."
			},
			"slide-3": {
				name: "3rd valve slide",
				description:
					"The longest one, and the one with the ring for the ring finger. The ring isn't decoration: on the sharp fingerings the player pushes the slide out while playing."
			},
			bell: {
				name: "Bell",
				description:
					"The back bow and the flare. The exponential opening matches the impedance of the narrow tube to open air — without it, most of the energy would reflect back inside."
			}
		},
		saxophone: {
			reed: {
				name: "Reed",
				description:
					"A blade of cane under half a millimetre thick at the tip. It's the only part that vibrates and the only disposable one — it lasts a few weeks and defines most of the character of the sound."
			},
			mouthpiece: {
				name: "Mouthpiece",
				description:
					"Hard rubber or metal, with a flat table where the reed sits and an internal chamber. Tip opening and facing length change the response completely."
			},
			ligature: {
				name: "Ligature",
				description:
					"The band clamping the reed to the mouthpiece. It looks trivial, but how freely it lets the reed vibrate audibly changes the timbre."
			},
			neck: {
				name: "Neck",
				description:
					"The curved tube joining mouthpiece to body, with the octave key built in. Sliding the mouthpiece along the cork tunes the whole instrument."
			},
			body: {
				name: "Body",
				description:
					"The main cone, with the tone hole chimneys soldered along it. That taper is what separates the sax from the clarinet."
			},
			keywork: {
				name: "Keywork",
				description:
					"Hinge rods, needle springs, arms and pads. It exists because the acoustically correct holes are too large and too far apart for a human hand."
			},
			bow: {
				name: "Bow",
				description:
					"The U-turn at the bottom. Pure practicality: folding the cone keeps the required length without turning the sax into a metre and a half of vertical tube."
			},
			bell: {
				name: "Bell",
				description:
					"The upturned flare, carrying the low B and B♭ keys. Only the lowest notes actually leave through here."
			}
		},
		trombone: {
			mouthpiece: {
				name: "Mouthpiece",
				description:
					"Much larger and deeper than the trumpet's. A wide cup asks the lips to vibrate more slowly — that's what puts the instrument in the low register."
			},
			"outer-slide": {
				name: "Outer slide",
				description:
					"The part the right hand moves. It rides on a film of water and lubricant; it's the finest-tolerance part in the whole brass family."
			},
			"inner-slide": {
				name: "Inner slide",
				description:
					"The two fixed tubes the outer slide runs on, with the stockings doing the sealing. The brace between them is where the left hand carries the entire instrument."
			},
			gooseneck: {
				name: "Gooseneck",
				description:
					"The curved stretch carrying air from the slide to the tuning slide. It's also the joint that splits the trombone in two halves."
			},
			"tuning-slide": {
				name: "Tuning slide",
				description:
					"The U at the back, behind the player's head. It adjusts overall pitch without disturbing the slide positions, which are body references memorised over years."
			},
			counterweight: {
				name: "Counterweight",
				description:
					"A brass disc clamped between the legs of the tuning slide. Without it all the weight would sit ahead of the left hand, and the right arm would lose its freedom."
			},
			bell: {
				name: "Bell",
				description:
					"Twenty centimetres across — twice the area of the trumpet's. A bigger bell radiates low frequencies better."
			}
		}
	}
};

export const copy: Record<string, PageCopy> = { pt, en };

export const getCopy = (locale: string): PageCopy => copy[locale] ?? copy.en;
