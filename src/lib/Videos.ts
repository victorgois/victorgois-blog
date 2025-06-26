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
 */

/** @type {Video[]} */
const videoData = [
	{
		src: '/videos/nexo-a-historia-ilustrada-do-saber.mp4',
		titleKey: 'videos.nexo.title',
		descriptionKey: 'videos.nexo.description',
		poster: '', // Vamos adicionar uma imagem de poster futuramente
		// webmSrc: '/videos/nexo-a-historia-ilustrada-do-saber.webm' // Versão WebM quando disponível
	},
	{
		src: '/videos/nexo-home-25-06-2025.mov',
		titleKey: 'videos.nexo.home.title',
		descriptionKey: 'videos.nexo.home.description',
		poster: '', // Vamos adicionar uma imagem de poster futuramente
	}
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
		poster: video.poster
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