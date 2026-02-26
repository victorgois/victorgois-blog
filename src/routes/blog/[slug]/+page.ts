import { ArticleEndPoint } from '$lib/Constants';
import { loadMdsvexPost } from '$lib/utils/postLoader';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, url }) => {
	const { slug } = params;
	const lang = url.searchParams.get('lang') ?? undefined;

	// Determine if slug is numeric (dev.to) or string (mdsvex)
	const isNumeric = /^\d+$/.test(slug);

	if (isNumeric) {
		// Load from dev.to API
		try {
			let response = await fetch(`${ArticleEndPoint}/${slug}`);
			const article = response.ok && (await response.json());

			if (!article) {
				throw error(404, 'Article not found');
			}

			return {
				article,
				type: 'devto'
			};
		} catch (e) {
			throw error(404, 'Article not found');
		}
	} else {
		// Load mdsvex post
		try {
			const postModule = await loadMdsvexPost(slug, lang);

			if (!postModule) {
				throw error(404, 'Post not found');
			}

			return {
				post: postModule,
				type: 'mdsvex'
			};
		} catch (e) {
			throw error(404, 'Post not found');
		}
	}
}) satisfies PageLoad;
