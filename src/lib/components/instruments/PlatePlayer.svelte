<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { get } from "svelte/store";
	import { EMBED_ORIGIN, embedUrl, playingPlate } from "../../instruments/spotify";
	import type { Track } from "../../instruments/tracks";

	/**
	 * O player que fica sobre uma fotografia da reportagem.
	 *
	 * Fechado, é uma tarja fina na borda de baixo da foto: um botão de latão e o
	 * nome da gravação. Aberto, a tarja vira o embed do Spotify — que continua
	 * visível enquanto toca, como a licença do embed exige, e é também o único
	 * lugar onde faz sentido pôr os controles de faixa que não somos nós que
	 * desenhamos.
	 *
	 * Sem caixa em volta: o embed e o texto ficam direto sobre o degradê que
	 * escurece o pé da foto. Uma moldura nossa em volta da moldura do Spotify
	 * seriam duas caixas empilhadas para dizer a mesma coisa.
	 */

	/** `src` da foto — identidade do player dentro da página. */
	export let id: string;
	export let track: Track;
	export let lang: string = "pt";
	export let labels: { cue: string; close: string; hint: string };

	/** Tentativas de `play` antes de desistir e deixar o botão do Spotify agir. */
	const PLAY_ATTEMPTS = 8;
	const PLAY_RETRY = 400;

	let open = false;
	let ready = false;
	let started = false;
	let attempts = 0;
	let retry: ReturnType<typeof setTimeout> | null = null;
	let frame: HTMLIFrameElement | null = null;

	$: note = track.note[lang as keyof Track["note"]] ?? track.note.en;

	function activate() {
		open = true;
		ready = false;
		started = false;
		attempts = 0;
		// Reivindica o som da página: os outros players se fecham ouvindo isto.
		playingPlate.set(id);
	}

	function close() {
		stopRetrying();
		open = false;
		ready = false;
		started = false;
		frame = null;
		if (get(playingPlate) === id) playingPlate.set(null);
	}

	function stopRetrying() {
		if (retry !== null) clearTimeout(retry);
		retry = null;
	}

	/**
	 * Pede para tocar, e insiste.
	 *
	 * O `ready` do embed significa "a página subiu", não "o motor de áudio está
	 * pronto": um `play` mandado nesse instante é engolido sem resposta. Em vez
	 * de chutar um atraso fixo, pedimos de novo até um `playback_update` provar
	 * que pegou. Se não pegar, o embed continua ali com o próprio botão — vale
	 * um clique a mais, não vale travar a página esperando.
	 */
	function requestPlay() {
		stopRetrying();
		if (started || !frame?.contentWindow) return;
		frame.contentWindow.postMessage({ command: "play" }, EMBED_ORIGIN);
		if (++attempts < PLAY_ATTEMPTS) retry = setTimeout(requestPlay, PLAY_RETRY);
	}

	function handleMessage(event: MessageEvent) {
		if (event.origin !== EMBED_ORIGIN) return;
		if (!frame || event.source !== frame.contentWindow) return;

		if (event.data?.type === "ready") {
			ready = true;
			requestPlay();
		} else if (event.data?.type === "playback_update" && event.data.payload?.isPaused === false) {
			started = true;
			stopRetrying();
		}
	}

	// Outro player assumiu: este se fecha, e desmontar o iframe corta o som —
	// mais garantido do que pedir pausa a uma página de outro domínio.
	const unsubscribe = playingPlate.subscribe((active) => {
		if (active !== id && open) close();
	});

	onMount(() => {
		window.addEventListener("message", handleMessage);
	});

	onDestroy(() => {
		unsubscribe();
		stopRetrying();
		if (typeof window !== "undefined") window.removeEventListener("message", handleMessage);
	});
</script>

<div class="player" class:is-open={open}>
	{#if open}
		<div class="panel">
			<p class="note">{note}</p>
			<div class="embed">
				<iframe
					bind:this={frame}
					src={embedUrl(track.id)}
					title="{track.title} — {track.artist}"
					width="100%"
					height="80"
					frameborder="0"
					allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
				/>
				{#if !ready}<span class="loading" aria-hidden="true" />{/if}
			</div>
			<p class="hint">{labels.hint}</p>
			<button type="button" class="close" on:click={close} aria-label={labels.close}>
				<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" /></svg>
			</button>
		</div>
	{:else}
		<button type="button" class="cue" on:click={activate}>
			<span class="glyph" aria-hidden="true">
				<svg viewBox="0 0 16 16"><path d="M5 3l8 5-8 5z" /></svg>
			</span>
			<span class="meta">
				<span class="title">{track.title}</span>
				<span class="by">{track.artist} · {track.year}</span>
			</span>
			<span class="via">{labels.cue} · Spotify</span>
		</button>
	{/if}
</div>

<style>
	/* A tarja mora na borda de baixo da foto. O degradê existe para o texto
	   sobreviver a qualquer imagem embaixo dele — as fotos vão de céu estourado
	   de Olinda a preto e branco de clube de jazz —, e é ele que faz o papel de
	   fundo, no lugar de uma caixa. */
	.player {
		position: absolute;
		inset: auto 0 0 0;
		display: flex;
		justify-content: center;
		padding: clamp(0.6rem, 2vw, 1.1rem);
		background: linear-gradient(to top, rgb(0 0 0 / 0.86), rgb(0 0 0 / 0.52) 55%, transparent);
		pointer-events: none;
	}

	.is-open {
		background: linear-gradient(to top, rgb(0 0 0 / 0.88), rgb(0 0 0 / 0.62) 70%, transparent);
	}

	.cue,
	.panel {
		pointer-events: auto;
		width: min(42rem, 100%);
	}

	/* ── Fechado ──────────────────────────────────────────────────────────── */

	.cue {
		display: flex;
		align-items: center;
		gap: clamp(0.6rem, 2vw, 0.9rem);
		padding: 0.5rem 0.7rem;
		border: 0;
		background: none;
		color: #fff;
		text-align: left;
		cursor: pointer;
	}

	.glyph {
		flex: none;
		display: grid;
		place-items: center;
		width: 2.1rem;
		height: 2.1rem;
		border: 1px solid var(--brass, #d9a441);
		border-radius: 50%;
		color: var(--brass, #d9a441);
		transition: background 160ms ease, color 160ms ease;
	}

	.cue:hover .glyph,
	.cue:focus-visible .glyph {
		background: var(--brass, #d9a441);
		color: #000;
	}

	.glyph svg {
		width: 0.7rem;
		height: 0.7rem;
		fill: currentColor;
		/* O triângulo é opticamente pesado à esquerda; meio pixel resolve. */
		margin-left: 1px;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
		flex: 1;
	}

	.title {
		font-size: 0.92rem;
		line-height: 1.25;
		font-style: italic;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-shadow: 0 1px 3px rgb(0 0 0 / 0.6);
	}

	.by,
	.via {
		font-family: var(--fontFamily);
		font-size: 0.6rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgb(255 255 255 / 0.7);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-shadow: 0 1px 3px rgb(0 0 0 / 0.6);
	}

	.via {
		flex: none;
		letter-spacing: 0.2em;
		color: rgb(255 255 255 / 0.64);
	}

	/* ── Aberto ───────────────────────────────────────────────────────────── */

	.panel {
		position: relative;
		padding: 0.2rem 0;
	}

	.note {
		margin: 0 0 0.7rem;
		padding-right: 1.6rem;
		font-size: 0.82rem;
		line-height: 1.55;
		color: rgb(255 255 255 / 0.86);
		text-shadow: 0 1px 3px rgb(0 0 0 / 0.7);
	}

	.embed {
		position: relative;
		min-height: 80px;
	}

	.embed iframe {
		display: block;
		width: 100%;
		border: 0;
	}

	/* Enquanto o embed não pinta, uma barra de latão ocupa o lugar dele — sem
	   ela o painel abre com um buraco de 80px. */
	.loading {
		position: absolute;
		inset: 0;
		border-radius: 8px;
		background: linear-gradient(
			90deg,
			rgb(255 255 255 / 0.04),
			color-mix(in srgb, var(--brass, #d9a441) 22%, transparent),
			rgb(255 255 255 / 0.04)
		);
		background-size: 220% 100%;
		animation: sweep 1.4s ease-in-out infinite;
	}

	@keyframes sweep {
		from {
			background-position: 120% 0;
		}
		to {
			background-position: -120% 0;
		}
	}

	.hint {
		margin: 0.55rem 0 0;
		font-family: var(--fontFamily);
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		line-height: 1.6;
		color: rgb(255 255 255 / 0.45);
		text-shadow: 0 1px 3px rgb(0 0 0 / 0.7);
	}

	.close {
		position: absolute;
		top: 0;
		right: 0;
		display: grid;
		place-items: center;
		width: 1.6rem;
		height: 1.6rem;
		border: 0;
		background: none;
		color: rgb(255 255 255 / 0.6);
		cursor: pointer;
	}

	.close:hover,
	.close:focus-visible {
		color: var(--brass, #d9a441);
	}

	.close svg {
		width: 0.75rem;
		height: 0.75rem;
		stroke: currentColor;
		stroke-width: 1.6;
		fill: none;
	}

	/* No celular não cabem título, intérprete e "ouvir · spotify" na mesma
	   linha — e cortar o nome do intérprete com reticências é justamente perder
	   a informação que faz alguém querer tocar. O rótulo desce para a segunda
	   linha, alinhado com o texto. */
	@media (max-width: 34rem) {
		.cue {
			flex-wrap: wrap;
			row-gap: 0.3rem;
		}

		.via {
			flex-basis: 100%;
			padding-left: calc(2.1rem + clamp(0.6rem, 2vw, 0.9rem));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.loading {
			animation: none;
		}
	}
</style>
