<script lang="ts">
	import Burger from "./Hamburger.svelte";
	import ThemeSwitcher from "./ThemeSwitcher.svelte";
	import routes from "../NavRoutes";
	import { t } from "../../i18n";
	import LanguageSelector from "./LanguageSelector.svelte";

	let opened = false;
	export let segment: string;
</script>

<div class={opened ? "NavBar open" : "NavBar"}>
	<div class="innerContainer">
		<div class="burger">
			<Burger bind:open={opened} />
		</div>
		<div class="buttons">
			{#each routes as route}
				<a class={`button ${segment === route.href ? "selected" : ""}`} href={route.href}
					>{$t(`${route.label}`)}</a
				>
			{/each}
		</div>
		<div class="top-right-navbar">
			<ThemeSwitcher />
			<p class="translateButton">
				<LanguageSelector />
			</p>
		</div>
	</div>
	<div class="responsiveButtons buttons">
		{#each routes as route}
			<a class={`button ${segment === route.href ? "selected" : ""}`} href={route.href}
				>{$t(`${route.label}`)}
			</a>
			<hr />
		{/each}
	</div>
</div>

<style>
	:global(.logo) {
		cursor: pointer;
		height: 30px;
		width: 30px;
	}

	.open {
		flex-direction: column !important;
		align-items: center !important;
		height: 330px !important;
		transition: height 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
	}

	.selected {
		position: relative;
	}

	.button:hover::after {
		content: "";
		background: var(--color);
		display: block;
		height: 3px;
		width: 100%;
		position: absolute;
		bottom: 0;
	}

	.button.selected:after {
		content: "";
		color: var(--color);
		background: white;
		display: block;
		height: 3px;
		width: 100%;
		position: absolute;
		bottom: 0;
	}

	hr {
		width: 100%;
		height: 1px;
		background: var(--color);
	}

	.innerContainer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		max-width: 700px;
		box-sizing: border-box;
	}

	.innerContainer :global(a) {
		height: 30px;
	}

	.translateButton {
		margin: 1em;
	}

	.NavBar {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 10px;
		max-width: 900px;
		box-sizing: border-box;
		padding: 20px;
		height: 80px;
		overflow: hidden;
		transition: height 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
	}

	.buttons {
		display: none;
		justify-content: space-between;
		align-items: center;
		font-weight: 500;
	}

	.responsiveButtons {
		justify-content: center;
		max-width: 700px;
		margin-top: 20px;
		width: 100%;
		display: flex !important;
		flex-direction: column;
		align-items: flex-start;
	}

	.responsiveButtons .button {
		max-width: 100px;
		width: 100%;
		text-align: start;
	}

	.buttons .button {
		padding: 0;
		cursor: pointer;
		transition: color 0.2s ease-in-out;
		text-decoration: none;
		position: relative;
		margin: 10px;
		color: var(--color);
	}

	.button.selected {
		color: var(--visitedColor);
	}

	.burger :global(button) {
		margin: 0;
	}

	.top-right-navbar {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	@media (min-width: 900px) {
		.NavBar {
			padding: 20px 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			max-width: 900px;
			width: 90%;
			margin: 0 auto;
		}

		.buttons {
			display: flex;
		}

		.NavBar .burger {
			display: none !important;
		}
		.responsiveButtons {
			display: none !important;
		}
	}
</style>
