<script lang="ts">
	import type { InstrumentId } from "../../instruments/types";

	/* Desenhos de traço único, na mesma caixa de 48×48 e com o mesmo peso de
	   linha, para que os três leiam como uma família. Cada um guarda só o que
	   distingue o instrumento: o trompete tem três pistões e um laço; o trombone
	   tem a vara e a curva de retorno; o saxofone tem a curva do tudel, as
	   chaves e a campana virada para cima.

	   Os três apontam para a esquerda. Como o trombone só fecha bem com a
	   campana desse lado (com a vara à direita o desenho vira uma escada), são
	   trompete e sax que espelham — o que é apenas vê-los pelo outro flanco, não
	   um erro de anatomia. */

	export let instrument: InstrumentId;
	/** Nome acessível. Quando ausente, o ícone é decorativo. */
	export let label: string | null = null;
	export let size = "1em";
</script>

<svg
	class="instrument-icon"
	viewBox="0 0 48 48"
	width={size}
	height={size}
	fill="none"
	stroke="currentColor"
	stroke-width="3.2"
	stroke-linecap="round"
	stroke-linejoin="round"
	role={label ? "img" : "presentation"}
	aria-label={label ?? undefined}
	aria-hidden={label ? undefined : "true"}
	focusable="false"
>
	{#if label}<title>{label}</title>{/if}

	{#if instrument === "trumpet"}
		<!-- Bocal, tubo, três pistões, laço da afinação e campana. -->
		<g transform="translate(48,0) scale(-1,1)">
			<path d="M4.5,20.5 L9,22.6 L9,25.4 L4.5,27.5 Z" fill="currentColor" stroke="none" />
			<path d="M8.5,24 H31" />
			<path d="M13,22.4 V13" stroke-width="2.8" />
			<path d="M19,22.4 V13" stroke-width="2.8" />
			<path d="M25,22.4 V13" stroke-width="2.8" />
			<path d="M13,11.6 h0.01M19,11.6 h0.01M25,11.6 h0.01" stroke-width="4.4" />
			<path
				d="M15,25.6 V31.5 C15,33.6 16,34.6 18,34.6 H24 C26,34.6 27,33.6 27,31.5 V25.6"
				stroke-width="2.6"
			/>
			<path
				d="M30.5,18.6 C35.5,18.6 40,14 44.5,7.6 L44.5,40.4 C40,34 35.5,29.4 30.5,29.4 Z"
				fill="currentColor"
				stroke="none"
			/>
		</g>
	{:else if instrument === "trombone"}
		<!-- Campana à esquerda, vara à direita, curva de retorno e a travessa. -->
		<path
			d="M17.5,15.6 C12.5,15.6 8,11.5 3.5,5.5 L3.5,32.5 C8,26.5 12.5,22.4 17.5,22.4 Z"
			fill="currentColor"
			stroke="none"
		/>
		<path d="M16,19 H39.5" />
		<path d="M39.5,19 C44.5,19 44.5,31 39.5,31" />
		<path d="M39.5,31 H21.5" />
		<path d="M27,19.5 V30.5" stroke-width="2.4" />
	{:else}
		<!-- Boquilha, tudel, corpo com chaves e a campana voltada para cima. A
		     campana nasce dentro da curva do bocal para que o vão entre ela e o
		     corpo seja a fresta fina que identifica o instrumento de longe. -->
		<g transform="translate(48,0) scale(-1,1)">
			<path d="M7.6,4.8 L15.2,9.1 L13.5,12 L5.9,7.7 Z" fill="currentColor" stroke="none" />
			<path d="M12.8,9.4 C17.8,12.1 20.5,15.8 20.5,19.8 L24,32.5 C25,37 28.6,39 32.4,37.6" />
			<path
				d="M35.4,39.3 Q37.8,28 44.9,20.6 Q38.4,17.2 32.7,16.4 Q30.6,28 28.5,38.6 Z"
				fill="currentColor"
				stroke="none"
			/>
			<path d="M24.5,21.1 h0.01M25.5,24.8 h0.01M26.6,28.6 h0.01" stroke-width="3.4" />
		</g>
	{/if}
</svg>

<style>
	.instrument-icon {
		display: block;
		flex: none;
		overflow: visible;
	}
</style>
