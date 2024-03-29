<script>
	import { reveal } from "svelte-reveal";
	import { onMount } from "svelte";

	let words = ["responde", "entende", "funciona"];
	let currentWord = words[0];
	let index = 0;

	onMount(() => {
		// Add google fonts
		const link = document.createElement("link");
		link.href =
			"https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Noto+Serif:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap";
		link.rel = "stylesheet";
		document.head.appendChild(link);

		const interval = setInterval(() => {
			index = (index + 1) % words.length;
			currentWord = words[index];
		}, 2000); // Troca a palavra a cada 2 segundos

		return () => clearInterval(interval);
	});
</script>

<div class="animated-text" use:reveal={{ transition: "fade" }}>
	<span>Explicamos</span><span>visualmente</span><span>como</span><span>ele</span><span
		>{currentWord}</span
	>
</div>

<style>
	.animated-text span {
		color: black;
		background-color: white;
		border: 1px dashed black;
		border-radius: 0%;
		margin-right: 1rem;
		padding: 10px;
		font-size: 28px;
		font-weight: 400;
		font-family: "Abril Fatface", serif;
	}
</style>
