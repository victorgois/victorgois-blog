<script>
	import { locale, t } from "../../i18n";
</script>

<svelte:head>
	<title>VictorGóis — Projects</title>
</svelte:head>
<main>
	<div class="column">
		<div class="row">
			<div class="menuWrapper">
				<ul>
					<li class="button">{$t("project.menu1")}</li>
					<li class="button">{$t("project.menu2")}</li>
					<li class="button">{$t("project.menu3")}</li>
					<li class="button">{$t("project.menu4")}</li>
					<li class="button">{$t("project.menu5")}</li>
				</ul>
			</div>
			<div>
				<h1>{$t("project.menu1")}</h1>
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
