<script>
	// @ts-nocheck

	export let techName = "";
	import TechChips from "$lib/components/TechChips.svelte";
	import { experienciesList } from "$lib/Constants";
	import { createEventDispatcher } from "svelte";
	import TechDetail from "$lib/components/TechDetail.svelte";
	import { selectedTechStore } from "$lib/store";
	import { t } from "../../i18n";
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
		selectedTechStore.set(selectedTech);
	}
</script>

<div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="back" on:click={handleBackClick} role="button" tabindex="0">&larr; Back</div>
	<h2>{techName}</h2>
	{#each matchingExperiences as experience (experience.employee)}
		<a href={experience.link}><h4>{experience.employee}</h4></a>
		<p>{$t(`homepage.description.${experience.title}`)}</p>
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
		color: white;
		text-decoration: underline;
		font-family: "Fira Code", monospace;
		font-size: large;
		font-weight: 600;
		text-underline-offset: 5px;
	}

	h2 {
		text-align: left;
		padding-right: 1rem;
		text-decoration: underline;
		text-underline-offset: 5px;
	}

	p {
		text-align: left;
		padding-right: 1rem;
	}
</style>
