import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
	resolve: {
		alias: {
			$lib: path.resolve("./src/lib/"),
			$base: path.resolve("./src/baseApp")
		}
	},
	plugins: [sveltekit()],
	server: {
		host: "0.0.0.0"
	}
});
