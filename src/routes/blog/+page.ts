import { getAllPosts } from "../../lib/posts";
import { error } from "@sveltejs/kit";

export async function load() {
	try {
		const posts = await getAllPosts();
		return {
			posts
		};
	} catch (e) {
		throw error(404, "Not found");
	}
}
