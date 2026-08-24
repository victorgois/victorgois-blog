<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { InstrumentAudio } from "../../instruments/audio";

	export let audio: InstrumentAudio | null = null;
	export let accent = "#e2725b";
	export let dark = false;

	let canvas: HTMLCanvasElement;
	let frame = 0;

	onMount(() => {
		const context = canvas.getContext("2d");
		if (!context) return;

		const draw = () => {
			frame = requestAnimationFrame(draw);
			const ratio = Math.min(window.devicePixelRatio, 2);
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
				canvas.width = width * ratio;
				canvas.height = height * ratio;
			}
			context.setTransform(ratio, 0, 0, ratio, 0, 0);
			context.clearRect(0, 0, width, height);

			const grid = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
			context.strokeStyle = grid;
			context.lineWidth = 1;
			for (let i = 1; i < 4; i++) {
				const y = (height / 4) * i;
				context.beginPath();
				context.moveTo(0, y);
				context.lineTo(width, y);
				context.stroke();
			}

			if (!audio) return;

			// Espectro: barras por banda de frequência.
			const spectrum = audio.spectrum.getValue() as Float32Array;
			const bars = spectrum.length;
			const barWidth = width / bars;
			context.fillStyle = accent;
			for (let i = 0; i < bars; i++) {
				// A saída vem em dB (aprox. -100 a 0).
				const level = Math.max(0, (spectrum[i] + 100) / 100);
				const barHeight = Math.pow(level, 1.6) * height * 0.92;
				context.globalAlpha = 0.25 + level * 0.6;
				context.fillRect(i * barWidth, height - barHeight, Math.max(barWidth - 1, 1), barHeight);
			}
			context.globalAlpha = 1;

			// Forma de onda por cima, para ver o ataque e o vibrato.
			const wave = audio.waveform.getValue() as Float32Array;
			context.beginPath();
			context.strokeStyle = dark ? "rgba(255,255,255,0.75)" : "rgba(20,20,26,0.7)";
			context.lineWidth = 1.4;
			for (let i = 0; i < wave.length; i++) {
				const x = (i / (wave.length - 1)) * width;
				const y = height / 2 - wave[i] * height * 0.42;
				if (i === 0) context.moveTo(x, y);
				else context.lineTo(x, y);
			}
			context.stroke();
		};

		draw();
	});

	onDestroy(() => {
		if (frame) cancelAnimationFrame(frame);
	});
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		display: block;
		width: 100%;
		height: 130px;
		border-radius: 10px;
		background: rgba(127, 127, 127, 0.07);
	}
</style>
