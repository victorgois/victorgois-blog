<script lang="ts">
	import { fade } from "svelte/transition";
	import BaseTheme from "../../../lib/components/blog/themes/BaseTheme.svelte";

	export let data;
</script>

<div class="container" in:fade>
	<BaseTheme post={data.post} />
</div>

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 20px;
	}
</style>
