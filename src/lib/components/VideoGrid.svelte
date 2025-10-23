<script>
	import { onMount } from 'svelte';
	import { t } from '../../i18n';
	import { getVideoMimeType } from '../Videos.ts';

	/**
	 * @typedef {Object} Video
	 * @property {string} src - Caminho do vídeo
	 * @property {string} title - Título do vídeo
	 * @property {string} description - Descrição do vídeo
	 * @property {string} poster - Imagem de preview (opcional)
	 */

	/** @type {Video[]} */
	export let videos = [];

	/** @type {HTMLVideoElement[]} */
	let videoElements = [];
	/** @type {IntersectionObserver | null} */
	let observer;

	onMount(() => {
		// Intersection Observer para lazy loading dos vídeos
		if ('IntersectionObserver' in window) {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const video = entry.target;
							if (video && !video.hasAttribute('data-loaded')) {
								video.setAttribute('data-loaded', 'true');
								// Força o carregamento do vídeo
								video.load();
								// Tenta iniciar o play após um pequeno delay
								setTimeout(() => {
									video.play().catch((error) => {
										console.log('Autoplay bloqueado ou erro:', error);
										// Se falhar, tenta novamente com muted
										video.muted = true;
										video.play().catch(() => {
											console.log('Vídeo não pode ser reproduzido:', video.src);
										});
									});
								}, 100);
							}
						}
					});
				},
				{
					rootMargin: '50px'
				}
			);

			// Observa todos os elementos de vídeo
			videoElements.forEach((video) => {
				if (video) observer.observe(video);
			});
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});

	/**
	 * Manipula o hover para controle de play/pause
	 */
	const handleVideoHover = (event, shouldPlay) => {
		const video = event.target;
		if (video) {
			if (shouldPlay) {
				video.play().catch(() => {});
			} else {
				video.pause();
			}
		}
	};
</script>

<div class="video-grid">
	{#each videos as video, index}
		<div
			class="video-container"
			class:portrait={video.src.includes('capacity-directory')}
			class:large-video={index === 0}
			class:small-video-1={index === 1}
			class:portrait-video={index === 2}
			class:small-video-2={index === 3}
			class:overflow={index === 4}
			class:extra-video={index >= 5}
		>
			<video
				bind:this={videoElements[index]}
				muted
				loop
				playsinline
				preload="auto"
				poster={video.poster}
				controls
				on:mouseenter={(e) => handleVideoHover(e, true)}
				on:mouseleave={(e) => handleVideoHover(e, false)}
				on:error={(e) => console.error('Erro ao carregar vídeo:', video.src, e)}
				on:loadstart={() => console.log('Iniciando carregamento:', video.src)}
				on:canplay={() => console.log('Vídeo pode ser reproduzido:', video.src)}
				class="video-item"
			>
				<!-- Múltiplos formatos para melhor compatibilidade: MP4, MOV, WebM, etc. -->
				<source src={video.src} type={getVideoMimeType(video.src)} />
				<!-- Fallback: tenta interpretar .mov como MP4 se necessário -->
				{#if video.src.includes('.mov')}
					<source src={video.src} type="video/mp4" />
				{/if}
				<!-- Futuramente podemos adicionar WebM aqui -->
				<!-- <source src={video.webmSrc} type="video/webm" /> -->
				
				<p>{$t('videos.unsupported')}</p>
			</video>
			
			<div class="video-overlay">
				<h3 class="video-title">{video.title}</h3>
				<p class="video-description">{video.description}</p>
			</div>
		</div>
	{/each}
</div>

<style>
	.video-grid {
		display: grid;
		grid-template-columns: 1.5fr 1.5fr 1.3fr;
		grid-template-rows: repeat(2, 300px);
		grid-auto-rows: 300px;
		row-gap: 2rem;
		column-gap: 2rem;
		padding: 2rem 1rem;
		max-width: 1400px;
		margin: 0 auto;
		justify-content: center;
		align-items: start;
	}

	/* Desktop: Grid responsivo baseado no conteúdo */
	@media (min-width: 768px) and (max-width: 1199px) {
		.video-grid {
			grid-template-columns: 1.5fr 1.5fr 1.3fr;
			grid-template-rows: repeat(2, 300px);
			grid-auto-rows: 300px;
			align-items: start;
		}
	}

	/* Telas muito grandes: mantém layout assimétrico */
	@media (min-width: 1200px) {
		.video-grid {
			grid-template-columns: 1.5fr 1.5fr 1.3fr;
			grid-template-rows: repeat(2, 300px);
			grid-auto-rows: 300px;
			align-items: start;
		}
	}

	/* Mobile: Grid 1x1 */
	@media (max-width: 767px) {
		.video-grid {
			display: grid;
			grid-template-columns: 1fr;
			grid-auto-rows: auto;
			grid-template-rows: auto;
			row-gap: 1.5rem;
			column-gap: 0;
			padding: 1.5rem 0.5rem;
		}

		/* Reset posicionamento no mobile */
		.video-container.large-video,
		.video-container.small-video-1,
		.video-container.small-video-2,
		.video-container.overflow {
			grid-column: 1 !important;
			grid-row: auto !important;
			align-self: auto;
			height: auto;
			max-height: none;
			aspect-ratio: 16/9;
		}

		/* Vídeos landscape no mobile */
		.video-container.large-video .video-item,
		.video-container.small-video-1 .video-item,
		.video-container.small-video-2 .video-item,
		.video-container.overflow .video-item {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		/* Ajuste específico para vídeos retrato no mobile - altura maior */
		.video-container.portrait,
		.video-container.portrait-video {
			grid-column: 1 !important;
			grid-row: auto !important;
			align-self: auto;
			width: 100%;
			height: auto;
			max-height: 650px;
			aspect-ratio: 9/16;
		}

		/* Vídeo retrato no mobile - ocupa toda a largura */
		.video-container.portrait .video-item,
		.video-container.portrait-video .video-item {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.video-container {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		background: var(--backgroundColor);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		width: 100%;
		height: fit-content;
	}

	/* Posicionamento específico dos vídeos */
	.video-container.large-video {
		grid-column: 1;
		grid-row: 1;
		aspect-ratio: 16/9;
		height: fit-content;
		max-height: 300px;
		align-self: start;
	}

	.video-container.small-video-1 {
		grid-column: 2;
		grid-row: 1;
		aspect-ratio: 16/9;
		height: fit-content;
		max-height: 300px;
		align-self: start;
	}

	.video-container.portrait-video {
		grid-column: 3;
		grid-row: 1 / 3;
		height: 550px;
		width: 100%;
		max-height: 550px;
	}

	.video-container.small-video-2 {
		grid-column: 1;
		grid-row: 2;
		aspect-ratio: 16/9;
		height: fit-content;
		max-height: 300px;
		align-self: start;
	}

	.video-container.overflow {
		grid-column: 2;
		grid-row: 2;
		aspect-ratio: 16/9;
		height: fit-content;
		max-height: 300px;
		align-self: start;
	}

	/* Vídeos adicionais (índice >= 5) fluem automaticamente no grid */
	.video-container.extra-video {
		aspect-ratio: 16/9;
		height: fit-content;
		max-height: 300px;
		align-self: start;
	}

	/* Estilo especial para vídeos em formato retrato */
	.video-container.portrait {
		height: 550px;
		width: 100%;
		max-height: 550px;
	}


	.video-container:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
	}

	.video-item {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		background: linear-gradient(45deg, #333 25%, #666 25%, #666 50%, #333 50%, #333 75%, #666 75%);
		background-size: 20px 20px;
	}



	.video-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(
			to top,
			rgba(0, 0, 0, 0.8) 0%,
			rgba(0, 0, 0, 0.4) 50%,
			transparent 100%
		);
		color: white;
		padding: 1.5rem 1rem 1rem;
		transform: translateY(100%);
		transition: transform 0.3s ease;
	}

	.video-container:hover .video-overlay {
		transform: translateY(0);
	}

	.video-title {
		font-size: 1.2rem;
		font-weight: bold;
		margin: 0 0 0.5rem 0;
		line-height: 1.3;
	}

	.video-description {
		font-size: 0.9rem;
		margin: 0;
		opacity: 0.9;
		line-height: 1.4;
	}

	/* Responsividade para textos */
	@media (max-width: 767px) {
		.video-title {
			font-size: 1.1rem;
		}
		
		.video-description {
			font-size: 0.85rem;
		}
		
		.video-overlay {
			padding: 1rem 0.75rem 0.75rem;
		}
	}

	/* Indicador de loading */
	.video-item:not([data-loaded]) {
		background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
			linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
			linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
		background-size: 20px 20px;
		background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
		animation: loading 2s linear infinite;
	}

	@keyframes loading {
		0% {
			background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
		}
		100% {
			background-position: 20px 20px, 20px 30px, 30px 10px, 10px 20px;
		}
	}
</style> 