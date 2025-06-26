<script lang="ts">
	import TechChips from "../lib/components/TechChips.svelte";
	import TechDetail from "../lib/components/TechDetail.svelte";
	import { expertTechList, experiencedTechList, familiarTechList } from "../lib/Constants";
	import { selectedTechStore } from "../lib/store";
	import { reveal } from "svelte-reveal";
	import vic from "$lib/assets/vic.gif";
	import { t, locale } from "../i18n";

	let selectedTech = "";
	let techListVisible = true;

	let name = "Vicky";

	/**
	 * @param {{ detail: { tech: string; }; }} event
	 */
	function handleChipClick(event: any) {
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
			<div class="row">
				<div class="presentation" use:reveal>
					<h1 use:reveal={{ transition: "fade" }}>
						{$t("homepage.presentation1")}
					</h1>
				</div>
				<div class="presentation">
					<img src={vic} alt={name} width="350px" height="350px" />
				</div>
			</div>
		</div>
		<div class="row">
			<div class="presentation" use:reveal>
				<p use:reveal={{ transition: "fade" }}>
					{$t("homepage.presentation2")}
				</p>
			</div>
			<div class="presentation" use:reveal>
				<p use:reveal={{ transition: "fade" }}>
					{$t("homepage.presentation3")}
				</p>
			</div>
		</div>
		<div class="row">
			<div class="long-presentation">
				{#if techListVisible}
					<div class="tech-section">
						<h3>{$t("tech.expert.title")}</h3>
						<p class="tech-description">{$t("tech.expert.description")}</p>
						<TechChips techList={expertTechList} on:chipclick={handleChipClick} />
					</div>
					
					<div class="tech-section">
						<h3>{$t("tech.experienced.title")}</h3>
						<p class="tech-description">{$t("tech.experienced.description")}</p>
						<TechChips techList={experiencedTechList} on:chipclick={handleChipClick} />
					</div>
					
					<div class="tech-section">
						<h3>{$t("tech.familiar.title")}</h3>
						<p class="tech-description">{$t("tech.familiar.description")}</p>
						<TechChips techList={familiarTechList} on:chipclick={handleChipClick} />
					</div>
				{:else}
					<TechDetail techName={selectedTech} on:backclick={handleBackClick} />
				{/if}
			</div>
		</div>
		<hr use:reveal={{ transition: "fade" }} />

		<div class="row">
			<div class="long-presentation" use:reveal>
				<p use:reveal={{ transition: "fade" }}>
					{#if $locale === "en"}
						{$t("homepage.longPresentation4")}
						<a href="https://medium.com/@matthew_daniels/the-journalist-engineer-c9c1a72b993f"
							>article</a
						>.
					{/if}
					{#if $locale === "pt"}
						{$t("homepage.longPresentation4")}
						<a href="https://medium.com/@matthew_daniels/the-journalist-engineer-c9c1a72b993f"
							>artigo</a
						>
						{$t("homepage.longPresentation5")}
					{/if}
				</p>
				<p use:reveal={{ transition: "fade" }}>
					{$t("homepage.longPresentation2")}
				</p>
				<p use:reveal={{ transition: "fade" }}>
					{$t("homepage.longPresentation3")}
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
		width: 100%;
		max-width: 700px;
	}

	.row {
		display: flex;
		flex-direction: row;
	}

	.long-presentation {
		text-align: start;
		width: 100%;
		padding: 0.5em;
		display: flex;
		align-content: stretch;
		flex-direction: column;
	}

	.presentation {
		text-align: start;
		width: 50%;
		padding: 0.5em;
		display: flex;
		align-content: stretch;
		flex-direction: column;
	}

	hr {
		display: block;
		height: 1px;
		opacity: 50%;
		border: 0;
		border-top: 1px solid #ccc;
		margin: 1em 0;
		padding: 0;
	}
	@media (max-width: 900px) {
		.row {
			flex-direction: column;
			margin-right: 1em;
		}
		.presentation {
			width: 100%;
		}
	}

	@media (min-width: 600px) {
		main {
			max-width: none;
		}
	}

	.tech-section {
		margin-bottom: 3rem;
		padding: 1.5rem;
		border-radius: 12px;
		background: linear-gradient(135deg, var(--backgroundColor) 0%, rgba(200, 232, 16, 0.05) 100%);
		border: 1px solid rgba(200, 232, 16, 0.1);
		transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
	}

	.tech-section:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(200, 232, 16, 0.15);
	}

	.tech-section h3 {
		color: var(--visitedColor);
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		font-weight: 600;
		text-align: left;
	}

	.tech-description {
		color: var(--secondaryColor);
		margin: 0 0 1rem 0;
		font-style: italic;
		font-size: 0.95rem;
		line-height: 1.4;
		text-align: left;
	}

	@media (max-width: 900px) {
		.tech-section {
			padding: 1rem;
			margin-bottom: 2rem;
		}
		
		.tech-section h3 {
			font-size: 1.3rem;
		}
	}
</style>
