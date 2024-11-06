<script lang="ts">
	import { fade } from "svelte/transition";
	export let data;
</script>

<div class="container" in:fade>
	<h1>Blog</h1>
	<div class="posts-grid">
		{#each data.posts as post}
			<a
				href={`/blog/${post.slug}`}
				class="post-card {post.source === 'devto' ? 'devto-post' : ''}"
			>
				<h2>{post.title}</h2>
				{#if post.subtitle}
					<h3>{post.subtitle}</h3>
				{/if}
				<div class="metadata">
					<time datetime={post.date}>
						{new Date(post.date).toLocaleDateString()}
					</time>
					<div class="tags">
						{#each post.metadata.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				</div>
				{#if post.source === "devto"}
					<div class="source-badge">dev.to</div>
				{/if}
			</a>
		{/each}
	</div>
</div>

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 20px;
	}

	.posts-grid {
		display: grid;
		gap: 2rem;
		margin-top: 2rem;
	}

	.post-card {
		padding: 1.5rem;
		border: 1px solid var(--mainColor);
		border-radius: 8px;
		text-decoration: none;
		transition: transform 0.2s ease;
	}

	.post-card:hover {
		transform: translateY(-4px);
	}

	h1 {
		color: var(--mainColor);
		font-size: 2.5rem;
	}

	h2 {
		color: var(--mainColor);
		margin: 0;
	}

	h3 {
		color: var(--secondaryColor);
		margin: 0.5rem 0;
		font-size: 1.1rem;
	}

	.metadata {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
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

	.devto-post {
		border: 1px solid var(--secondaryColor);
		background: rgba(var(--secondaryColor-rgb), 0.1);
		position: relative;
	}

	.source-badge {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: var(--secondaryColor);
		color: var(--backgroundColor);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
	}
</style>
