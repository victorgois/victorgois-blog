<script>
	import { t } from "../../i18n";
	import { translations } from "../../translations";
	const menuItems = [0, 1, 2, 3, 4];
</script>

<svelte:head>
	<title>Victor Góis — Projects</title>
</svelte:head>
<main>
	<div class="column">
		<div class="row">
			<div class="menuWrapper">
				<ul>
					{#each menuItems as item}
						<li class="button">{$t(`project.menu${item}`)}</li>
					{/each}
				</ul>
			</div>
			<div>
				{#each menuItems as item}
					<h1>{$t(`project.menu${item}`)}</h1>
				{/each}
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

	h1 {
		font-weight: 700;
		text-align: start;
		margin: 0 auto;
	}

	.button {
		padding: 10px 0 10px 0;
	}

	@media (min-width: 900px) {
		.button {
			max-width: 200px;
		}
	}
</style>
