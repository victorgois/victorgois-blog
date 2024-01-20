<script lang="ts">
	import TechChips from "$lib/components/TechChips.svelte";
	import TechDetail from "$lib/components/TechDetail.svelte";
	import { techList } from "$lib/Constants";
	import { selectedTechStore } from "$lib/store";
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

	// Create a locale specific timestamp
	$: time = new Date().toLocaleDateString($locale, {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});
</script>

<svelte:head>
	<title>Victor Góis</title>
</svelte:head>

<main>
	<div class="column">
		<div class="row">
			<div class="presentation" use:reveal>
				<h1 use:reveal={{ transition: "fade" }}>
					{$t("homepage.presentation1")}
				</h1>
			</div>
			<div class="presentation">
				<img src={vic} alt={name} width="100%" />
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
				<h4>{$t("homepage.longPresentation1")}</h4>
				{#if techListVisible}
					<TechChips {techList} on:chipclick={handleChipClick} />
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

	.footnote {
		font-size: small;
		text-align: center;
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
