<script>
	import { locale, t } from "../../i18n";
	import Timeline from "../../lib/components/Timeline.svelte";
	import TableauGraphs from "../../lib/components/TableauGraphs.svelte";
	import { reveal } from "svelte-reveal";
	import { derived } from "svelte/store";

	const menuItems = [0, 1, 2, 3, 4, 5];

	const menuContent = derived([t], ([$t]) => [
		{
			Title: $t("projectPageContent.overviewTitle"),
			Content: $t("projectPageContent.overview")
		},
		{
			Title: $t("projectPageContent.academicBackgroundTitle"),
			Content: $t("projectPageContent.academicBackground")
		},
		{
			Title: $t("projectPageContent.softwareProjectsTitle"),
			Content: $t("projectPageContent.softwareProjects")
		},
		{
			Title: $t("projectPageContent.dataVisTitle"),
			Content: $t("projectPageContent.dataVis")
		},
		{
			Title: $t("projectPageContent.publishedWorkTitle"),
			Content: $t("projectPageContent.publishedWork")
		},
		{
			Title: $t("projectPageContent.techBlogTitle"),
			Content: $t("projectPageContent.techBlog")
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
			<div class="menuWrapper">
				<ul>
					{#each menuItems as item, index (item)}
						<li>
							<button style="animation-delay: {index * 0.3}s;" on:click={() => handleClick(item)}>
								{$t(`project.menu${item}`)}</button
							>
						</li>
					{/each}
				</ul>
			</div>
			<div class="menuContent">
				{#if selectedMenuItem !== null}
					<div use:reveal={{ transition: "fade" }} class="content">
						<h4>{$menuContent[selectedMenuItem].Title}</h4>
						<p use:reveal={{ transition: "fade" }}>
							{@html $menuContent[selectedMenuItem].Content}
						</p>
					</div>
					{#if selectedMenuItem === 3}
						<TableauGraphs />
					{/if}
				{:else}
					<div class="content">
						<h4>{$menuContent[0].Title}</h4>
						<p use:reveal={{ transition: "fade" }}>{@html $menuContent[0].Content}</p>
					</div>
				{/if}
			</div>
		</div>
		{#if selectedMenuItem === null || selectedMenuItem === 0}
			<div class="row">
				<div class="timelineWrapper">
					<button on:click={toggleTimeline}
						>{#if $locale === "en"}Professional Timeline{:else}Timeline Profissional{/if}</button
					>
					{#if showTimeline}
						<Timeline />
					{/if}
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	.timelineWrapper {
		text-align: center;
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
	}

	button {
		font-weight: 700;
		text-align: start;
		margin: 0 auto;
		cursor: pointer;
	}
</style>
