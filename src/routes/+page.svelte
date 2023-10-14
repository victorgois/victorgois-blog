<script>
	import Typewriter from "svelte-typewriter";
	import TechChips from "$lib/components/TechChips.svelte";
	import TechDetail from "$lib/components/TechDetail.svelte";

	let techList = [
		"JavaScript",
		"React",
		"CSS-In-Js",
		"Svelte",
		"Graphql",
		"AWS",
		"Firebase",
		"Typescript",
		"NextJs",
		"PWA",
		"Jest",
		"Cypress",
		"D3.js",
		"Python",
		"NodeJs",
		"Wordpress",
		"MUI"
	];

	let selectedTech = "";
	let techListVisible = true;

	/**
	 * @param {{ detail: { tech: string; }; }} event
	 */
	function handleChipClick(event) {
		selectedTech = event.detail.tech;
		techListVisible = false;
	}

	function handleBackClick() {
		techListVisible = true;
		selectedTech = "";
	}

	function handleSecondEvent() {
		techListVisible = true;
	}
</script>

<svelte:head>
	<title>Victor Góis</title>
</svelte:head>

<main>
	<div class="column">
		<div class="row">
			<div class="presentation">
				<Typewriter mode="scramble" scrambleDuration={2800} scrambleSlowdown={false}>
					<h1>
						Hi! I'm Victor, a Journalist/ FrontEnd Engineer from 🇧🇷, specializing in JavaScript, Web
						development and Data Storytelling.
					</h1>
				</Typewriter>
				<Typewriter on:done={handleSecondEvent} delay={2800} mode="concurrent">
					<p>
						I've been working as a fullstack javascript developer for the last 3.5 years. Also
						graduated in journalism, MA in communication and contemporary sociabilities. I'me
						looking for opportunities with JS Visualization, Creative Programming and JavaScript
						FrontEnd development in general.
					</p>
				</Typewriter>
			</div>
			<div class="presentation">
				{#if techListVisible}
					<TechChips {techList} on:chipclick={handleChipClick} />
				{:else}
					<TechDetail techName={selectedTech} on:backclick={handleBackClick} />
				{/if}
			</div>
		</div>
	</div>
</main>

<style>
	h1 {
		font-size: 24px;
	}

	main {
		text-align: center;
		padding: 0;
		margin: 0 auto;
		text-align: center;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.column {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: flex;
		flex-direction: row;
		margin: 1em;
	}

	.presentation {
		text-align: start;
		width: 50%;
		padding: 0.5em;
	}

	@media (max-width: 900px) {
		.row {
			flex-direction: column;
		}
		.presentation {
			width: 100%;
			margin-right: 3em;
		}
	}

	@media (min-width: 600px) {
		main {
			max-width: none;
		}
	}
</style>
