<script>
	import { locale, t } from "../../i18n";
	import { reveal } from "svelte-reveal";
	// @ts-ignore
	import ProjectCard from "../../lib/components/ProjectCard.svelte";

	const projects = [
		{
			title: "Hoje tem evento na Arena MRV?",
			description: "",
			videoUrl: "https://example.com/video1.mp4",
			poster: "https://example.com/poster1.jpg",
			link: "https://github.com/username/project1"
		},
		{
			title: "A História ilustrada do saber",
			description: "Desenvolvido junto ao Nexo Jornalismo",
			videoUrl: "historia-ilustrada.mp4",
			poster: "historia-ilustrada.jpg",
			link: "https://example.com/project2"
		}

		// Add more projects as needed
	];
</script>

<svelte:head>
	<title>Victor Góis — Projects</title>
</svelte:head>

<main>
	<div class="header-container">
		<h2>Projetos</h2>
	</div>
	<div class="column">
		<div class="row">
			{#each projects as project, index}
				<ProjectCard {project} />
				{#if (index + 1) % 3 === 0 && index !== projects.length - 1}
					<div class="row" />
				{/if}
			{/each}
		</div>
	</div>
</main>

<style>
	main {
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
	}

	h2 {
		max-width: 700px;
	}

	.row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-bottom: 20px;
	}

	@media (max-width: 900px) {
		.row {
			flex-direction: column;
		}
	}
</style>
