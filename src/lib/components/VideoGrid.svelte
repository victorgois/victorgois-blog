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

	let videoElements = [];
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
	 * @param {Event} event
	 * @param {boolean} shouldPlay
	 */
	const handleVideoHover = (event, shouldPlay) => {
		const video = event.target;
		if (shouldPlay) {
			video.play().catch(() => {});
		} else {
			video.pause();
		}
	};
</script>

<div class="video-grid">
	{#each videos as video, index}
		<div class="video-container">
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
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		padding: 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Desktop: Grid 3x3 */
	@media (min-width: 768px) {
		.video-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	/* Mobile: Grid 1x1 */
	@media (max-width: 767px) {
		.video-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
			padding: 0.5rem;
		}
	}

	.video-container {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		background: var(--backgroundColor);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.video-container:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
	}

	.video-item {
		width: 100%;
		height: 100%;
		min-height: 200px;
		object-fit: cover;
		display: block;
		background: linear-gradient(45deg, #333 25%, #666 25%, #666 50%, #333 50%, #333 75%, #666 75%);
		background-size: 20px 20px;
	}

	/* Quando o vídeo está carregado, remove o background pattern */
	.video-item[data-loaded] {
		background: #000;
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