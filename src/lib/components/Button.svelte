<script>
	import { Email } from '$lib/Constants';

	const openMail = () => {
		window.location.href = `mailto:${Email}`;
	};
</script>

<div
	class="button"
	role="button"
	tabindex="0"
	on:keypress={openMail}
	on:click={openMail}
>
	<slot />
</div>

<style>
	.button {
		cursor: pointer;
		height: 40px;
		max-width: 200px;
		border-radius: 10px;
		background: #050424;

		background-size: 150% 150%;

		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 500;
	}

	.button:hover {
		animation: gradient 2s ease infinite;
	}
</style>
