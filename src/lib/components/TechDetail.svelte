<script>
	// @ts-nocheck

	export let techName = "";
	import TechChips from "$lib/components/TechChips.svelte";
	import { experienciesList } from "$lib/Constants";
	import { createEventDispatcher } from "svelte";
	import TechDetail from "$lib/components/TechDetail.svelte";
	import { selectedTechStore } from "$lib/store";

	let techListVisible = true;
	let selectedTech = "";

	const dispatch = createEventDispatcher();

	function handleBackClick() {
		dispatch("backclick");
	}

	/**
	 * @param {string} techName
	 * @param {any[]} experiences
	 */
	function findExperiencesByTech(techName, experiences) {
		const matchingExperiences = experiences.filter((experience) =>
			experience.chips.includes(techName)
		);
		return matchingExperiences;
	}

	const matchingExperiences = findExperiencesByTech(techName, experienciesList);

	function handleChipClick(event) {
		selectedTech = event.detail.tech;
		techListVisible = false;
		selectedTechStore.set(selectedTech)
	}
</script>

<div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="back" on:click={handleBackClick} role="button" tabindex="0">&larr; Back</div>
		<h2>{techName}</h2>
		{#each matchingExperiences as experience (experience.employee)}
			<h4>{experience.employee}</h4>
			<p>{experience.description}</p>
			<TechChips techList={experience.chips} on:chipclick={handleChipClick} />
		{:else}
			<TechDetail techName={selectedTech} on:backclick={handleBackClick} />
		{/each}
</div>

<style>
	.back {
		cursor: pointer;
		margin-bottom: 1rem;
		margin-top: 1rem;
		color: #007bff;
		text-decoration: underline;
	}

	h2 {
		text-align: left;
		padding-right: 1rem;
	}

	p {
		text-align: left;
		padding-right: 1rem;
	}
</style>
