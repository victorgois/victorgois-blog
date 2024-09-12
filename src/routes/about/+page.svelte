<script>
	import { locale, t } from "../../i18n";
	import Timeline from "../../lib/components/Timeline.svelte";
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
	<div class="column">
		<div class="row">
			<div class="menuContent">
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
					</div>
				{/if}
			</div>
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
		padding: 0;
		text-align: start;
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

	.menuContent {
		flex-grow: 0;
		flex-basis: 60%;
		display: flex;
		flex-direction: column;
		justify-content: center;
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
</style>
