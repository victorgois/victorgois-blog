export interface BlogPost {
	slug: string;
	title: string;
	subtitle?: string;
	date: string;
	source?: "local" | "devto";
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
	visualizationData?: {
		type: string;
		data: number[];
	};
	style?: string;
}
