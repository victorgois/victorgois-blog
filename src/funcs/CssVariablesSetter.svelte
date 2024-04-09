<script lang="ts">
	import { onMount } from "svelte";

	export let variables = {};

	onMount(() => {
		setCssVariables(variables);
	});

	function setCssVariables(variables: any) {
		const root = document.documentElement;
		for (const name in variables) {
			root.style.setProperty(`--${name}`, variables[name]);
		}
	}
</script>
