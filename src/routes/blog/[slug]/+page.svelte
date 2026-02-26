<script lang="ts">
	import FaExternalLinkAlt from 'svelte-icons/fa/FaExternalLinkAlt.svelte';
	import type { Article } from './types.js';

	export let data;

	$: isDevTo = data.type === 'devto';
	$: article = isDevTo ? data.article : null;
	$: post = !isDevTo ? data.post : null;

	$: pageTitle = isDevTo ? article?.title : post?.metadata?.title;
</script>

<svelte:head>
	<title>VictorGóis — {pageTitle || 'Missing article'}</title>
</svelte:head>

{#if isDevTo && article}
	<!-- Dev.to article rendering -->
	<div class="articleContainer">
		<div class="article">
			<h1 class="title">
				<a href={article.url} target="_blank" rel="noreferrer">{article.title}</a>
				<a class="icon" href={article.url} target="_blank"><FaExternalLinkAlt /></a>
			</h1>
			{@html article.body_html}
		</div>
	</div>
{:else if post}
	<!-- mdsvex post rendering -->
	<div class="mdsvex-container">
		<svelte:component this={post.default} />
	</div>
{/if}

<style>
	.articleContainer {
		width: 100%;
		max-width: 350px;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		text-align: center;
		padding: 0;
		margin: 50px 10px 0;
		text-align: center;
		/* font-size: 20px; */
	}

	.mdsvex-container {
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
		padding: 0 20px;
	}

	h1 {
		font-weight: 700;
		text-align: start;
		margin: 0;
		/* font-size: 36px; */
	}
	.title {
		display: flex;
	}

	.article :global(img) {
		max-width: 80%;
	}

	.article {
		text-align: start;
		box-sizing: border-box;
		font-weight: 700;
		display: flex;
		flex-direction: column;
		padding: 30px;
		width: 100%;
		border-radius: 5px;
	}
	.icon {
		width: 20px;
		height: 20px;
		margin-left: 10px;
	}

	.article > h1 > a {
		color: white;
	}
	.article:hover {
		cursor: pointer;
	}

	@media (min-width: 900px) {
		.articleContainer {
			padding: 0;
			max-width: 900px;
		}
		.article > h1 {
			font-size: 48px;
			margin: 50px 0 0 0;
		}
	}
</style>
