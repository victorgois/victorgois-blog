// Extend existing Article interface from dev.to
export interface Article {
	type_of: string;
	id: number;
	title: string;
	description: string;
	readable_publish_date: string;
	slug: string;
	path: string;
	url: string;
	comments_count: number;
	public_reactions_count: number;
	collection_id: null;
	published_timestamp: Date;
	positive_reactions_count: number;
	cover_image: null;
	social_image: string;
	canonical_url: string;
	created_at: Date;
	edited_at: Date;
	crossposted_at: null;
	published_at: Date;
	last_comment_at: Date;
	reading_time_minutes: number;
	tag_list: string;
	tags: string[];
	body_html: string;
	body_markdown: string;
	user: User;
	category?: string;
}

export interface User {
	name: string;
	username: string;
	twitter_username: string;
	github_username: string;
	user_id: number;
	website_url: string;
	profile_image: string;
	profile_image_90: string;
}

// New interface for mdsvex posts
export interface MdsvexPost {
	slug: string;
	lang: string;
	title: string;
	description: string;
	date: string;
	published: boolean;
	tags: string[];
	author?: string;
	cover_image?: string;
	reading_time_minutes?: number;
}

// Frontmatter metadata from .svx files
export interface PostMetadata {
	title: string;
	description: string;
	date: string;
	published: boolean;
	tags?: string[];
	author?: string;
	cover_image?: string;
	reading_time_minutes?: number;
	lang?: string;
}

// Unified type for blog listing (combines both sources)
export type BlogPost = Article | MdsvexPost;

// Type guard to distinguish between sources
export function isDevToArticle(post: BlogPost): post is Article {
	return 'id' in post && typeof (post as Article).id === 'number';
}

export function isMdsvexPost(post: BlogPost): post is MdsvexPost {
	return 'slug' in post && !('id' in post);
}
