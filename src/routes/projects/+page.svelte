<script>
	import VideoGrid from '../../lib/components/VideoGrid.svelte';
	import { getVideos } from '../../lib/Videos.ts';
	import { t } from '../../i18n';
	import { derived } from 'svelte/store';
	
	// Cria um store reativo que atualiza os vídeos quando o idioma muda
	const videos = derived(t, () => getVideos());
</script>

<svelte:head>
	<title>{$t('projects.pageTitle')}</title>
</svelte:head>

<main>
	<div class="projects-container">
		<h1>{$t('projects.title')}</h1>
		<p class="subtitle">{$t('projects.subtitle')}</p>
		
		<VideoGrid videos={$videos} />
	</div>
</main>

<style>
	main {
		padding: 2rem;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.projects-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	h1 {
		text-align: center;
		font-size: 2.5rem;
		font-weight: bold;
		color: var(--mainColor);
		margin-bottom: 0.5rem;
	}

	.subtitle {
		text-align: center;
		font-size: 1.1rem;
		color: var(--mainColor);
		opacity: 0.8;
		margin-bottom: 3rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	/* Responsividade */
	@media (max-width: 768px) {
		main {
			padding: 1rem;
		}

		h1 {
			font-size: 2rem;
		}

		.subtitle {
			font-size: 1rem;
			margin-bottom: 2rem;
		}
	}
</style>
