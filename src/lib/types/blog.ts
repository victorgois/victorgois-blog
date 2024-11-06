export interface BlogPost {
	slug: string;
	title: string;
	subtitle?: string;
	date: string;
	metadata: {
		author: string;
		tags: string[];
		readingTime?: number;
	};
	content?: BlogContent[];
}

export interface BlogContent {
	type: "paragraph" | "quote" | "visualization" | "markdown";
	content: string;
	style?: string;
}
