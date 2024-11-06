<script lang="ts">
	import { onMount } from "svelte";
	import * as d3 from "d3";

	interface VisualizationData {
		type: string;
		config: any; // TODO: Add proper typing
	}

	export let data: VisualizationData;
	let element: HTMLDivElement;

	onMount(() => {
		const svg = d3.select(element).append("svg").attr("width", "100%").attr("height", "400px");

		// Initialize visualization based on data.type and data.config
		// This is where you'd implement different visualization types
	});
</script>

<div bind:this={element} class="visualization" />

<style>
	.visualization {
		width: 100%;
		margin: 2rem 0;
	}
</style>
