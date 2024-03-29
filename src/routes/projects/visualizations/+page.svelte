<script>
	import { visualizations } from "../../../lib/store";
</script>

<main>
	<h1>Data Visualizations</h1>

	{#each visualizations as { title, slug }}
		<li><a href={`visualizations/${slug}`}>{title}</a></li>
	{/each}
</main>

<style>
	main {
		padding: 0;
		text-align: start;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	li {
		list-style: none;
		font-size: 18px;
	}
</style>
