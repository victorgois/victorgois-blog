<script>
	/**
	 * Content of the text card
	 * @type {string}
	 */
	export let content;
</script>

<div class="text-card">
	{content}
</div>

<style>
	.text-card {
		color: black;
		background-color: white;
		box-shadow: 5px 5px #888888;
		padding: 10px;
		margin: 10px;
		font-size: large;
		font-weight: 300;
		font-family: Georgia, serif;
		width: 50%;
		height: min-content;
	}
</style>
