import { getPostBySlug } from "../../../lib/posts";
import type { PageLoad } from "./types";

export const load = async ({ params }: PageLoad) => {
	const post = await getPostBySlug(params.slug);

	if (!post) {
		throw new Error("Post not found");
	}

	return {
		post
	};
};
