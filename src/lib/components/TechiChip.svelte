<script>
	/**
	 * @type {any}
	 */
	export let tech;
	let visible = false;
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	function handleChipClick() {
		visible = true;
		dispatch("chipclick", { tech });
	}
</script>

<div
	class="tech-chip {visible ? 'visible' : ''}"
	style="animation-delay: {0.3}s;"
	on:click={handleChipClick}
	role="button"
	tabindex="0"
	on:keydown={(event) => {
		if (event.key === "Enter") {
			handleChipClick();
		}
	}}
>
	{tech}
</div>

<style>
	.tech-chip {
		padding: 0.5rem 1rem;
		margin: 0.5rem 1rem 0.5rem 0rem;
		background: linear-gradient to right, #007bff, #00bcd4;
		color: white;
		border: none;
		border-radius: 5px;
		opacity: 0;
		animation: fadeIn 0.5s ease-in;
		transition: transform 0.2s ease-in;
		cursor: pointer;
	}

	.visible {
		opacity: 1;
	}

	.tech-chip:hover {
		transform: scale(1.05);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
