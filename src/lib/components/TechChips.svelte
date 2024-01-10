<script>
	/**
	 * @type {any[]}
	 */
	export let techList = [];

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();
	/**
	 * @type {any[]}
	 */
	let visibleChips = [];

	/**
	 * @param {any} tech
	 */
	function handleChipClick(tech) {
		dispatch("chipclick", { tech });
	}

	techList.forEach(() => {
		visibleChips.push(false);
	});
</script>

<div class="tech-chips">
	{#each techList as tech, index (tech)}
		<div
			class="tech-chip"
			class:visible={visibleChips[index]}
			style="animation-delay: {index * 0.3}s;"
			on:animationend={() => (visibleChips[index] = true)}
			on:click={() => handleChipClick(tech)}
			role="button"
			tabindex="0"
			on:keydown={(event) => {
				if (event.key === "Enter") {
					handleChipClick(tech);
				}
			}}
		>
			{tech}
		</div>
	{/each}
</div>

<style>
	.tech-chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: right;
		padding-top: 1.5em;
	}

	.tech-chip {
		padding: 0.5rem 1rem;
		margin: 0.5rem 1rem 0.5rem 0rem;
		background: linear-gradient(to right, #dbf800, #aabc27);
		color: black;
		border: none;
		border-radius: 5px;
		opacity: 0;
		animation: fadeIn 0.5s ease-in;
		transition: transform 0.2s ease-in;
		cursor: pointer;
	}

	.tech-chip.visible {
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
