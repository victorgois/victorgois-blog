<script lang="ts">
	import TechChips from "$lib/components/TechChips.svelte";
	import TechDetail from "$lib/components/TechDetail.svelte";
	import { techList } from "$lib/Constants";
	import { selectedTechStore } from "$lib/store";
	import { reveal } from "svelte-reveal";
	import vic from "$lib/assets/vic.gif";
	import Timeline from "$lib/components/Timeline.svelte";
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
					{$t("homepage.title")}
				</h1>
			</div>
			<div class="presentation">
				<img src={vic} alt={name} width="100%" />
			</div>
		</div>
		<div class="row">
			<div class="presentation" use:reveal>
				<p use:reveal={{ transition: "fade" }}>
					👋 I'm a JavaScript developer with +3 years of experience and comprehensive skills in
					technologies such as Node, React, Jest, GraphQL, Next.js, SQL and CSS. My experience
					includes applying TDD, BDD concepts and clean code practices, creating screens, components
					and data visualizations.
				</p>
			</div>
			<div class="presentation" use:reveal>
				<p use:reveal={{ transition: "fade" }}>
					🔧 I have extensive experience working in agile teams, where I learned to collaborate
					efficiently and drive the delivery of innovative projects. My biggest passion is bringing
					data to life, whether through numerical calculations or transforming any type of media
					into captivating interfaces or telling stories through interactive infographics.
				</p>
			</div>
		</div>
		<div class="row">
			<div class="long-presentation">
				<h4>Tech stacks I have most experience with</h4>
				{#if techListVisible}
					<TechChips {techList} on:chipclick={handleChipClick} />
				{:else}
					<TechDetail techName={selectedTech} on:backclick={handleBackClick} />
				{/if}
			</div>
		</div>
		<hr use:reveal={{ transition: "fade" }} />
		<div class="infographic" use:reveal>
			<h1>My professional life in a timeline</h1>
			<Timeline />
		</div>

		<div class="row">
			<div class="long-presentation" use:reveal>
				<p use:reveal={{ transition: "fade" }}>
					📚 I refer myself professionaly as a "Journalist Engineer" inspired by 2015 Matthew
					Daniels' <a
						href="https://medium.com/@matthew_daniels/the-journalist-engineer-c9c1a72b993f"
						>article</a
					>.
				</p>
				<p use:reveal={{ transition: "fade" }}>
					Currently, I am deepening my knowledge in D3.js and Svelte, with the aim of specializing
					in frontend development and data visualization. I focus on transforming data into engaging
					visual experiences.
				</p>
				<p use:reveal={{ transition: "fade" }}>
					🚀 I am open to opportunities to work with JavaScript Fullstack and FrontEnd development.
					I am constantly looking to improve my skills and face new challenges.
				</p>
			</div>
		</div>

		<!-- 		<div class="row">
			<div class="long-presentation" style="text-align: end;">
				<div
					class="footnote"
					style="background-color: #B0C324; text-align: end; width: 15px; height: 15px;"
				/>
				<p>Professional Jobs</p>
			</div>
			<div class="long-presentation" style="text-align: end;">
				<div
					class="footnote"
					style="background-color: white; text-align: end; width: 15px; height: 15px;"
				/>
				<p>Side Projects</p>
			</div>
		</div> -->
		<p class="footnote" use:reveal={{ transition: "fade" }}>
			Most of my work is under NDA. Please, reach me out to more details.
		</p>
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

	.infographic {
		text-align: center;
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
