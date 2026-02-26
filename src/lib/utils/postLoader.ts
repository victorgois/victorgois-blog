import type { MdsvexPost, PostMetadata } from '$lib/types/blog';

export interface PostModule {
	metadata: PostMetadata;
	default: any;
}

/**
 * Load all .svx posts from the posts directory.
 * Files must follow the naming convention: <slug>.<lang>.svx (e.g. cop30.pt.svx)
 */
export async function loadMdsvexPosts(): Promise<MdsvexPost[]> {
	const postFiles = import.meta.glob<PostModule>(
		'/src/routes/blog/posts/*.svx',
		{ eager: false }
	);

	const posts: MdsvexPost[] = [];

	for (const path in postFiles) {
		const module = await postFiles[path]();
		const metadata = module.metadata;

		if (!metadata.published) continue;

		const filename = path.split('/').pop() ?? '';
		const withoutExt = filename.replace('.svx', '');
		const parts = withoutExt.split('.');
		const lang = parts.pop() ?? 'en';
		const slug = parts.join('.');

		posts.push({
			slug,
			lang: metadata.lang ?? lang,
			title: metadata.title,
			description: metadata.description,
			date: metadata.date,
			published: metadata.published,
			tags: metadata.tags ?? [],
			author: metadata.author,
			cover_image: metadata.cover_image,
			reading_time_minutes: metadata.reading_time_minutes
		});
	}

	return posts.sort((a, b) =>
		new Date(b.date).getTime() - new Date(a.date).getTime()
	);
}

/**
 * Load a single mdsvex post by slug and preferred language.
 * Falls back to any available language if the preferred one doesn't exist.
 */
export async function loadMdsvexPost(slug: string, lang?: string): Promise<PostModule | null> {
	const candidates = lang
		? [lang, ...['pt', 'en'].filter((l) => l !== lang)]
		: ['pt', 'en'];

	for (const l of candidates) {
		try {
			const module = await import(`../../routes/blog/posts/${slug}.${l}.svx`);
			return module;
		} catch {
			// try next candidate
		}
	}

	// Backward compatibility: try without language suffix
	try {
		const module = await import(`../../routes/blog/posts/${slug}.svx`);
		return module;
	} catch {
		return null;
	}
}
