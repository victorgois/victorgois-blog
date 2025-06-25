import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: "0.0.0.0" // Escutar em todos os endereços IP disponíveis
	},
	optimizeDeps: {
		exclude: ['@sveltejs/kit']
	}
});
