<script>
	import { locale, t } from "../../i18n";
	import Timeline from "../../lib/components/Timeline.svelte";
	import CareerTimeline from "../../lib/components/CareerTimeline.svelte";
	import TableauGraphs from "../../lib/components/TableauGraphs.svelte";
	import { reveal } from "$lib/utils/reveal";
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

	const COMMONS = "https://commons.wikimedia.org/wiki/File:";
	const DATATHON = "Datathon do Ministério da Cultura. Brasília, setembro de 2026. Photo by Victor Vec";
	const photos = [
		{ name: "event-laptop", width: 600, height: 566, alt: "Victor Góis working on a laptop at the Ministry of Culture Datathon", caption: DATATHON },
		{ name: "event-portrait-bw", width: 600, height: 400, alt: "Black and white portrait of Victor Góis at the Ministry of Culture Datathon", caption: DATATHON },
		{
			name: "capx-technical-meeting-2025-01",
			width: 600,
			height: 338,
			alt: "Capacity Exchange technical meeting, July 2025",
			caption: "Capacity Exchange Technical Meeting. Photo: AJurno (WMB), CC BY-SA 4.0. 2025",
			href: COMMONS + "Capacity_Exchange_Technical_Meeting_-_July_2025_01.jpg"
		},
		{
			name: "capx-technical-meeting-2025-02",
			width: 600,
			height: 338,
			alt: "Capacity Exchange team at the technical meeting, July 2025",
			caption: "Capacity Exchange Technical Meeting. Photo: AJurno (WMB), CC BY-SA 4.0. 2025",
			href: COMMONS + "Capacity_Exchange_Technical_Meeting_-_July_2025_02.jpg"
		}
	];
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
							<picture>
								<source
									type="image/webp"
									srcset="/images/wikicon-2025-600w.webp 600w, /images/wikicon-2025-1200w.webp 1200w"
									sizes="(max-width: 768px) 100vw, 600px"
								/>
								<img
									src="/images/wikicon-2025-600w.jpg"
									srcset="/images/wikicon-2025-600w.jpg 600w, /images/wikicon-2025-1200w.jpg 1200w"
									sizes="(max-width: 768px) 100vw, 600px"
									width="600"
									height="510"
									loading="lazy"
									decoding="async"
									alt="Victor Góis at WikiCon Brasil 2025"
									class="profile-image"
								/>
							</picture>
							<figcaption class="image-caption">
								Photo by Rodrigo Tetsuo Argenton. 2025
							</figcaption>
						</figure>
						<div class="photo-gallery">
							{#each photos as photo}
								<figure class="gallery-item" use:reveal={{ transition: "fade" }}>
									<picture>
										<source
											type="image/webp"
											srcset="/images/{photo.name}-600w.webp 600w, /images/{photo.name}-1200w.webp 1200w"
											sizes="(max-width: 768px) 100vw, 300px"
										/>
										<img
											src="/images/{photo.name}-600w.jpg"
											srcset="/images/{photo.name}-600w.jpg 600w, /images/{photo.name}-1200w.jpg 1200w"
											sizes="(max-width: 768px) 100vw, 300px"
											width={photo.width}
											height={photo.height}
											loading="lazy"
											decoding="async"
											alt={photo.alt}
											class="profile-image gallery-image"
										/>
									</picture>
									{#if photo.caption}
										<figcaption class="image-caption">
											{#if photo.href}
												<a href={photo.href} target="_blank" rel="noopener noreferrer">{photo.caption}</a>
											{:else}
												{photo.caption}
											{/if}
										</figcaption>
									{/if}
								</figure>
							{/each}
						</div>
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

	.photo-gallery {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
		max-width: 600px;
		margin-bottom: 20px;
	}

	.gallery-item {
		margin: 0;
	}

	.gallery-image {
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.image-caption a {
		color: inherit;
	}

	@media (max-width: 480px) {
		.photo-gallery {
			grid-template-columns: 1fr;
		}
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
