<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { isBlackKey, midiToName } from "../../instruments/fingerings";

	export let low: number;
	export let high: number;
	export let active: number[] = [];
	export let locale = "en";

	const dispatch = createEventDispatcher<{ noteon: number; noteoff: number }>();

	let pressing = false;
	let lastNote: number | null = null;

	$: notes = Array.from({ length: high - low + 1 }, (_, i) => low + i);
	$: whites = notes.filter((note) => !isBlackKey(note));

	/** Posição horizontal de uma tecla preta, em frações de tecla branca. */
	function blackOffset(note: number) {
		const index = whites.filter((white) => white < note).length;
		return index / whites.length;
	}

	function press(note: number) {
		if (lastNote === note) return;
		if (lastNote !== null) dispatch("noteoff", lastNote);
		lastNote = note;
		dispatch("noteon", note);
	}

	function release() {
		if (lastNote !== null) dispatch("noteoff", lastNote);
		lastNote = null;
		pressing = false;
	}
</script>

<svelte:window on:pointerup={release} on:pointercancel={release} />

<div
	class="keyboard"
	style:--white-count={whites.length}
	role="group"
	aria-label={locale === "pt" ? "Teclado virtual" : "Virtual keyboard"}
>
	<div class="whites">
		{#each whites as note (note)}
			<button
				type="button"
				class="white"
				class:on={active.includes(note)}
				on:pointerdown={() => {
					pressing = true;
					press(note);
				}}
				on:pointerenter={() => pressing && press(note)}
				aria-label={midiToName(note, locale)}
			>
				<span>{note % 12 === 0 ? midiToName(note, locale) : ""}</span>
			</button>
		{/each}
	</div>

	<div class="blacks">
		{#each notes.filter(isBlackKey) as note (note)}
			<button
				type="button"
				class="black"
				class:on={active.includes(note)}
				style:left={`calc(${blackOffset(note) * 100}% - (100% / var(--white-count)) * 0.3)`}
				on:pointerdown={() => {
					pressing = true;
					press(note);
				}}
				on:pointerenter={() => pressing && press(note)}
				aria-label={midiToName(note, locale)}
			></button>
		{/each}
	</div>
</div>

<style>
	.keyboard {
		position: relative;
		width: 100%;
		height: 116px;
		user-select: none;
		touch-action: none;
	}

	.whites {
		display: flex;
		height: 100%;
		gap: 2px;
	}

	.white {
		flex: 1;
		min-width: 0;
		border: none;
		border-radius: 0 0 5px 5px;
		background: linear-gradient(#fff, #ecedf1);
		box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.12);
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 5px;
		font-size: 9px;
		font-family: inherit;
		color: #7a7f8a;
		cursor: pointer;
		transition: background 0.06s ease;
	}

	.white.on {
		background: linear-gradient(var(--visitedColor, tomato), #ffffff);
		color: #fff;
	}

	.blacks {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.black {
		position: absolute;
		top: 0;
		width: calc(100% / var(--white-count) * 0.6);
		height: 62%;
		border: none;
		border-radius: 0 0 4px 4px;
		background: linear-gradient(#3a3f49, #14171d);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
		pointer-events: auto;
		cursor: pointer;
	}

	.black.on {
		background: linear-gradient(var(--visitedColor, tomato), #2a2d34);
	}
</style>
