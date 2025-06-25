<script>
	import { t, locale, locales } from "../../i18n";
</script>

<select bind:value={$locale}>
	{#each locales as l}
		<option value={l}>{l}</option>
	{/each}
</select>

<style>
	select {
		cursor: pointer;
		width: 45px;
		height: fit-content;
		font-size: medium;
		font-weight: 500;
		font-family: "Fira Code", monospace;
		background: transparent;
		border: none;
		color: var(--mainColor);
	}
</style>
