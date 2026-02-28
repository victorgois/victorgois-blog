import { loadMdsvexPosts } from '$lib/utils/postLoader';

export const prerender = true;
export const ssr = false;
export const csr = true;

export async function load() {
	let recentPosts = [];
	try {
		recentPosts = await loadMdsvexPosts();
	} catch (e) {
		console.error('Failed to load posts:', e);
	}
	return { recentPosts };
}
