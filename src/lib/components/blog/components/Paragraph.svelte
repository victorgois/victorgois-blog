<script lang="ts">
	export let content: string;
	export let style: string | undefined = undefined;
</script>

<p class={style}>
	{content}
</p>

<style>
	p {
		line-height: 1.6;
		margin: 1rem 0;
		color: var(--mainColor);
	}
</style>
