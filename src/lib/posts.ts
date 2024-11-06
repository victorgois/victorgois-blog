import type { BlogPost } from "./types/blog";

export const getAllPosts = async (): Promise<BlogPost[]> => {
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

export const getPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
	const posts = await getAllPosts();
	return posts.find((post) => post.slug === slug);
};
