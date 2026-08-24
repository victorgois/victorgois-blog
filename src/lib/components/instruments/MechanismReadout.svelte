<script lang="ts">
	import { midiToName, SLIDE_POSITIONS } from "../../instruments/fingerings";
	import type { Fingering, InstrumentId } from "../../instruments/types";
	import type { PageCopy } from "../../instruments/copy";

	/**
	 * O estado mecânico do instrumento, na mesma notação que um músico lê numa
	 * carta de digitação: círculos de pistão, régua de posições, coluna de furos.
	 * Ele acompanha a narrativa e a execução — é o elo entre o texto e o modelo.
	 */

	export let instrument: InstrumentId;
	export let fingering: Fingering | null = null;
	/** Nota em altura escrita: é a que corresponde à digitação mostrada ao lado. */
	export let note: number | null = null;
	export let readout: PageCopy["readout"];
	export let locale = "en";

	const TRAVEL = SLIDE_POSITIONS[SLIDE_POSITIONS.length - 1];

	$: valves =
		fingering && fingering.kind === "valves" ? fingering.valves : ([false, false, false] as const);
	$: position = fingering && fingering.kind === "slide" ? fingering.position : 1;
	$: closed = fingering && fingering.kind === "keys" ? fingering.closed : 0;
	$: octave = fingering && fingering.kind === "keys" ? fingering.octave : false;

	$: label =
		instrument === "trumpet"
			? readout.valves
			: instrument === "trombone"
			? readout.slide
			: readout.keys;

	$: value =
		note === null
			? instrument === "trumpet"
				? readout.valvesRest
				: instrument === "trombone"
				? readout.slideRest
				: readout.keysRest
			: midiToName(note, locale);
</script>

<figure class="readout" class:idle={note === null}>
	<div class="mechanism">
		<span class="label">{label}</span>

		{#if instrument === "trumpet"}
			<div class="valves">
				{#each [0, 1, 2] as index}
					<span class="valve" class:down={valves[index]}>
						<span class="dot"></span>
						<span class="num">{index + 1}</span>
					</span>
				{/each}
			</div>
		{:else if instrument === "trombone"}
			<!-- Os traços não são igualmente espaçados: seguem o curso real da vara. -->
			<div class="slide">
				<span class="rail"></span>
				{#each SLIDE_POSITIONS as offset, index}
					<span
						class="tick"
						class:reached={index + 1 <= position}
						style:left={`${(offset / TRAVEL) * 100}%`}
					>
						<span class="num">{index + 1}</span>
					</span>
				{/each}
				<span
					class="marker"
					style:left={`${(SLIDE_POSITIONS[Math.min(Math.max(position, 1), 7) - 1] / TRAVEL) * 100}%`}
				></span>
			</div>
		{:else}
			<div class="holes">
				{#each Array(12) as _, index}
					<span class="hole" class:shut={index < closed}></span>
				{/each}
				<span class="octave" class:on={octave}>8<sup>va</sup></span>
			</div>
		{/if}
	</div>

	<!-- A nota é o que a caixa está dizendo: ela ocupa o lado direito inteiro, do
	     tamanho de um mostrador. Em repouso não há nota, e o texto que entra no
	     lugar volta ao corpo de rótulo — “em repouso” em display seria um
	     anúncio, não um estado. -->
	<figcaption class="value" class:rest={note === null}>{value}</figcaption>
</figure>

<style>
	/* Mecanismo à esquerda, nota à direita: a caixa é um mostrador, e o que ela
	   mostra tem de ser legível de longe — de uma tela de distância, com o
	   instrumento girando ao lado. */
	.readout {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.25rem;
		margin: 0;
		padding: 0.85rem 1rem 0.95rem;
		border: 1px solid var(--rule);
		background: var(--paper);
		width: max-content;
		min-width: 15rem;
		max-width: 100%;
		transition: opacity 0.4s ease;
	}

	.readout.idle {
		opacity: 0.55;
	}

	.mechanism {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}

	.label {
		font-family: var(--fontFamily);
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.5;
	}

	/* O `min-height` é o que segura a altura da caixa: sem ele ela encolheria ao
	   voltar para o repouso, e a leitura pula no canto do palco. */
	.value {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		min-height: 2.5rem;
		font-family: var(--fontFamily);
		font-size: 2.5rem;
		line-height: 1;
		letter-spacing: -0.01em;
		font-variant-numeric: tabular-nums;
		color: var(--brass);
		text-align: right;
	}

	.value.rest {
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		line-height: 1.5;
		text-transform: uppercase;
		max-width: 8ch;
	}

	/* ── Pistões ─────────────────────────────────────────────────────────── */
	.valves {
		display: flex;
		gap: 0.85rem;
	}

	.valve {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
	}

	.dot {
		width: 17px;
		height: 17px;
		border-radius: 50%;
		border: 1.5px solid currentColor;
		opacity: 0.4;
		transition: background-color 0.14s ease, opacity 0.14s ease, transform 0.14s ease;
	}

	.valve.down .dot {
		background: var(--accent);
		border-color: var(--accent);
		opacity: 1;
		transform: translateY(2px);
	}

	.num {
		font-family: var(--fontFamily);
		font-size: 0.55rem;
		opacity: 0.4;
	}

	/* ── Vara ────────────────────────────────────────────────────────────── */
	.slide {
		position: relative;
		height: 30px;
		margin: 0 0.6rem;
	}

	.rail {
		position: absolute;
		top: 4px;
		left: 0;
		right: 0;
		height: 1px;
		background: currentColor;
		opacity: 0.25;
	}

	.tick {
		position: absolute;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		transform: translateX(-50%);
	}

	.tick::before {
		content: "";
		width: 1px;
		height: 9px;
		background: currentColor;
		opacity: 0.35;
	}

	.tick.reached::before {
		opacity: 0.75;
	}

	.tick .num {
		margin-top: 0.3rem;
	}

	.marker {
		position: absolute;
		top: 0;
		width: 3px;
		height: 9px;
		background: var(--accent);
		transform: translateX(-50%);
		transition: left 0.28s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* ── Furos ───────────────────────────────────────────────────────────── */
	.holes {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.hole {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		border: 1.3px solid currentColor;
		opacity: 0.35;
		transition: background-color 0.12s ease, opacity 0.12s ease;
	}

	.hole.shut {
		background: var(--accent);
		border-color: var(--accent);
		opacity: 1;
	}

	.octave {
		margin-left: 0.5rem;
		font-family: var(--fontFamily);
		font-size: 0.6rem;
		opacity: 0.25;
		transition: opacity 0.12s ease, color 0.12s ease;
	}

	.octave.on {
		opacity: 1;
		color: var(--accent);
	}

	@media (prefers-reduced-motion: reduce) {
		.dot,
		.marker,
		.hole,
		.readout {
			transition-duration: 0.01ms;
		}
	}
</style>
