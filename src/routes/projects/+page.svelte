<script>
	import { t } from "../../i18n";
	const menuItems = [0, 1, 2, 3, 4];
	const menuContent = [
		"Descrição da visão geral",
		"Descrição dos projetos de software",
		"Lista de trabalhos acadêmicos",
		"Lista dos posts do blog dev.to",
		"Lista dos posts do blog medium"
	];

	/**
	 * @type {number | null}
	 */
	let selectedMenuItem = null;

	const handleClick = (/** @type {number} */ item) => {
		selectedMenuItem = item;
	};
</script>

<svelte:head>
	<title>Victor Góis — Projects</title>
</svelte:head>
<main>
	<div class="column">
		<div class="row">
			<div class="menuWrapper">
				<ul>
					{#each menuItems as item, index (item)}
						<li>
							<button style="animation-delay: {index * 0.3}s;" on:click={() => handleClick(item)}>
								{$t(`project.menu${item}`)}</button
							>
						</li>
					{/each}
				</ul>
			</div>
			<div>
				{#if selectedMenuItem !== null}
					<div class="content">
						<p>{menuContent[selectedMenuItem]}</p>
					</div>
				{/if}
				<p class="note">
					Note: most of my projects are under NDA so I am unable to share those projects. If there
					is anything you would like to see further, please feel free to contact me.
				</p>
			</div>
		</div>
	</div>
</main>

<style>
	.note {
		opacity: 0.5;
		margin: 0;
		max-width: 900px;
		text-align: left;
	}

	main {
		padding: 0;
		text-align: start;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.column {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 700px;
	}

	.row {
		display: flex;
		flex-direction: row;
	}

	.menuWrapper {
		display: flex;
		width: 100%;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	button {
		font-weight: 700;
		text-align: start;
		margin: 0 auto;
		cursor: pointer;
	}
</style>
