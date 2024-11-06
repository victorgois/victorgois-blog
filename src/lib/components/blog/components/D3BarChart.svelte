<script lang="ts">
	import { onMount } from "svelte";
	import * as d3 from "d3";

	export let data: number[];
	let element: HTMLDivElement;

	onMount(() => {
		const margin = { top: 20, right: 20, bottom: 30, left: 40 };
		const width = 600 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3
			.select(element)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const x = d3.scaleBand().range([0, width]).padding(0.1);

		const y = d3.scaleLinear().range([height, 0]);

		x.domain(data.map((d, i) => i.toString()));
		y.domain([0, d3.max(data) || 0]);

		svg
			.selectAll(".bar")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", (d, i) => x(i.toString()) || 0)
			.attr("width", x.bandwidth())
			.attr("y", (d) => y(d))
			.attr("height", (d) => height - y(d))
			.attr("fill", "var(--mainColor)");

		svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

		svg.append("g").call(d3.axisLeft(y));
	});
</script>

<div bind:this={element} class="visualization" />

<style>
	.visualization {
		width: 100%;
		margin: 2rem 0;
	}
</style>
