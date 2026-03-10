<script lang="ts">
	import { t, locale } from "../../i18n";
	import type { BlogPost } from "$lib/types/blog";
	import { isDevToArticle, isMdsvexPost } from "$lib/types/blog";

	export let data;

	const blackListedArticles = [422939];

	// Use combined posts
	$: allPosts = data.allPosts || [];

	// Filter blacklisted dev.to articles and mdsvex posts not matching the current locale
	$: filteredPosts = allPosts.filter((post) => {
		if (isDevToArticle(post)) {
			return !blackListedArticles.includes(post.id);
		}
		return post.lang === $locale;
	});

	// Helper to get article URL
	function getPostUrl(post: BlogPost): string {
		if (isDevToArticle(post)) {
			return `/blog/${post.id}`;
		} else {
			return `/blog/${post.slug}?lang=${post.lang}`;
		}
	}

	// Reactive helper to get post date (depends on locale)
	$: getPostDate = (post: BlogPost): string => {
		if (isDevToArticle(post)) {
			return post.readable_publish_date;
		} else {
			return new Date(post.date).toLocaleDateString($locale === 'en' ? 'en-US' : 'pt-BR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		}
	};

	// Helper to get tags string
	function getPostTags(post: BlogPost): string {
		if (isDevToArticle(post)) {
			return post.tags || post.category || '';
		} else {
			return post.tags.join(', ');
		}
	}
</script>

<svelte:head>
	<title>Victor Góis — Blog</title>
</svelte:head>

<div class="articlesContainer">
	<div class="articles">
		<h1>{$t("blog.title")}</h1>

		{#each filteredPosts as post}
			<div class="article">
				<div class="header">
					<h2>{post.title}</h2>
					<div class="meta">
						<span class="tags">Tags: {getPostTags(post)}</span>
						<span class="date">{getPostDate(post)}</span>
					</div>
				</div>
				<p>{post.description || ""}</p>

				<a href={getPostUrl(post)}>
					<div class="button">{$t("blog.readMore")}</div>
				</a>
			</div>
		{/each}

		{#if filteredPosts.length === 0}
			{#if $locale === "en"}
				<div>No Articles</div>
			{:else}
				<div>Sem artigos</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.articlesContainer {
		width: 100%;
		max-width: 700px;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		text-align: center;
		margin: 0 auto;
		text-align: center;
	}

	.articlesContainer .articles {
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 40px;
		margin-top: 30px;
	}

	h2 {
		display: flex;
	}

	.articles > h1 {
		font-weight: 700;
		text-align: start;
		margin: 0;
		font-size: 2em;
	}

	.article {
		text-align: start;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		color: var(--mainColor);
		padding: 2rem;
		width: 100%;
		transition: transform 0.2s ease-in-out;
		position: relative;
	}

	.article p {
		font-weight: 100;
		color: var(--secondaryColor);
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--secondaryColor);
	}

	.date {
		font-style: italic;
	}

	.badge {
		position: absolute;
		top: 10px;
		right: 10px;
		background: var(--visitedColor);
		color: var(--backgroundColor);
		padding: 0.3rem 0.6rem;
		border-radius: 3px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.articles {
		width: 100%;
		margin: 50px auto;
		display: grid;
		grid-gap: 1rem;
		grid-template-columns: 1fr;
	}

	.button {
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--mainColor);
		border: 2px solid var(--mainColor);
		padding: 10px;
	}

	@media (min-width: 900px) {
		.articles > h1 {
			font-size: 2em;
			margin: 0 0 50px 0;
		}

		.articles {
			grid-template-columns: 1fr;
		}

		.articles .article {
			min-height: 200px;
		}

		.button {
			max-width: 200px;
		}
	}

	@media (min-width: 600px) {
		.articles {
			grid-template-columns: 1fr;
		}
	}
</style>
