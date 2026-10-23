import { get } from 'svelte/store';
import { t } from '../i18n';

/**
 * Função utilitária para obter o tipo MIME correto baseado na extensão do arquivo
 * @param {string} src - Caminho do arquivo de vídeo
 * @returns {string} - Tipo MIME correspondente
 */
export function getVideoMimeType(src: string): string {
	const extension = src.toLowerCase().split('.').pop();
	
	switch (extension) {
		case 'mov':
			return 'video/quicktime';
		case 'mp4':
			return 'video/mp4';
		case 'webm':
			return 'video/webm';
		case 'avi':
			return 'video/x-msvideo';
		case 'mkv':
			return 'video/x-matroska';
		case 'ogg':
			return 'video/ogg';
		default:
			// Fallback para MP4
			return 'video/mp4';
	}
}

/**
 * @typedef {Object} Video
 * @property {string} src - Caminho do vídeo
 * @property {string} title - Título do vídeo
 * @property {string} description - Descrição do vídeo
 * @property {string} poster - Imagem de preview (opcional)
 * @property {string} [webmSrc] - Versão WebM do vídeo (opcional)
 * @property {string} [liveUrl] - Link do projeto no ar (opcional)
 * @property {string} [codeUrl] - Link do código-fonte (opcional)
 * @property {string} [postUrl] - Link de artigo sobre o projeto (opcional)
 */

/** @type {Video[]} */
const videoData = [
	{
		src: '/videos/maquinas-de-soprar.mp4',
		titleKey: 'videos.maquinas.title',
		descriptionKey: 'videos.maquinas.description',
		poster: '/images/posters/maquinas-de-soprar.jpg',
		liveUrl: 'https://maquinasdesoprar.art',
		codeUrl: 'https://github.com/victorgois/maquinasdesoprar',
	},
	{
		src: '/videos/nexo-a-historia-ilustrada-do-saber.mp4',
		titleKey: 'videos.nexo.title',
		descriptionKey: 'videos.nexo.description',
		poster: '/images/posters/nexo-a-historia-ilustrada-do-saber.jpg',
		liveUrl: 'https://www.nexojornal.com.br/especial/2021/07/30/a-historia-ilustrada-de-um-saber',
	},
	{
		src: '/videos/capacity-directory-mobile-2x.mp4',
		titleKey: 'videos.capx.title',
		descriptionKey: 'videos.capx.description',
		poster: '/images/posters/capacity-directory-mobile-2x.jpg',
		liveUrl: 'https://capx.toolforge.org',
		codeUrl: 'https://github.com/wikimediabrasil/capx-frontend',
	},
	{
		src: '/videos/nexo-eleicoes-2022.mp4',
		titleKey: 'videos.nexo.elections.title',
		descriptionKey: 'videos.nexo.elections.description',
		poster: '/images/posters/nexo-eleicoes-2022.jpg',
		liveUrl: 'https://www.nexojornal.com.br/especial/2022/05/11/conheca-os-candidatos-a-presidencia-nas-eleicoes-de-2022',
	},
	{
		src: '/videos/sniic-painel-pnab.mp4',
		titleKey: 'videos.sniic.pnab.title',
		descriptionKey: 'videos.sniic.pnab.description',
		poster: '/images/posters/sniic-painel-pnab.jpg',
		liveUrl: 'https://www.gov.br/cultura/pt-br/assuntos/acoes-programas-e-politicas/sniic/sniic-painel-de-dados',
		codeUrl: 'https://github.com/SGE-Subsecretaria-de-Gestao-Estrategica/pnab-data-vis',
	},
	{
		src: '/videos/capx-map.mp4',
		titleKey: 'videos.capx.map.title',
		descriptionKey: 'videos.capx.map.description',
		poster: '/images/posters/capx-map.jpg',
		liveUrl: 'https://capx.toolforge.org',
		codeUrl: 'https://github.com/wikimediabrasil/capx-frontend',
		postUrl: '/blog/capx_map',
	},
	{
		src: '/videos/nexo-home-25-06-2025.mp4',
		titleKey: 'videos.nexo.home.title',
		descriptionKey: 'videos.nexo.home.description',
		poster: '/images/posters/nexo-home-25-06-2025.jpg',
		liveUrl: 'https://www.nexojornal.com.br',
	},
	{
		src: '/videos/cop30.mp4',
		titleKey: 'videos.cop30.title',
		descriptionKey: 'videos.cop30.description',
		poster: '/images/posters/cop30.jpg',
		liveUrl: 'https://cop30-social-monitoring.onrender.com',
		codeUrl: 'https://github.com/victorgois/cop30-colector',
		postUrl: '/blog/cop30',
	},
	{
		src: '/videos/capx-profile.mp4',
		titleKey: 'videos.capx.profile.title',
		descriptionKey: 'videos.capx.profile.description',
		poster: '/images/posters/capx-profile.jpg',
		liveUrl: 'https://capx.toolforge.org',
		codeUrl: 'https://github.com/wikimediabrasil/capx-frontend',
	},
	// Adicione mais vídeos aqui conforme necessário
];

/**
 * Função para obter todos os vídeos com traduções
 * @returns {Video[]}
 */
export function getVideos() {
	const $t = get(t);
	return videoData.map(video => ({
		src: video.src,
		title: $t(video.titleKey),
		description: $t(video.descriptionKey),
		poster: video.poster,
		liveUrl: video.liveUrl,
		codeUrl: video.codeUrl,
		postUrl: video.postUrl
	}));
}

/**
 * Função para obter um vídeo específico por índice
 * @param {number} index
 * @returns {Video | undefined}
 */
export function getVideoByIndex(index: number) {
	const videos = getVideos();
	return videos[index];
}

/**
 * Função para obter um vídeo específico por título
 * @param {string} title
 * @returns {Video | undefined}
 */
export function getVideoByTitle(title: string) {
	const videos = getVideos();
	for (let i = 0; i < videos.length; i++) {
		if (videos[i].title === title) {
			return videos[i];
		}
	}
	return undefined;
} 