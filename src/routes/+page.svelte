<script>
	import Typewriter from "svelte-typewriter";
	import TechChips from "$lib/components/TechChips.svelte";
	import TechDetail from "$lib/components/TechDetail.svelte";
	import { techList } from "$lib/Constants";
	import { selectedTechStore } from "$lib/store";

	let selectedTech = "";
	let techListVisible = true;

	/**
	 * @param {{ detail: { tech: string; }; }} event
	 */
	function handleChipClick(event) {
		selectedTech = event.detail.tech;
		techListVisible = false;
		selectedTechStore.set(selectedTech);
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
				<!-- <Typewriter mode="scramble" scrambleDuration={2800} scrambleSlowdown={false}> -->
				<h1>
					Hi! I'm Victor, a Journalist/ FrontEnd Engineer from 🇧🇷, specializing in JavaScript, Web
					development and Data Visualization.
				</h1>
				<!-- </Typewriter> -->
				<!-- <Typewriter on:done={handleSecondEvent} delay={2800} mode="concurrent"> -->

				<!-- </Typewriter> -->
			</div>
			<div class="presentation">
				<h4>My experiences</h4>
				{#if techListVisible}
					<TechChips {techList} on:chipclick={handleChipClick} />
				{:else}
					<TechDetail techName={selectedTech} on:backclick={handleBackClick} />
				{/if}
			</div>			
		</div>
		<div class="row">
			<div class="presentation">
				<p>
					I've been working as a javascript developer for the last 4 years. Also I am graduated in
					journalism, MA in communication and contemporary sociabilities. I am looking for
					opportunities with JS Visualization, Creative Programming and JavaScript FrontEnd
					development in general.
				</p>
			</div>
		</div>
	</div>
</main>

<style>
	h1 {
		font-size: 24px;
	}

	h4 {
		display: flex;
		justify-content: flex-end;
		padding-right: 16px;
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
		display: flex;
		align-content: stretch;
		flex-direction: column;
		justify-content: center;
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
