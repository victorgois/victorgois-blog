import type { BlogPost } from "./types/blog";

const UserInfoEndpoint = "https://dev.to/api/articles?username=victorgois";

async function getDevToPosts(): Promise<BlogPost[]> {
	try {
		const response = await fetch(UserInfoEndpoint);
		const articles = await response.json();

		return articles.map((article: any) => ({
			slug: article.slug,
			title: article.title,
			subtitle: article.description,
			date: article.published_at,
			source: "devto",
			metadata: {
				author: article.user.name || "Victor Góis",
				tags: Array.isArray(article.tag_list) ? article.tag_list : article.tag_list.split(" "),
				readingTime: article.reading_time_minutes
			},
			content: [
				{
					type: "markdown",
					content: article.body_markdown || article.description
				}
			]
		}));
	} catch (error) {
		console.error("Error fetching Dev.to posts:", error);
		return [];
	}
}

export const getLocalPosts = async (): Promise<BlogPost[]> => {
	const posts = [
		{
			slug: "building-interactive-data-visualizations",
			title: "Building Interactive Data Visualizations with D3 and Svelte",
			subtitle: "A Deep Dive into Web-Based Data Visualization",
			date: "2024-11-05",
			metadata: {
				author: "Victor Góis",
				tags: ["D3.js", "Svelte", "Data Visualization", "Web Development"],
				readingTime: 8
			},
			content: [
				{
					type: "paragraph",
					content:
						"Data visualization is a powerful way to communicate complex information effectively..."
				},
				{
					type: "visualization",
					content: "Sample Bar Chart",
					visualizationData: {
						type: "bar",
						data: [12, 19, 3, 5, 2, 3, 15, 8, 9, 7]
					}
				},
				{
					type: "quote",
					content: "The best data visualizations are those that reveal patterns and insights..."
				}
			]
		},
		{
			slug: "this-is-another-post",
			title: "This is another post",
			subtitle: "This is the subtitle",
			date: "2024-11-06",
			metadata: {
				author: "Victor Góis",
				tags: ["D3.js", "Svelte", "Data Visualization", "Web Development"],
				readingTime: 10
			},
			content: [
				{
					type: "paragraph",
					content:
						"Data visualization is a powerful way to communicate complex information effectively..."
				},
				{
					type: "quote",
					content: "The best data visualizations are those that reveal patterns and insights..."
				}
			]
		}
	] as BlogPost[];

	return posts;
};

export const getAllPosts = async (): Promise<BlogPost[]> => {
	const [localPosts, devToPosts] = await Promise.all([getLocalPosts(), getDevToPosts()]);

	return [...localPosts, ...devToPosts];
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
	const posts = await getAllPosts();
	const post = posts.find((post) => post.slug === slug);

	if (post?.source === "devto") {
		try {
			const response = await fetch(`https://dev.to/api/articles/victorgois/${slug}`);
			const article = await response.json();
			return {
				...post,
				content: [
					{
						type: "markdown",
						content: article.body_markdown
					}
				]
			};
		} catch (error) {
			console.error("Error fetching Dev.to post content:", error);
			return post;
		}
	}

	return post;
};
