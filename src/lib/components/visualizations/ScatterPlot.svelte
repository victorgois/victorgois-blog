<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let data: Array<{ x: number; y: number; label?: string }>;
	export let width = 600;
	export let height = 400;

	let chartContainer: HTMLDivElement;

	onMount(() => {
		const margin = { top: 20, right: 20, bottom: 40, left: 60 };
		const chartWidth = width - margin.left - margin.right;
		const chartHeight = height - margin.top - margin.bottom;

		d3.select(chartContainer).selectAll('*').remove();

		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.x) || 100])
			.range([0, chartWidth]);

		const y = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.y) || 100])
			.range([chartHeight, 0]);

		svg
			.append('g')
			.attr('transform', `translate(0,${chartHeight})`)
			.call(d3.axisBottom(x))
			.selectAll('text')
			.style('fill', 'var(--mainColor)');

		svg.append('g').call(d3.axisLeft(y)).selectAll('text').style('fill', 'var(--mainColor)');

		// Add scatter points with tooltip
		svg
			.selectAll('.dot')
			.data(data)
			.enter()
			.append('circle')
			.attr('class', 'dot')
			.attr('cx', (d) => x(d.x))
			.attr('cy', (d) => y(d.y))
			.attr('r', 0)
			.attr('fill', 'var(--visitedColor)')
			.attr('opacity', 0.7)
			.on('mouseover', function (event, d) {
				d3.select(this).attr('r', 8).attr('opacity', 1);
			})
			.on('mouseout', function () {
				d3.select(this).attr('r', 5).attr('opacity', 0.7);
			})
			.transition()
			.duration(500)
			.attr('r', 5);

		svg.selectAll('path, line').style('stroke', 'var(--secondaryColor)');
	});
</script>

<div bind:this={chartContainer} class="scatter-container" />

<style>
	.scatter-container {
		width: 100%;
		overflow-x: auto;
		margin: 2rem 0;
	}
</style>
