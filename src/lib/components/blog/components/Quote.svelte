<script lang="ts">
	export let content: string;
	export let style: string | undefined = undefined;
</script>

<blockquote class={style}>
	{content}
</blockquote>

<style>
	blockquote {
		border-left: 4px solid var(--mainColor);
		margin: 1.5rem 0;
		padding: 0.5rem 0 0.5rem 1rem;
		color: var(--secondaryColor);
		font-style: italic;
	}
</style>
