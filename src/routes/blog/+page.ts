import { UserInfoEndpoint } from "$lib/Constants";
import { error } from "@sveltejs/kit";
import { loadMdsvexPosts } from "$lib/utils/postLoader";
import type { Article, MdsvexPost, BlogPost } from "$lib/types/blog";

export async function load({ fetch }) {
	let devToArticles: Article[] = [];
	let mdsvexPosts: MdsvexPost[] = [];

	// Load dev.to articles
	try {
		const response = await fetch(`${UserInfoEndpoint}`);
		devToArticles = await response.json();
	} catch (e) {
		console.error("Failed to fetch dev.to articles:", e);
		// Don't throw - continue with local posts only
	}

	// Load local mdsvex posts
	try {
		mdsvexPosts = await loadMdsvexPosts();
	} catch (e) {
		console.error("Failed to load mdsvex posts:", e);
	}

	// Combine both sources
	const allPosts: BlogPost[] = [...devToArticles, ...mdsvexPosts];

	// Sort by date (dev.to uses published_at, mdsvex uses date)
	allPosts.sort((a, b) => {
		const dateA = 'published_at' in a
			? new Date(a.published_at).getTime()
			: new Date(a.date).getTime();
		const dateB = 'published_at' in b
			? new Date(b.published_at).getTime()
			: new Date(b.date).getTime();
		return dateB - dateA; // Newest first
	});

	return {
		devToArticles,
		mdsvexPosts,
		allPosts
	};
}
