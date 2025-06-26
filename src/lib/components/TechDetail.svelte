<script>
	// @ts-nocheck

	export let techName = "";
	import TechChips from "$lib/components/TechChips.svelte";
	import { experienciesList, experienciesListEn, techExperiences, techExperiencesEn } from "$lib/Constants";
	import { createEventDispatcher } from "svelte";
	import TechDetail from "$lib/components/TechDetail.svelte";
	import { selectedTechStore } from "$lib/store";
	import { t, locale } from "../../i18n";
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

	/**
	 * @param {string} techName
	 * @param {string} companyTitle
	 */
	function getTechSpecificExperience(techName, companyTitle) {
		const experiences = $locale === 'en' ? techExperiencesEn : techExperiences;
		const defaultText = $locale === 'en' 
			? `${$t("tech.detail.defaultExperience")} ${techName} at ${companyTitle}`
			: `${$t("tech.detail.defaultExperience")} ${techName} na ${companyTitle}`;
		return experiences[techName]?.[companyTitle] || defaultText;
	}

	$: currentExperiencesList = $locale === 'en' ? experienciesListEn : experienciesList;
	$: matchingExperiences = findExperiencesByTech(techName, currentExperiencesList);

	function handleChipClick(event) {
		selectedTech = event.detail.tech;
		techListVisible = false;
		selectedTechStore.set(selectedTech);
	}
</script>

<div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="back" on:click={handleBackClick} role="button" tabindex="0">&larr; {$t("tech.detail.back")}</div>
	<h2>{techName}</h2>
	<p class="tech-intro">{$t("tech.detail.intro")} <strong>{techName}</strong>:</p>
	
	{#each matchingExperiences as experience (experience.employee)}
		<div class="experience-item">
			<a href={experience.link} target="_blank"><h4>{experience.employee}</h4></a>
			<div class="experience-content">
				{getTechSpecificExperience(techName, experience.title)}
			</div>
			<div class="other-techs">
				<span class="other-techs-label">{$t("tech.detail.otherTechs")}</span>
				<TechChips techList={experience.chips.filter(chip => chip !== techName)} on:chipclick={handleChipClick} />
			</div>
		</div>
	{:else}
		<TechDetail techName={selectedTech} on:backclick={handleBackClick} />
	{/each}
</div>

<style>
	.back {
		cursor: pointer;
		margin-bottom: 1rem;
		margin-top: 1rem;
		color: var(--visitedColor);
		text-decoration: underline;
		font-family: "Fira Code", monospace;
		font-size: large;
		font-weight: 600;
		text-underline-offset: 5px;
	}

	.back:hover {
		opacity: 0.8;
	}

	h2 {
		text-align: left;
		padding-right: 1rem;
		text-decoration: underline;
		text-underline-offset: 5px;
		color: var(--visitedColor);
		margin-bottom: 1rem;
	}

	.tech-intro {
		text-align: left;
		padding-right: 1rem;
		margin-bottom: 2rem;
		font-style: italic;
		color: var(--secondaryColor);
	}

	.experience-item {
		margin-bottom: 2rem;
		padding: 1.5rem;
		border-left: 3px solid var(--visitedColor);
		background: var(--backgroundColor);
		border-radius: 0 8px 8px 0;
	}

	.experience-item h4 {
		margin: 0 0 1rem 0;
		color: var(--visitedColor);
	}

	.experience-item a {
		text-decoration: none;
	}

	.experience-item a:hover h4 {
		text-decoration: underline;
	}

	.experience-content {
		text-align: left;
		padding-right: 1rem;
		margin-bottom: 1rem;
		line-height: 1.6;
		color: var(--mainColor);
	}

	.other-techs {
		margin-top: 1rem;
	}

	.other-techs-label {
		font-size: 0.9rem;
		color: var(--secondaryColor);
		font-weight: 500;
		margin-bottom: 0.5rem;
		display: block;
	}

	:global(.other-techs .tech-chips) {
		padding-top: 0.5rem;
	}

	:global(.other-techs .tech-chip) {
		font-size: 0.8rem;
		padding: 0.3rem 0.6rem;
		opacity: 0.8;
	}
</style>
