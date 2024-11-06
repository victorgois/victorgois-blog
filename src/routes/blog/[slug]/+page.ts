import type { PageLoad } from "./types";

export const load = async ({ params }: PageLoad) => {
	const post = {
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
				content:
					"The best data visualizations are those that reveal patterns and insights that would be difficult to see in raw data."
			}
		]
	};

	if (params.slug !== post.slug) {
		throw new Error("Post not found");
	}

	return {
		post
	};
};
