<script>
	/**
	 * Content of the text card
	 * @type {string}
	 */
	export let content;
	/**
	 * Content of the text card
	 * @type {string}
	 */
	export let id;
</script>

<div class="text-card" {id}>
	{content}
</div>

<style>
	.text-card {
		color: black;
		background-color: white;
		box-shadow: 5px 5px #888888;
		padding: 20px;
		margin: 10px;
		font-size: large;
		font-weight: 300;
		font-family: Georgia, serif;
		max-width: 300px;
		height: min-content;
		position: relative;
	}
</style>
