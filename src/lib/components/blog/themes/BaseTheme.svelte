<script lang="ts">
	import type { BlogPost } from "../../../types/blog";
	import { fade } from "svelte/transition";
	import Paragraph from "../components/Paragraph.svelte";
	import Quote from "../components/Quote.svelte";

	export let post: BlogPost;
</script>

<article in:fade>
	<header>
		<h1>{post.title}</h1>
		{#if post.subtitle}
			<h2>{post.subtitle}</h2>
		{/if}
		<time datetime={post.date}>
			{new Date(post.date).toLocaleDateString()}
		</time>
		<div class="metadata">
			<span class="author">Por {post.metadata.author}</span>
			<span class="tags">
				{#each post.metadata.tags as tag}
					<span class="tag">{tag}</span>
				{/each}
			</span>
		</div>
	</header>
	<div class="content">
		{#each post.content ?? [] as block}
			{#if block.type === "paragraph"}
				<Paragraph content={block.content} style={block.style} />
			{:else if block.type === "quote"}
				<Quote content={block.content} style={block.style} />
			{/if}
		{/each}
	</div>
</article>

<style>
	article {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: var(--mainColor);
	}

	h2 {
		font-size: 1.5rem;
		color: var(--secondaryColor);
		margin-bottom: 1rem;
	}

	time {
		color: var(--secondaryColor);
		font-size: 0.9rem;
	}

	.metadata {
		margin-top: 1rem;
		display: flex;
		gap: 1rem;
		color: var(--secondaryColor);
	}

	.tags {
		display: flex;
		gap: 0.5rem;
	}

	.tag {
		background: var(--secondaryColor);
		color: var(--backgroundColor);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
	}
</style>
