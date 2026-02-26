<script>
	import { locale } from '../../i18n';

	export let title = '';
	export let description = '';
	export let date = '';
	export let tags = [];
	export let author = 'Victor Góis';
	export let reading_time_minutes = 5;

	// Format date based on locale
	$: formattedDate = date
		? new Date(date).toLocaleDateString($locale === 'en' ? 'en-US' : 'pt-BR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
		  })
		: '';
</script>

<svelte:head>
	<title>{title} — Victor Góis</title>
	<meta name="description" content={description} />
</svelte:head>

<article class="blog-post">
	<header class="post-header">
		<h1>{title}</h1>

		<div class="post-meta">
			<span class="date">{formattedDate}</span>
			<span class="reading-time">{reading_time_minutes} min read</span>
			{#if author}
				<span class="author">by {author}</span>
			{/if}
		</div>

		{#if tags && tags.length > 0}
			<div class="tags">Tags: {tags.join(', ')}</div>
		{/if}
	</header>

	<div class="post-content">
		<slot />
	</div>
</article>

<style>
	.blog-post {
		max-width: 900px;
		margin: 50px auto;
		padding: 0 20px;
		color: var(--mainColor);
	}

	.post-header {
		margin-bottom: 3rem;
		border-bottom: 2px solid var(--secondaryColor);
		padding-bottom: 1.5rem;
	}

	.post-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		line-height: 1.2;
	}

	.post-meta {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		font-size: 0.9rem;
		color: var(--secondaryColor);
		margin-bottom: 1rem;
	}

	.tags {
		font-size: 0.9rem;
		color: var(--secondaryColor);
	}

	.post-content {
		line-height: 1.8;
		font-size: 1.1rem;
	}

	/* Typography for mdsvex content */
	.post-content :global(h2) {
		font-size: 2rem;
		margin: 2.5rem 0 1rem 0;
		font-weight: 700;
	}

	.post-content :global(h3) {
		font-size: 1.5rem;
		margin: 2rem 0 1rem 0;
		font-weight: 600;
	}

	.post-content :global(p) {
		margin: 1.5rem 0;
		color: var(--mainColor);
	}

	.post-content :global(a) {
		color: var(--visitedColor);
		text-decoration: underline;
	}

	.post-content :global(code) {
		background: rgba(0, 0, 0, 0.1);
		padding: 0.2em 0.4em;
		border-radius: 3px;
		font-family: 'Fira Code', monospace;
		font-size: 0.9em;
	}

	.post-content :global(pre) {
		background: rgba(0, 0, 0, 0.1);
		padding: 1rem;
		border-radius: 5px;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	.post-content :global(pre code) {
		background: transparent;
		padding: 0;
	}

	.post-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 5px;
		margin: 2rem 0;
	}

	.post-content :global(blockquote) {
		border-left: 4px solid var(--visitedColor);
		padding-left: 1.5rem;
		margin: 1.5rem 0;
		font-style: italic;
		color: var(--secondaryColor);
	}

	@media (max-width: 900px) {
		.post-header h1 {
			font-size: 2rem;
		}

		.post-content {
			font-size: 1rem;
		}
	}
</style>
