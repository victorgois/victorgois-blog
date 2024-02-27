import { UserInfoEndpoint } from "../../lib/Constants";
import { error } from "@sveltejs/kit";

export async function load({ fetch }) {
	let devToArticles;
	let mediumArticles;
	try {
		devToArticles = await fetch(`${UserInfoEndpoint}`);
		devToArticles = await devToArticles.json();
	} catch (e) {
		throw error(404, "Not found");
	}

	return {
		devToArticles
	};
}
