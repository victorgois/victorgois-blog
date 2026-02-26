<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	export let data: Array<{ label: string; value: number }>;
	export let width = 600;
	export let height = 400;
	export let color = 'var(--visitedColor)';

	let chartContainer: HTMLDivElement;

	onMount(() => {
		const margin = { top: 20, right: 20, bottom: 40, left: 60 };
		const chartWidth = width - margin.left - margin.right;
		const chartHeight = height - margin.top - margin.bottom;

		// Clear previous chart
		d3.select(chartContainer).selectAll('*').remove();

		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3
			.scaleBand()
			.domain(data.map((d) => d.label))
			.range([0, chartWidth])
			.padding(0.2);

		const y = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.value) || 100])
			.range([chartHeight, 0]);

		// X axis
		svg
			.append('g')
			.attr('transform', `translate(0,${chartHeight})`)
			.call(d3.axisBottom(x))
			.selectAll('text')
			.style('fill', 'var(--mainColor)');

		// Y axis
		svg.append('g').call(d3.axisLeft(y)).selectAll('text').style('fill', 'var(--mainColor)');

		// Bars with animation
		svg
			.selectAll('.bar')
			.data(data)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', (d) => x(d.label) || 0)
			.attr('width', x.bandwidth())
			.attr('fill', color)
			.attr('y', chartHeight)
			.attr('height', 0)
			.transition()
			.duration(800)
			.attr('y', (d) => y(d.value))
			.attr('height', (d) => chartHeight - y(d.value));

		// Style axis lines
		svg.selectAll('path, line').style('stroke', 'var(--secondaryColor)');
	});
</script>

<div bind:this={chartContainer} class="chart-container" />

<style>
	.chart-container {
		width: 100%;
		overflow-x: auto;
		margin: 2rem 0;
	}

	:global(.chart-container svg) {
		display: block;
		margin: 0 auto;
	}
</style>
