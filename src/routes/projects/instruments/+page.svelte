<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { get } from "svelte/store";
	import { beforeNavigate } from "$app/navigation";
	import { locale } from "../../../i18n";
	import {
		darkTheme,
		defaultTheme,
		selectedTheme,
		setCustomBackground,
		setCustomColor,
		setCustomFontFamily,
		setCustomSecondaryColor,
		setCustomVisitedColor,
		themes
	} from "../../../lib/store";
	import InstrumentViewer from "../../../lib/components/instruments/InstrumentViewer.svelte";
	import MechanismReadout from "../../../lib/components/instruments/MechanismReadout.svelte";
	import VirtualKeyboard from "../../../lib/components/instruments/VirtualKeyboard.svelte";
	import SpectrumScope from "../../../lib/components/instruments/SpectrumScope.svelte";
	import InstrumentIcon from "../../../lib/components/instruments/InstrumentIcon.svelte";
	import PlatePlayer from "../../../lib/components/instruments/PlatePlayer.svelte";
	import { playingPlate } from "../../../lib/instruments/spotify";
	import { trackFor } from "../../../lib/instruments/tracks";
	import { getCopy } from "../../../lib/instruments/copy";
	import type { Chapter, Gallery, PageCopy, Step } from "../../../lib/instruments/copy";
	import {
		fingeringFor,
		fingeringForWritten,
		isBlackKey,
		midiToName,
		toSounding,
		toWritten,
		writtenRange
	} from "../../../lib/instruments/fingerings";
	import { connectMidi, KEYBOARD_MAP, midiSupported } from "../../../lib/instruments/midi";
	import type { MidiDevice, MidiSession, MidiStatus } from "../../../lib/instruments/midi";
	import type { InstrumentAudio } from "../../../lib/instruments/audio";
	import type { InstrumentId } from "../../../lib/instruments/types";

	const ORDER: InstrumentId[] = ["trumpet", "saxophone", "trombone"];
	/** Traços espaçados como a série harmônica: 0, 1/2, 2/3, 3/4… */
	const HARMONICS = Array.from({ length: 15 }, (_, i) => 1 - 1 / (i + 1));

	$: c = getCopy($locale);

	/* ── Tema ──────────────────────────────────────────────────────────────────
	   Esta página nasce escura: latão sobre preto é o contraste em que os três
	   modelos leem melhor. Aplicamos a paleta escura direto nas variáveis de
	   tema, sem tocar em `selectedTheme` — assim o cookie de preferência do site
	   não muda, e o alternador do cabeçalho continua valendo se a pessoa quiser
	   claro. Ao sair da página, o tema original volta.                          */

	let forcedDark = false;

	function applyTheme(theme: typeof darkTheme) {
		setCustomBackground(theme.backgroundColor);
		setCustomColor(theme.mainColor);
		setCustomFontFamily(theme.fontFamily);
		setCustomVisitedColor(theme.visitedColor);
		setCustomSecondaryColor(theme.secondaryColor);

		const root = document.documentElement.style;
		root.setProperty("--backgroundColor", theme.backgroundColor);
		root.setProperty("--mainColor", theme.mainColor);
		root.setProperty("--fontFamily", theme.fontFamily);
		root.setProperty("--visitedColor", theme.visitedColor);
		root.setProperty("--secondaryColor", theme.secondaryColor);
	}

	$: dark = forcedDark || $selectedTheme === "darkTheme";

	/* ── Narrativa ─────────────────────────────────────────────────────────── */

	type Block =
		| { kind: "chapter"; chapter: Chapter; index: number }
		| { kind: "step"; step: Step; index: number };

	/**
	 * Um segmento é um capítulo com o palco 3D dele. A reportagem é dividida
	 * assim — e não numa rolagem única — porque entre um capítulo e o outro entra
	 * uma galeria de fotos que ocupa a largura inteira da página: para ela passar
	 * por cima, o palco fixo precisa terminar ali.
	 */
	interface Segment {
		id: InstrumentId;
		blocks: Block[];
		/** Índice global do primeiro passo do segmento. */
		firstStep: number;
		gallery: Gallery;
	}

	function buildNarrative(copy: PageCopy) {
		const steps: Step[] = [];
		const segments: Segment[] = [];
		/** Índice global do passo → segmento a que ele pertence. */
		const segmentOfStep: number[] = [];

		// O prólogo não tem capítulo próprio: entra no primeiro, que é do mesmo
		// instrumento.
		let blocks: Block[] = copy.prologue.map((step) => {
			const block: Block = { kind: "step", step, index: steps.length };
			steps.push(step);
			return block;
		});

		for (const chapter of copy.chapters) {
			// A abertura do capítulo aponta para o primeiro passo dele: assim o
			// instrumento já troca junto com o título, e não uma tela depois.
			blocks.push({ kind: "chapter", chapter, index: steps.length });
			const firstStep = steps.length;
			for (const step of chapter.steps) {
				blocks.push({ kind: "step", step, index: steps.length });
				steps.push(step);
			}
			for (let index = firstStep; index < steps.length; index++)
				segmentOfStep[index] = segments.length;
			segments.push({ id: chapter.id, blocks, firstStep, gallery: chapter.gallery });
			blocks = [];
		}

		// Os passos do prólogo ficam com o primeiro segmento.
		for (let index = 0; index < segmentOfStep.length; index++)
			if (segmentOfStep[index] === undefined) segmentOfStep[index] = 0;

		return { steps, segments, segmentOfStep };
	}

	$: narrative = buildNarrative(c);
	$: steps = narrative.steps;
	$: segments = narrative.segments;

	let activeIndex = 0;
	/** Índice global do passo que manda em cada palco. */
	let activeBySegment: number[] = [];
	$: if (activeBySegment.length !== segments.length)
		activeBySegment = segments.map((segment) => segment.firstStep);

	$: active = steps[activeIndex] ?? steps[0];
	$: activeSegment = narrative.segmentOfStep[activeIndex] ?? 0;

	/* Palcos entram em cena sob demanda: três contextos WebGL montados de uma vez
	   custam caro no celular, e só um deles está visível por vez. */
	let mounted = new Set<number>();

	/** Palcos ainda não montados, na ordem dos segmentos. */
	let waiting: (HTMLElement | null)[] = [];

	/**
	 * Monta o que estiver a menos de uma tela e meia de distância. Roda na
	 * rolagem: são no máximo três medições, e cada palco sai da lista ao montar.
	 * Sem `requestAnimationFrame` de propósito — ele não roda em aba de segundo
	 * plano, e a página precisa estar pronta quando a aba voltar.
	 */
	function checkStages() {
		let next: Set<number> | null = null;
		waiting.forEach((node, index) => {
			if (!node || mounted.has(index)) return;
			const rect = node.getBoundingClientRect();
			if (rect.top > window.innerHeight * 1.6 || rect.bottom < -window.innerHeight * 0.6) return;
			next = (next ?? new Set(mounted)).add(index);
			waiting[index] = null;
		});
		if (next) mounted = next;
	}

	/**
	 * Só registra o nó: a medição fica para o `onMount`, porque durante a
	 * hidratação o layout ainda não existe e todos os palcos pareceriam visíveis.
	 */
	function mountWhenNear(node: HTMLElement, index: number) {
		waiting[index] = node;
		return {
			destroy() {
				waiting[index] = null;
			}
		};
	}

	let reducedMotion = false;
	let observer: IntersectionObserver | null = null;

	/**
	 * Um passo assume o comando quando cruza a faixa de disparo. No desktop ela
	 * fica no meio da tela; no celular o palco ocupa o topo, então a faixa desce
	 * para a área de leitura — senão o passo que manda não é o que está sendo
	 * lido.
	 */
	function ensureObserver() {
		if (observer || typeof IntersectionObserver === "undefined") return observer;
		const stacked = window.matchMedia("(max-width: 900px)").matches;
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const index = Number((entry.target as HTMLElement).dataset.stepIndex);
					if (Number.isNaN(index)) continue;
					activeIndex = index;
					const segment = narrative.segmentOfStep[index];
					if (segment !== undefined && activeBySegment[segment] !== index) {
						activeBySegment[segment] = index;
						activeBySegment = activeBySegment;
					}
				}
			},
			{ rootMargin: stacked ? "-70% 0px -22% 0px" : "-45% 0px -45% 0px" }
		);
		return observer;
	}

	function watchStep(node: HTMLElement) {
		const io = ensureObserver();
		io?.observe(node);
		return {
			destroy() {
				io?.unobserve(node);
			}
		};
	}

	/* Notas de demonstração: animam o mecanismo em loop, sem som. */
	let demoNote: number | null = null;
	let demoTimer: ReturnType<typeof setInterval> | undefined;

	function runDemo(step: Step | undefined) {
		clearInterval(demoTimer);
		demoNote = null;
		if (!step?.notes?.length) return;
		const notes = step.notes;
		let cursor = 0;
		demoNote = notes[0];
		demoTimer = setInterval(() => {
			cursor = (cursor + 1) % notes.length;
			demoNote = notes[cursor];
		}, 1300);
	}

	$: runDemo(active);
	$: narrativeFingering =
		demoNote === null || !active ? null : fingeringFor(active.instrument, demoNote);
	// As notas da narrativa vêm da cópia em altura real; o mostrador mostra a
	// nota escrita, que é a que corresponde à digitação ao lado dela.
	$: narrativeNote =
		demoNote === null || !active ? null : toWritten(active.instrument, demoNote);

	/* ── Oficina ───────────────────────────────────────────────────────────── */

	let instrument: InstrumentId = "trumpet";
	let explode = 0;
	let autoRotate = false;
	let selectedPart: string | null = null;
	let activeNotes: number[] = [];
	let octaveShift = 0;
	let volume = 0.85;
	let codaViewer: InstrumentViewer;

	let audio: InstrumentAudio | null = null;
	let audioReady = false;
	let audioLoading = false;

	let midiSession: MidiSession | null = null;
	let midiStatus: MidiStatus | "idle" = "idle";
	let midiDevices: MidiDevice[] = [];

	// A oficina inteira — teclado, notas ativas, mostrador — fala em altura
	// escrita, que é a que explica a digitação: no trompete em Sib o Dó é solto e
	// o Ré é 1+3, como na parte. A conversão para altura real acontece num lugar
	// só, na entrada do áudio, porque o que sai do instrumento é o som real.
	$: range = writtenRange(instrument);
	$: partIds = Object.keys(c.parts[instrument]);
	$: lastNote = activeNotes.length ? activeNotes[activeNotes.length - 1] : null;
	$: codaFingering = lastNote === null ? null : fingeringForWritten(instrument, lastNote);

	// O teclado desenhado cobre toda a extensão do instrumento — assim qualquer
	// nota alcançável pelo Z e pelo X acende nele. Começa e termina em tecla
	// branca, senão sobra uma preta pendurada fora do desenho.
	$: keyboardLow = isBlackKey(range.low) ? range.low + 1 : range.low;
	$: keyboardHigh = isBlackKey(range.high) ? range.high - 1 : range.high;

	// A janela do teclado do computador — 18 semitons, de A a ' — desliza dentro
	// da extensão. Nas pontas ela encosta no limite em vez de passar dele: notas
	// fora da extensão seriam dobradas de volta por `fold`, o que anulava o
	// deslocamento e fazia o Z e o X parecerem mortos.
	const KEY_SPAN = Math.max(...Object.values(KEYBOARD_MAP));
	$: playLow = Math.min(
		Math.max(Math.ceil(range.low / 12) * 12 + octaveShift * 12, keyboardLow),
		keyboardHigh - KEY_SPAN
	);

	/** Dobra notas fora da extensão para dentro dela, em oitavas. */
	function fold(written: number) {
		let note = written;
		while (note < range.low) note += 12;
		while (note > range.high) note -= 12;
		return note;
	}

	function noteOn(written: number, velocity = 0.8) {
		const note = fold(written);
		if (activeNotes.includes(note)) return;
		activeNotes = [...activeNotes, note];
		audio?.noteOn(toSounding(instrument, note), velocity);
	}

	function noteOff(written: number) {
		const note = fold(written);
		activeNotes = activeNotes.filter((value) => value !== note);
		audio?.noteOff(toSounding(instrument, note));
	}

	function allOff() {
		activeNotes.forEach((note) => audio?.noteOff(toSounding(instrument, note)));
		activeNotes = [];
		held.clear();
	}

	async function enableAudio() {
		if (audioReady || audioLoading) return;
		audioLoading = true;
		try {
			const { createAudio } = await import("../../../lib/instruments/audio");
			audio = await createAudio();
			await audio.unlock();
			audio.setInstrument(instrument);
			audio.setVolume(volume);
			audioReady = true;
		} finally {
			audioLoading = false;
		}
	}

	async function enableMidi() {
		await enableAudio();
		midiSession?.dispose();
		midiSession = await connectMidi({
			onNoteOn: (note, velocity) => noteOn(note, Math.max(velocity, 0.25)),
			onNoteOff: (note) => noteOff(note),
			onDevices: (devices) => (midiDevices = devices)
		});
		midiStatus = midiSession.status;
	}

	function selectInstrument(id: InstrumentId) {
		if (id === instrument) return;
		allOff();
		instrument = id;
		selectedPart = null;
		audio?.setInstrument(id);
	}

	// Guarda a nota que cada tecla disparou, e não só o código: se o Z ou o X
	// mexerem na oitava com a tecla ainda apertada, o desligamento precisa ir na
	// nota que soou, senão ela fica presa.
	const held = new Map<string, number>();

	function onKeyDown(event: KeyboardEvent) {
		if (event.metaKey || event.ctrlKey || event.altKey) return;
		const target = event.target as HTMLElement | null;
		if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

		if (event.code === "KeyZ") return void (octaveShift = Math.max(octaveShift - 1, -1));
		if (event.code === "KeyX") return void (octaveShift = Math.min(octaveShift + 1, 1));

		const offset = KEYBOARD_MAP[event.code];
		if (offset === undefined || held.has(event.code)) return;
		const note = playLow + offset;
		held.set(event.code, note);
		event.preventDefault();
		noteOn(note);
	}

	function onKeyUp(event: KeyboardEvent) {
		const note = held.get(event.code);
		if (note === undefined) return;
		held.delete(event.code);
		noteOff(note);
	}

	onMount(() => {
		reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		checkStages();
		if (midiSupported()) midiStatus = "idle";

		if (get(selectedTheme) !== "darkTheme") {
			applyTheme(darkTheme);
			forcedDark = true;
		}

		// Se a pessoa mexer no alternador do site, ela assume o controle: paramos
		// de forçar o escuro e não restauramos nada ao sair.
		let first = true;
		return selectedTheme.subscribe(() => {
			if (first) first = false;
			else forcedDark = false;
		});
	});

	/** Devolve o tema do site ao sair — a paleta escura era só desta página. */
	function restoreTheme() {
		if (!forcedDark) return;
		forcedDark = false;
		applyTheme(themes[get(selectedTheme)] ?? defaultTheme);
	}

	// Dois ganchos de propósito: `beforeNavigate` cobre a saída por link, e
	// `onDestroy` cobre qualquer outra desmontagem. `restoreTheme` é idempotente.
	beforeNavigate(restoreTheme);

	onDestroy(() => {
		restoreTheme();
		clearInterval(demoTimer);
		observer?.disconnect();
		midiSession?.dispose();
		audio?.dispose();
	});

	$: audio?.setVolume(volume);

	// Uma gravação começou numa das fotos: solta o que o sintetizador estiver
	// segurando. Nota presa por cima de Armstrong não ajuda a ouvir nenhum dos
	// dois — e o teclado continua disponível, é só tocar de novo.
	$: if ($playingPlate) allOff();
</script>

<svelte:head>
	<title>{c.opener.title} — Victor Góis</title>
	<meta name="description" content={c.opener.standfirst} />
	<!-- Fraunces (serifada larga e de baixo contraste, com os eixos `opsz` e
	     `SOFT` fixos — ver a folha de estilo) + Archivo (gótica americana) para
	     leitura. Só nesta página. -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<!-- O embed do Spotify só aceita o comando de tocar depois de subir. Abrir a
	     conexão antes encurta essa espera — é a diferença entre a faixa começar
	     sozinha e a pessoa ter de apertar play de novo. -->
	<link rel="preconnect" href="https://open.spotify.com" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..600,0..100;1,9..144,400..600,0..100&family=Archivo:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
	/>
</svelte:head>

<svelte:window
	on:keydown={onKeyDown}
	on:keyup={onKeyUp}
	on:blur={allOff}
	on:scroll={checkStages}
	on:resize={checkStages}
/>

<article style:--brass={dark ? "#d9a441" : "#8f6516"}>
	<!-- ── Abertura ────────────────────────────────────────────────────────── -->
	<header class="opener">
		<p class="kicker">{c.opener.kicker}</p>
		<div class="opener-title">
			<h1>
				{c.opener.title}<br /><em>{c.opener.titleBreak}</em>
			</h1>
			<p class="marks">
				{#each ORDER as id}
					<InstrumentIcon instrument={id} label={c.names[id]} />
				{/each}
			</p>
		</div>
		<p class="standfirst">{c.opener.standfirst}</p>
		<div class="opener-foot">
			<span class="meta">{c.opener.meta}</span>
			<a class="skip" href="#oficina">{c.skipToPlay}</a>
		</div>
		<div class="harmonic" aria-hidden="true">
			{#each HARMONICS as position}
				<span style:left={`${position * 100}%`} />
			{/each}
		</div>
	</header>

	<!-- ── Narrativa ───────────────────────────────────────────────────────── -->
	{#each segments as segment, index (segment.id)}
		{@const shown = steps[activeBySegment[index] ?? segment.firstStep] ?? steps[0]}
		{@const owns = activeSegment === index}
		<section class="scrolly">
			<div class="stage">
				<div class="stage-inner" use:mountWhenNear={index}>
					<p class="stage-tag">
						<span>{c.names[shown.instrument]}</span>
					</p>

					<div class="stage-canvas">
						{#if mounted.has(index)}
							<InstrumentViewer
								instrument={shown.instrument}
								explode={shown.explode}
								focus={shown.focus}
								autoRotate={!!shown.rotate && !reducedMotion}
								fingering={owns ? narrativeFingering : null}
								pickable={false}
							>
								<span slot="error">{c.webglError}</span>
							</InstrumentViewer>
						{/if}
					</div>

					<div class="stage-readout">
						<MechanismReadout
							instrument={shown.instrument}
							fingering={owns ? narrativeFingering : null}
							note={owns ? narrativeNote : null}
							readout={c.readout}
							locale={$locale}
						/>
					</div>
				</div>
			</div>

			<div class="narrative">
				{#each segment.blocks as block (block.kind === "chapter" ? block.chapter.id : block.step.id)}
					{#if block.kind === "chapter"}
						<div class="chapter-open" data-step-index={block.index} use:watchStep>
							<div class="harmonic" aria-hidden="true">
								{#each HARMONICS as position}
									<span style:left={`${position * 100}%`} />
								{/each}
							</div>
							<p class="numeral">{block.chapter.numeral}</p>
							<p class="marker">
								<span class="marker-value">{block.chapter.marker}</span>
								<span class="marker-label">{block.chapter.markerLabel}</span>
							</p>
							<h2>{block.chapter.name}</h2>
							<p class="chapter-standfirst">{block.chapter.standfirst}</p>
						</div>
					{:else}
						<div
							class="step"
							class:is-active={activeIndex === block.index}
							data-step-index={block.index}
							use:watchStep
						>
							{#if block.step.kicker}
								<p class="kicker">{block.step.kicker}</p>
							{/if}
							{#if block.step.title}
								<h3>{block.step.title}</h3>
							{/if}
							{#each block.step.body as paragraph}
								<p>{@html paragraph}</p>
							{/each}
							{#if block.step.pull}
								<blockquote>{block.step.pull}</blockquote>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		</section>

		<!-- ── Fotografias do capítulo ──────────────────────────────────────── -->
		<section class="plates">
			<div class="plates-head">
				<p class="kicker">{segment.gallery.kicker}</p>
				<h2>{segment.gallery.title}</h2>
			</div>

			{#each segment.gallery.plates as plate (plate.src)}
				{@const track = trackFor(plate.src)}
				<figure class="plate" style:--ratio={plate.ratio} style:--pos={plate.position ?? "center"}>
					<div class="plate-frame">
						<picture>
							<source
								type="image/webp"
								sizes="100vw"
								srcset="/images/instruments/{plate.src}-900.webp 900w, /images/instruments/{plate.src}-1600.webp {plate.full}w"
							/>
							<img
								src="/images/instruments/{plate.src}-1600.jpg"
								sizes="100vw"
								srcset="/images/instruments/{plate.src}-900.jpg 900w, /images/instruments/{plate.src}-1600.jpg {plate.full}w"
								alt={plate.alt}
								loading="lazy"
								decoding="async"
							/>
						</picture>
						{#if track}
							<PlatePlayer id={plate.src} {track} lang={$locale} labels={c.player} />
						{/if}
					</div>
					<figcaption>
						{#each plate.body as paragraph}
							<p>{@html paragraph}</p>
						{/each}
						<p class="credit">
							<a href={plate.creditUrl} target="_blank" rel="noopener noreferrer">{plate.credit}</a>
						</p>
					</figcaption>
				</figure>
			{/each}
		</section>
	{/each}

	<!-- ── HONK!BH ─────────────────────────────────────────────────────────── -->
	<section class="honk">
		<div class="honk-head">
			<p class="kicker">{c.honk.kicker}</p>
			<h2>{c.honk.title}</h2>
		</div>

		<!-- A abertura vem antes das fotos, na coluna de leitura: o resto da
		     história está repartido entre as legendas, cada trecho na foto que o
		     ilustra. -->
		<div class="honk-lede">
			{#each c.honk.body as paragraph}
				<p>{@html paragraph}</p>
			{/each}
		</div>

		{#each c.honk.plates as plate, index (plate.src)}
			{@const track = trackFor(plate.src)}
			<figure class="plate" style:--ratio={plate.ratio} style:--pos={plate.position ?? "center"}>
				<div class="plate-frame">
					<picture>
						<source
							type="image/webp"
							sizes="100vw"
							srcset="/images/instruments/{plate.src}-900.webp 900w, /images/instruments/{plate.src}-1600.webp {plate.full}w"
						/>
						<img
							src="/images/instruments/{plate.src}-1600.jpg"
							sizes="100vw"
							srcset="/images/instruments/{plate.src}-900.jpg 900w, /images/instruments/{plate.src}-1600.jpg {plate.full}w"
							alt={plate.alt}
							loading="lazy"
							decoding="async"
						/>
					</picture>
					{#if track}
						<PlatePlayer id={plate.src} {track} lang={$locale} labels={c.player} />
					{/if}
				</div>
				<figcaption>
					{#each plate.body as paragraph}
						<p>{@html paragraph}</p>
					{/each}
					<!-- O convite fecha a seção: só depois da última foto. -->
					{#if index === c.honk.plates.length - 1}
						<p class="honk-link">
							<a href={c.honk.linkUrl} target="_blank" rel="noopener noreferrer">
								{c.honk.linkLabel}
							</a>
						</p>
					{/if}
					<p class="credit">
						<a href={plate.creditUrl} target="_blank" rel="noopener noreferrer">{plate.credit}</a>
					</p>
				</figcaption>
			</figure>
		{/each}
	</section>

	<!-- ── Ficha técnica ───────────────────────────────────────────────────── -->
	<section class="spec">
		<div class="spec-head">
			<p class="kicker">{c.spec.kicker}</p>
			<h2>{c.spec.title}</h2>
			<p class="lede">{c.spec.lede}</p>
		</div>

		<div class="table-scroll">
			<table>
				<thead>
					<tr>
						<th scope="col"><span class="visually-hidden">{c.spec.title}</span></th>
						{#each ORDER as id}
							<th scope="col">
								<InstrumentIcon instrument={id} label={c.names[id]} />
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each c.spec.rows as row}
						<tr>
							<th scope="row">{row.label}</th>
							{#each ORDER as id}
								<td>{row.values[id]}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<!-- ── Oficina ─────────────────────────────────────────────────────────── -->
	<section class="coda" id="oficina">
		<div class="coda-head">
			<p class="kicker">{c.coda.kicker}</p>
			<h2>{c.coda.title}</h2>
			<p class="lede">{c.coda.lede}</p>
		</div>

		<nav class="tabs" aria-label={c.coda.title}>
			{#each ORDER as id}
				<button
					type="button"
					class="tab"
					class:active={instrument === id}
					on:click={() => selectInstrument(id)}
				>
					{c.names[id]}
				</button>
			{/each}
		</nav>

		<div class="workshop">
			<div class="workshop-main">
				<div class="workshop-stage">
					<InstrumentViewer
						bind:this={codaViewer}
						bind:selectedPart
						{instrument}
						{explode}
						{autoRotate}
						focus={null}
						fingering={codaFingering}
					>
						<span slot="error">{c.webglError}</span>
					</InstrumentViewer>

					<div class="workshop-readout">
						<MechanismReadout
							{instrument}
							fingering={codaFingering}
							note={lastNote}
							readout={c.readout}
							locale={$locale}
						/>
					</div>
				</div>

				<!-- Desmontar mora sob o palco, encostado na leitura do mecanismo: o
				     controle e o que ele move ficam à mesma distância do olho. -->
				<label class="slider explode">
					<span>
						{c.coda.explode}
						<em>
							{explode === 0
								? c.coda.assembled
								: explode === 1
								? c.coda.disassembled
								: `${Math.round(explode * 100)}%`}
						</em>
					</span>
					<input type="range" min="0" max="1" step="0.01" bind:value={explode} />
				</label>
			</div>

			<aside class="workshop-panel">
				<div class="row">
					<button type="button" class:on={autoRotate} on:click={() => (autoRotate = !autoRotate)}>
						{c.coda.autoRotate}
					</button>
					<button type="button" on:click={() => codaViewer?.reframe()}>{c.coda.resetView}</button>
				</div>

				<h4>{c.coda.partsTitle}</h4>
				<p class="hint">{c.coda.partsHint}</p>
				<ul class="parts">
					{#each partIds as id}
						<li>
							<button
								type="button"
								class:active={selectedPart === id}
								on:click={() => (selectedPart = selectedPart === id ? null : id)}
							>
								{c.parts[instrument][id].name}
							</button>
						</li>
					{/each}
				</ul>

				<div class="detail">
					{#if selectedPart && c.parts[instrument][selectedPart]}
						<h5>{c.parts[instrument][selectedPart].name}</h5>
						<p>{c.parts[instrument][selectedPart].description}</p>
					{:else}
						<p class="muted">{c.coda.selectPart}</p>
					{/if}
				</div>
			</aside>
		</div>

		<div class="play">
			<div class="play-head">
				{#if audioReady}
					<span class="badge">● {c.coda.audioReady}</span>
				{:else}
					<button type="button" class="primary" on:click={enableAudio} disabled={audioLoading}>
						{audioLoading ? "…" : c.coda.enableAudio}
					</button>
					<span class="hint">{c.coda.audioPrompt}</span>
				{/if}
			</div>

			<VirtualKeyboard
				low={keyboardLow}
				high={keyboardHigh}
				active={activeNotes}
				locale={$locale}
				on:noteon={(event) => noteOn(event.detail)}
				on:noteoff={(event) => noteOff(event.detail)}
			/>

			<p class="hint">
				<code>{c.coda.keyboardHint}</code>
				<code class="shift">A = {midiToName(playLow, $locale)}</code>
			</p>
<!-- 			<p class="hint">{c.coda.monophonicNote}</p>
 -->
			<div class="play-grid">
				<div>
					<h4>{c.coda.spectrumTitle}</h4>
					<SpectrumScope {audio} {dark} accent={dark ? "rgb(200, 232, 16)" : "tomato"} />
					<p class="hint">{c.coda.spectrumHint}</p>
				</div>

				<div>
					<h4>{c.coda.midiTitle}</h4>
					{#if !midiSupported()}
						<p class="hint">{c.coda.midiUnsupported}</p>
					{:else if midiStatus === "connected"}
						{#if midiDevices.length}
							<p class="hint">
								{c.coda.midiConnected}
								<strong>{midiDevices.map((device) => device.name).join(", ")}</strong>
							</p>
						{:else}
							<p class="hint">{c.coda.midiSearching}</p>
						{/if}
					{:else if midiStatus === "denied"}
						<p class="hint">{c.coda.midiDenied}</p>
					{:else}
						<button type="button" on:click={enableMidi}>{c.coda.midiConnect}</button>
					{/if}

					<label class="slider volume">
						<span>{c.coda.volume}</span>
						<input type="range" min="0" max="1" step="0.01" bind:value={volume} />
					</label>
				</div>
			</div>
		</div>
	</section>
</article>

<style>
	/* ─────────────────────────────────────────────────────────────────────────
	   Sistema — página de revista, não cartaz.
	   Display: Fraunces com `opsz` travado no valor de texto. Trocou a Instrument
	            Serif porque aquela é uma display estreita e vertical: estica o
	            título e o faz gritar. Deixar o eixo óptico automático traria o
	            mesmo problema de volta — a Fraunces afina e estreita conforme o
	            corpo cresce. Presa em `opsz` 14 e com `SOFT` aberto, ela fica
	            larga, de traço parelho e com o calor das capas de disco dos anos
	            1970 — que é o assunto da matéria.
	   Texto:   Archivo — gótica americana, a família de que descendem as
	            Franklin/News Gothic das capas de Reid Miles para a Blue Note.
	   Rótulos: a monoespaçada do próprio site, amarrando a matéria ao blog.
	   O latão (--brass) é o hex exato do material dos modelos 3D.
	   ──────────────────────────────────────────────────────────────────────── */
	article {
		--paper: var(--backgroundColor);
		--ink: var(--mainColor);
		--accent: var(--visitedColor);
		--rule: color-mix(in srgb, var(--mainColor) 18%, transparent);
		--muted: color-mix(in srgb, var(--mainColor) 62%, transparent);
		--display: Fraunces, "DM Serif Display", Georgia, "Times New Roman", serif;
		--reading: Archivo, "Helvetica Neue", Helvetica, Arial, sans-serif;

		display: block;
		color: var(--ink);
		font-family: var(--reading);
	}

	/* Travar `opsz` no valor de texto é o que segura a largura: no automático o
	   navegador amarra o eixo óptico ao corpo, e a Fraunces afina e estreita
	   conforme o título cresce — de volta ao problema que a troca resolveu. */
	.opener h1,
	.chapter-open h2,
	.step h3,
	.spec h2,
	.coda h2,
	.plates-head h2,
	.honk-head h2,
	.marker-value,
	.tab {
		font-variation-settings: "opsz" 14, "SOFT" 40;
	}

	article :global(*) {
		box-sizing: border-box;
	}

	.kicker {
		font-family: var(--fontFamily);
		font-size: 0.62rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 0 0 1rem;
	}

	.hint {
		font-family: var(--fontFamily);
		font-size: 0.7rem;
		line-height: 1.6;
		color: var(--muted);
		margin: 0.35rem 0;
	}

	.hint .shift {
		margin-left: 0.6rem;
		color: var(--brass);
	}

	.lede {
		font-size: 0.94rem;
		line-height: 1.7;
		color: var(--muted);
		max-width: 46ch;
		margin: 0;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* Régua harmônica: traços em 0, 1/2, 2/3, 3/4… — a física da matéria
	   virando divisor de seção. */
	.harmonic {
		position: relative;
		height: 10px;
		width: 100%;
		max-width: 34rem;
	}

	.harmonic span {
		position: absolute;
		top: 0;
		width: 1px;
		height: 10px;
		background: var(--brass);
		opacity: 0.75;
	}

	/* ── Abertura ─────────────────────────────────────────────────────────── */
	.opener {
		max-width: 74rem;
		margin: 0 auto;
		padding: clamp(3rem, 12vh, 9rem) clamp(1.25rem, 5vw, 4rem) clamp(3rem, 9vh, 6rem);
	}

	/* O título e o trio de ícones dividem a mesma linha de base: os desenhos são
	   a assinatura da matéria, não uma ilustração solta. Quando a coluna aperta,
	   eles caem para baixo do título em vez de espremê-lo. */
	.opener-title {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: clamp(1.5rem, 4vw, 3.5rem);
		margin: 0 0 2rem;
	}

	/* A base de 26rem é o que faz o trio caber na mesma linha do título em tela
	   larga e cair para baixo dele quando não cabe mais. */
	.opener h1 {
		flex: 1 1 26rem;
		min-width: 0;
		font-family: var(--display);
		font-weight: 400;
		font-size: clamp(2.2rem, 5.4vw, 4.5rem);
		line-height: 1.02;
		letter-spacing: -0.02em;
		margin: 0;
	}

	.opener h1 em {
		font-style: italic;
		color: var(--brass);
	}

	.marks {
		flex: none;
		display: flex;
		align-items: flex-end;
		gap: clamp(0.9rem, 2.2vw, 1.6rem);
		margin: 0;
		padding-bottom: 0.3em;
		color: var(--brass);
		font-size: clamp(2rem, 3.6vw, 2.8rem);
	}

	.standfirst {
		font-size: clamp(0.95rem, 1.1vw, 1.08rem);
		line-height: 1.65;
		max-width: 54ch;
		margin: 0 0 2.5rem;
	}

	.opener-foot {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 1.5rem;
		margin-bottom: 1.4rem;
	}

	.meta,
	.skip {
		font-family: var(--fontFamily);
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.meta {
		color: var(--muted);
	}

	.skip {
		color: var(--accent);
		border-bottom: 1px solid currentColor;
	}

	/* ── Narrativa ────────────────────────────────────────────────────────── */
	.scrolly {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 30rem);
		gap: clamp(1.5rem, 4vw, 4rem);
		max-width: 96rem;
		margin: 0 auto;
		padding: 0 clamp(1.25rem, 5vw, 4rem);
	}

	.stage {
		position: sticky;
		top: 0;
		align-self: start;
		height: 100vh;
		height: 100svh;
	}

	.stage-inner {
		position: relative;
		height: 100%;
	}

	.stage-canvas {
		position: absolute;
		inset: 0;
	}

	.stage-tag {
		position: absolute;
		top: clamp(1rem, 4vh, 2.5rem);
		left: 0;
		z-index: 2;
		margin: 0;
		font-family: var(--fontFamily);
		font-size: 0.65rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--muted);
		pointer-events: none;
	}

	.stage-readout {
		position: absolute;
		left: 0;
		bottom: clamp(1rem, 6vh, 3.5rem);
		z-index: 2;
	}

	.narrative {
		min-width: 0;
	}

	.step {
		min-height: 92vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 5vh 0;
		opacity: 0.42;
		transition: opacity 0.55s ease;
	}

	.step.is-active {
		opacity: 1;
	}

	.step h3 {
		font-family: var(--display);
		font-weight: 400;
		font-size: clamp(1.3rem, 2vw, 1.72rem);
		line-height: 1.14;
		letter-spacing: -0.015em;
		margin: 0 0 1rem;
	}

	.step p {
		font-size: 1.01rem;
		line-height: 1.72;
		margin: 0 0 1.15rem;
	}

	.step p :global(em) {
		font-style: italic;
	}

	.step p :global(strong) {
		font-weight: 700;
	}

	blockquote {
		font-size: clamp(1.05rem, 1.4vw, 1.28rem);
		font-weight: 600;
		line-height: 1.28;
		letter-spacing: -0.015em;
		margin: 1.7rem 0 0;
		padding-left: 1.1rem;
		border-left: 3px solid var(--brass);
		color: var(--brass);
	}

	.chapter-open {
		min-height: 78vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 6vh 0 2vh;
	}

	.chapter-open .harmonic {
		margin-bottom: 2.2rem;
	}

	.numeral {
		font-family: var(--fontFamily);
		font-size: 0.72rem;
		letter-spacing: 0.4em;
		color: var(--muted);
		margin: 0 0 1.8rem;
	}

	/* O marcador do capítulo é o comprimento do tubo — o número que mais
	   define o que cada instrumento é. */
	.marker {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		margin: 0 0 0.4rem;
	}

	.marker-value {
		font-family: var(--display);
		font-size: clamp(2rem, 4.2vw, 3rem);
		line-height: 1;
		letter-spacing: -0.01em;
		color: var(--brass);
	}

	.marker-label {
		font-family: var(--fontFamily);
		font-size: 0.66rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.chapter-open h2 {
		font-family: var(--display);
		font-weight: 400;
		font-size: clamp(2rem, 4.4vw, 3.2rem);
		line-height: 1.04;
		letter-spacing: -0.02em;
		margin: 0.5rem 0 1.1rem;
	}

	.chapter-standfirst {
		font-size: 0.95rem;
		line-height: 1.65;
		max-width: 42ch;
		margin: 0;
		color: var(--muted);
	}

	/* ── Fotografias ──────────────────────────────────────────────────────── */

	/* As fotos são o único elemento da página que ocupa a largura toda: elas
	   interrompem a rolagem do palco e devolvem ao assunto o tamanho que ele tem
	   fora da tela. O texto que as explica volta para a coluna de leitura. */
	.plates,
	.honk {
		margin: clamp(3rem, 12vh, 7rem) 0 0;
	}

	.plates-head,
	.honk-head {
		max-width: 74rem;
		margin: 0 auto clamp(1.6rem, 5vh, 2.8rem);
		padding: 0 clamp(1.25rem, 5vw, 4rem);
	}

	.plate {
		margin: 0 0 clamp(2.5rem, 8vh, 5rem);
	}

	/* Mesma coluna das legendas: a abertura do HONK! e o texto que segue as fotos
	   são a mesma leitura, com a mesma medida de linha. */
	.honk-lede {
		max-width: 42rem;
		margin: 0 auto clamp(2rem, 6vh, 3.5rem);
		padding: 0 clamp(1.25rem, 5vw, 4rem);
	}

	.honk-lede p {
		font-size: 1.01rem;
		line-height: 1.72;
		margin: 0 0 1.1rem;
	}

	.honk-lede p :global(em) {
		font-style: italic;
	}

	.honk-lede p :global(strong) {
		font-weight: 700;
	}

	/* Âncora do player: ele é posicionado contra a foto, não contra a figura
	   inteira — a legenda embaixo não deve entrar na conta. */
	.plate-frame {
		position: relative;
		display: block;
	}

	.plate picture {
		display: block;
	}

	/* `--ratio` é o recorte pedido pela foto; `max-height` garante que nenhuma
	   delas empurre o texto seguinte para fora da tela. */
	.plate img {
		display: block;
		width: 100%;
		aspect-ratio: var(--ratio, 1.6);
		max-height: 86svh;
		object-fit: cover;
		object-position: var(--pos, center);
		background: color-mix(in srgb, var(--mainColor) 8%, transparent);
	}

	.plate figcaption {
		max-width: 42rem;
		margin: clamp(1.2rem, 3vh, 2rem) auto 0;
		padding: 0 clamp(1.25rem, 5vw, 4rem);
	}

	.plate figcaption p {
		font-size: 1.01rem;
		line-height: 1.72;
		margin: 0 0 1.1rem;
	}

	.plate figcaption p :global(em) {
		font-style: italic;
	}

	.plate figcaption p :global(strong) {
		font-weight: 700;
	}

	.credit {
		font-family: var(--fontFamily);
		font-size: 0.66rem !important;
		line-height: 1.7 !important;
		color: var(--muted);
		margin: 1.2rem 0 0 !important;
	}

	.credit a {
		color: inherit;
		text-decoration: none;
		border-bottom: 1px solid var(--rule);
	}

	.credit a:hover {
		color: var(--ink);
	}

	.honk {
		border-top: 1px solid var(--rule);
		padding-top: clamp(3rem, 9vh, 5rem);
	}

	.honk-link {
		font-family: var(--fontFamily);
		font-size: 0.72rem !important;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin: 1.6rem 0 0 !important;
	}

	.honk-link a {
		color: var(--brass);
		border-bottom: 1px solid currentColor;
		text-decoration: none;
	}

	/* ── Ficha técnica ────────────────────────────────────────────────────── */
	.spec {
		max-width: 74rem;
		margin: clamp(4rem, 14vh, 9rem) auto 0;
		padding: 0 clamp(1.25rem, 5vw, 4rem);
	}

	.spec-head,
	.coda-head {
		max-width: 46ch;
		margin-bottom: 2.5rem;
	}

	.spec h2,
	.coda h2,
	.plates-head h2,
	.honk-head h2 {
		font-family: var(--display);
		font-weight: 400;
		font-size: clamp(1.65rem, 3.2vw, 2.4rem);
		line-height: 1.08;
		letter-spacing: -0.02em;
		margin: 0 0 0.9rem;
	}

	.table-scroll {
		overflow-x: auto;
	}

	table {
		border-collapse: collapse;
		width: 100%;
		min-width: 640px;
	}

	/* O cabeçalho da tabela é o desenho do instrumento: numa grade de números,
	   a silhueta identifica a coluna mais rápido que o nome escrito. */
	thead th {
		font-weight: 400;
		text-align: left;
		padding: 0 1rem 0.9rem;
		border-bottom: 1px solid var(--ink);
		color: var(--brass);
	}

	thead th :global(.instrument-icon) {
		width: 2.75rem;
		height: 2.75rem;
	}

	tbody th {
		font-family: var(--fontFamily);
		font-weight: 400;
		font-size: 0.66rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-align: left;
		color: var(--muted);
		white-space: nowrap;
		padding: 0.95rem 1.5rem 0.95rem 0;
		vertical-align: top;
	}

	tbody td {
		font-size: 0.92rem;
		line-height: 1.5;
		padding: 0.95rem 1rem;
		border-bottom: 1px solid var(--rule);
		vertical-align: top;
	}

	tbody tr th {
		border-bottom: 1px solid var(--rule);
	}

	/* ── Oficina ──────────────────────────────────────────────────────────── */
	.coda {
		max-width: 74rem;
		margin: clamp(4rem, 14vh, 9rem) auto;
		padding: clamp(3rem, 8vh, 5rem) clamp(1.25rem, 5vw, 4rem) 0;
		border-top: 1px solid var(--rule);
		scroll-margin-top: 2rem;
	}

	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid var(--rule);
	}

	.tab {
		font-family: var(--display);
		font-size: 1.25rem;
		letter-spacing: -0.01em;
		text-transform: none;
		background: none;
		border: 0;
		border-bottom: 2px solid transparent;
		color: var(--muted);
		padding: 0 0 0.7rem;
		cursor: pointer;
		transition: color 0.2s ease, border-color 0.2s ease;
	}

	.tab:hover {
		color: var(--ink);
	}

	.tab.active {
		color: var(--ink);
		border-bottom-color: var(--brass);
	}

	.workshop {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 20rem);
		gap: clamp(1.5rem, 4vw, 3rem);
		align-items: start;
	}

	/* Palco e controle de desmontar são uma peça só: a coluna existe para manter
	   os dois juntos quando o painel de peças sai do lado. */
	.workshop-main {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		min-width: 0;
	}

	.workshop-stage {
		position: relative;
		height: min(66vh, 620px);
	}

	/* A leitura do mecanismo fica no canto inferior esquerdo do palco; o controle
	   segue essa borda em vez de atravessar a largura toda. */
	.slider.explode {
		max-width: 22rem;
	}

	.workshop-readout {
		position: absolute;
		left: 0;
		bottom: 0;
		pointer-events: none;
	}

	.workshop-panel h4 {
		font-family: var(--fontFamily);
		font-size: 0.65rem;
		font-weight: 400;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 1.8rem 0 0.4rem;
	}

	.slider {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-family: var(--fontFamily);
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.slider span {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		color: var(--muted);
	}

	.slider em {
		font-style: normal;
		color: var(--brass);
	}

	.slider input {
		width: 100%;
		accent-color: var(--accent);
	}

	.row {
		display: flex;
		gap: 0.6rem;
	}

	button {
		font-family: var(--fontFamily);
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.5rem 0.9rem;
		border: 1px solid var(--rule);
		background: transparent;
		color: var(--ink);
		cursor: pointer;
		transition: border-color 0.2s ease, color 0.2s ease;
	}

	button:hover:not(:disabled) {
		border-color: var(--brass);
	}

	button.on,
	button.active,
	button.primary {
		border-color: var(--brass);
		color: var(--brass);
	}

	button:disabled {
		opacity: 0.5;
		cursor: progress;
	}

	.parts {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		padding: 0;
		margin: 0.7rem 0 1.4rem;
	}

	.parts button {
		text-transform: none;
		letter-spacing: 0.02em;
		font-size: 0.7rem;
		padding: 0.28rem 0.55rem;
	}

	.detail {
		border-top: 1px solid var(--rule);
		padding-top: 1rem;
		min-height: 8rem;
	}

	.detail h5 {
		font-weight: 700;
		font-size: 1rem;
		letter-spacing: -0.015em;
		margin: 0 0 0.4rem;
	}

	.detail p {
		font-size: 0.88rem;
		line-height: 1.65;
		margin: 0;
	}

	.muted {
		color: var(--muted);
	}

	.play {
		margin-top: clamp(3rem, 8vh, 5rem);
		padding-top: 2.5rem;
		border-top: 1px solid var(--rule);
	}

	.play-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.badge {
		font-family: var(--fontFamily);
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--brass);
	}

	.play code {
		font-size: 0.66rem;
		letter-spacing: 0.06em;
		border-bottom: 1px solid var(--rule);
	}

	.play-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 18rem);
		gap: clamp(1.5rem, 4vw, 3rem);
		margin-top: 2.5rem;
	}

	.volume {
		margin-top: 1.2rem;
		max-width: 16rem;
	}

	/* ── Responsivo ───────────────────────────────────────────────────────── */
	@media (max-width: 900px) {
		.scrolly {
			grid-template-columns: minmax(0, 1fr);
			gap: 0;
		}

		/* No celular o palco encosta no topo, então precisa do fundo da página
		   para o texto passar por baixo dele. */
		.stage {
			height: 54svh;
			background: var(--paper);
			z-index: 2;
			padding-bottom: 0.5rem;
		}

		.stage::after {
			content: "";
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			height: 2.5rem;
			background: linear-gradient(var(--paper), transparent);
			pointer-events: none;
		}

		.stage-readout {
			bottom: 0.25rem;
			transform: scale(0.86);
			transform-origin: bottom left;
		}

		/* Os passos continuam altos o bastante para que só um esteja na faixa de
		   disparo por vez — do contrário a animação pula de assunto. */
		.step {
			min-height: 46svh;
			padding: 3vh 0;
			opacity: 1;
		}

		.chapter-open {
			min-height: 42svh;
			padding: 4vh 0 2vh;
		}

		.play-grid {
			grid-template-columns: minmax(0, 1fr);
		}

		/* Na tela estreita a oficina vira uma coluna só, e a ordem inverte: as
		   peças ficam acima do modelo. Assim quem toca num nome já tem o palco
		   logo abaixo, em vez de ter de rolar até ele para ver o destaque. */
		.workshop {
			display: flex;
			flex-direction: column;
			gap: 1.5rem;
		}

		.workshop-panel {
			order: -1;
		}

		.detail {
			min-height: 0;
		}

		/* O palco encolhe e o teclado encosta nele: o movimento do mecanismo e a
		   tecla que o provoca precisam caber na mesma tela. */
		.workshop-stage {
			height: 44svh;
			min-height: 240px;
		}

		.play {
			margin-top: 1rem;
			padding-top: 0;
			border-top: 0;
		}

		.play-head {
			margin-bottom: 0.9rem;
		}

		/* Na tela estreita a foto pode ser mais alta: cortar menos importa mais
		   que manter a proporção do desktop. */
		.plate img {
			aspect-ratio: min(var(--ratio, 1.6), 1.15);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.step,
		.tab,
		button {
			transition-duration: 0.01ms;
		}
	}
</style>
