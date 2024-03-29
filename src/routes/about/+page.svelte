<script>
	import skills from "$lib/Skills";
	import Timeline from "$lib/components/Timeline.svelte";
	import { reveal } from "svelte-reveal";
	import { t, locale } from "../../i18n";
</script>

<svelte:head>
	<title>Victor Góis — About</title>
</svelte:head>

<div class="container">
	<main>
		<h1 class="title">About</h1>
		<div class="infographic" use:reveal>
			<h1>{$t("homepage.infographic")}</h1>
			<Timeline />
		</div>
		<p class="footnote" use:reveal={{ transition: "fade" }}>
			{$t("homepage.footnote")}
		</p>
	</main>
</div>

<style>
	.container {
		max-width: 900px;
		padding: 0;
		display: flex;
		justify-content: center;
	}

	main {
		max-width: 100%;
		min-height: 500px;
		text-align: left;
		margin: 0 auto;
		box-sizing: border-box;
	}

	h1 {
		font-weight: 700;
		margin: 0 0 50px 0;
		font-size: 36px;
		text-align: start;
	}

	h2 {
		margin-top: 50px;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 30px;
	}

	.infographic {
		text-align: center;
	}

	@media (min-width: 900px) {
		.list {
			flex-direction: row;
		}
		main > h1 {
			font-size: 48px;
		}
	}
</style>
