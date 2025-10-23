<script>
	import { locale, t } from "../../i18n";
	import Timeline from "../../lib/components/Timeline.svelte";
	import CareerTimeline from "../../lib/components/CareerTimeline.svelte";
	import TableauGraphs from "../../lib/components/TableauGraphs.svelte";
	import { reveal } from "svelte-reveal";
	import { derived } from "svelte/store";

	import { visualizations } from "../../lib/store";
	const menuItems = [0, 1];

	const menuContent = derived([t], ([$t]) => [
		{
			Title: $t("projectPageContent.overviewTitle"),
			Content: $t("projectPageContent.overview")
		},
		{
			Title: $t("projectPageContent.academicBackgroundTitle"),
			Content: $t("projectPageContent.academicBackground")
		}
	]);

	/**
	 * @type {number | null}
	 */

	let selectedMenuItem = null;
	let showTimeline = false;

	const handleClick = (/** @type {number} */ item) => {
		selectedMenuItem = item;
	};

	const toggleTimeline = () => {
		showTimeline = !showTimeline;
	};
</script>

<svelte:head>
	<title>Victor Góis — Projects</title>
</svelte:head>
<main>
	<div class="main-container">
		<div class="content-wrapper">
			<div class="text-content">
				{#if selectedMenuItem !== null}
					<div use:reveal={{ transition: "fade" }} class="content">
						<h4>{$menuContent[selectedMenuItem].Title}</h4>

						{#if selectedMenuItem !== 3}
							<p use:reveal={{ transition: "fade" }}>
								{@html $menuContent[selectedMenuItem].Content}
							</p>
							{#if showTimeline}
								<Timeline />
							{/if}
						{:else}
							<p use:reveal={{ transition: "fade" }}>
								{#each Object.values(visualizations) as { title, slug }}
									<li><a href={`projects/visualizations/${slug}`}>{title}</a></li>
								{/each}
							</p>
							<TableauGraphs />
						{/if}
					</div>
				{:else}
					<div class="content">
						<h4>{$menuContent[0].Title}</h4>
						<p use:reveal={{ transition: "fade" }}>{@html $menuContent[0].Content}</p>
						<figure class="image-container" use:reveal={{ transition: "fade" }}>
							<img
								src="/src/lib/images/WikiCon_Brasil_2025_por_Rodrigo_Tetsuo_Argenton_23.png"
								alt="Victor Góis at WikiCon Brasil 2025"
								class="profile-image"
							/>
							<figcaption class="image-caption">
								Photo by Rodrigo Tetsuo Argenton. 2025
							</figcaption>
						</figure>
					</div>
				{/if}
			</div>
			
			<div class="timeline-content desktop-timeline">
				<CareerTimeline />
			</div>
		</div>
		
		<!-- Timeline para mobile (aparece após o texto) -->
		<div class="mobile-timeline">
			<CareerTimeline />
		</div>
	</div>
</main>

<style>
	.timeline-button {
		text-align: center;
		background-color: var(--backgroundColor);
		color: var(--mainColor);
		border: none;
	}

	main {
		padding: 20px;
		text-align: start;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.main-container {
		width: 100%;
		max-width: 1200px;
	}

	.content-wrapper {
		display: flex;
		gap: 40px;
		align-items: flex-start;
	}

	.text-content {
		flex: 1;
		min-width: 0;
		max-width: 600px;
	}

	.timeline-content {
		flex: 1;
		min-width: 400px;
		max-width: 500px;
	}

	.desktop-timeline {
		display: block;
	}

	.mobile-timeline {
		display: none;
		margin-top: 40px;
	}

	.menuWrapper {
		display: flex;
		flex-grow: 0;
		flex-basis: 40%;
	}

	.menuWrapper ul {
		margin-right: 2em;
		list-style-type: none;
		padding: 0;
	}

	button {
		font-weight: 700;
		padding: 0.25em;
		text-align: start;
		margin: 0 auto;
		cursor: pointer;
		font-size: 18px;
		background-color: var(--mainColor);
		color: var(--backgroundColor);
	}

	li {
		margin: 0.5em;
		list-style: none;
	}

	.content {
		margin-left: 10px;
	}

	.image-container {
		margin: 20px 0;
		max-width: 600px;
	}

	.profile-image {
		width: 100%;
		height: auto;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		display: block;
	}

	.image-caption {
		text-align: center;
		font-size: 0.9rem;
		color: #666;
		margin-top: 8px;
		font-style: italic;
	}

	/* Responsivo para mobile */
	@media (max-width: 768px) {
		.content-wrapper {
			flex-direction: column;
			gap: 0;
		}

		.desktop-timeline {
			display: none;
		}

		.mobile-timeline {
			display: block;
		}

		.text-content {
			max-width: 100%;
		}

		.timeline-content {
			min-width: auto;
			max-width: 100%;
		}

		main {
			padding: 15px;
		}
	}

	@media (max-width: 1024px) and (min-width: 769px) {
		.content-wrapper {
			gap: 20px;
		}

		.timeline-content {
			min-width: 350px;
		}
	}
</style>
