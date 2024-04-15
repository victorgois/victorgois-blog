<script lang="ts">
	import NavBar from "$lib/components/NavBar.svelte";
	import Button from "$lib/components/Button.svelte";
	import Tooltip from "$lib/components/Tooltip.svelte";
	import { page } from "$app/stores";
	import Modal from "$lib/components/Modal.svelte";
	import { onDestroy, onMount } from "svelte";
	import {
		visualizationTheme,
		defaultTheme,
		themes,
		setCustomBackground,
		setCustomSecondaryColor,
		customBackground,
		customColor,
		customFontFamily,
		customVisitedColor,
		customSecondaryColor,
		selectedTheme,
		setCustomColor,
		setCustomFontFamily,
		setCustomVisitedColor
	} from "$lib/store";
	import { Email } from "$lib/Constants";
	import SocialIcons from "@rodneylab/svelte-social-icons";
	import { t, locale } from "../i18n";
	import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";
	import LanguageSelector from "$lib/components/LanguageSelector.svelte";
	import CssVariablesSetter from "../funcs/CssVariablesSetter.svelte";
	let copied = false;

	$: {
		if ($page.url.pathname === "/projects/visualizations/como-funciona-chatgpt") {
			setCustomBackground(visualizationTheme.backgroundColor);
			setCustomSecondaryColor(visualizationTheme.secondaryColor);
		} else {
			setCustomBackground(defaultTheme.backgroundColor);
		}
	}

	// Função para atualizar as variáveis de tema
	function updateThemeVariables(themeName: string) {
		// Obter o objeto de tema correspondente ao nome do tema
		const theme = themes[themeName];

		// Verificar se o tema existe
		if (theme) {
			// Atualizar as propriedades personalizadas do tema
			setCustomBackground(theme.backgroundColor);
			setCustomColor(theme.mainColor);
			setCustomFontFamily(theme.fontFamily);
			setCustomVisitedColor(theme.visitedColor);
			setCustomSecondaryColor(theme.secondaryColor);

			// Atualizar as variáveis CSS do documento
			document.documentElement.style.setProperty("--backgroundColor", theme.backgroundColor);
			document.documentElement.style.setProperty("--mainColor", theme.mainColor);
			document.documentElement.style.setProperty("--fontFamily", theme.fontFamily);
			document.documentElement.style.setProperty("--visitedColor", theme.visitedColor);
			document.documentElement.style.setProperty("--secondaryColor", theme.secondaryColor);
		} else {
			console.error(`Tema "${themeName}" não encontrado.`);
		}
	}

	let subscribeSelectedTheme: { (): void; unsubscribe?: any };

	onMount(() => {
		subscribeSelectedTheme = selectedTheme.subscribe((value) => {
			if (value) {
				updateThemeVariables(value);
			}
		});
	});

	/* 	interface CssVariables {
		[name: string]: string;
	}

	const cssVariables = (
		node: HTMLElement,
		variables: CssVariables
	): { update: (variables: CssVariables) => void } => {
		const clonedVariables = { ...variables }; // Clonando o objeto
		setCssVariables(node, clonedVariables);
		console.log(clonedVariables);

		return {
			update(variables: CssVariables) {
				setCssVariables(node, variables);
			}
		};
	};

	const setCssVariables = (node: HTMLElement, variables: CssVariables): void => {
		console.log(variables);

		for (const name in variables) {
			node.style.setProperty(`--${name}`, variables[name]);
		}
	}; */

	const copy = () => {
		navigator.clipboard.writeText(Email);
	};
</script>

<CssVariablesSetter
	variables={{
		backgroundColor: $customBackground,
		mainColor: $customColor,
		visitedColor: $customVisitedColor,
		fontFamily: $customFontFamily,
		secondaryColor: $customSecondaryColor
	}}
/>

<svelte:body />

<Modal>
	<div slot="content" class="modalContainer">
		<h1>Email:</h1>
		<div>
			<p>{Email}</p>
			&nbsp;
			<div class="tooltip">
				<Tooltip tooltip={copied ? "Copied" : "Copy"}>
					<div
						id="clipboard"
						role="button"
						tabindex="0"
						on:keypress={() => {
							copied = true;
							copy();
							setTimeout(() => {
								copied = false;
							}, 500);
						}}
						on:click={() => {
							copied = true;
							copy();
							setTimeout(() => {
								copied = false;
							}, 500);
						}}
					/>
				</Tooltip>
			</div>
		</div>
		<Button>Send Email</Button>
	</div>
</Modal>

{#if $page.url.pathname === "/projects/visualizations/como-funciona-chatgpt"}
	<slot />
{:else}
	<NavBar segment={$page.url.pathname} />

	<slot />
	<hr class="footerLine" />
	<footer>
		<div class="footer-row">
			<div class="footer-column">
				<ThemeSwitcher />
				<p class="translateButton">
					<LanguageSelector />
				</p>
			</div>
			<div class="socialNetworks">
				<a href="https://github.com/victorgois"
					><SocialIcons
						network="github"
						fgColor="black"
						bgColor="transparent"
						style="opacity: 0.5"
					/>
				</a>
				<a href="mailto:victorgois18@gmail.com">
					<SocialIcons
						network="mailto"
						fgColor="black"
						bgColor="transparent"
						style="opacity: 0.5"
					/>
				</a>
				<a href="https://medium.com/@victorgispacheco">
					<SocialIcons
						network="medium"
						fgColor="black"
						bgColor="transparent"
						style="opacity: 0.5"
					/>
				</a>
				<a href="https://www.linkedin.com/in/victorgoisp/">
					<SocialIcons
						network="linkedin"
						fgColor="black"
						bgColor="transparent"
						style="opacity: 0.5"
					/>
				</a>
			</div>
		</div>
		<div class="signature">
			<div>
				{#if $locale === "en"}
					{$t("footer.paragraph1")}
					<a href="https://github.com/Ladvace/SvelteKit-Portfolio?tab=MIT-1-ov-file"
						>Ladvace's project</a
					>
					{$t("footer.paragraph2")}
				{/if}
				{#if $locale === "pt"}
					{$t("footer.paragraph1")}
					<a href="https://github.com/Ladvace/SvelteKit-Portfolio?tab=MIT-1-ov-file">Ladvace</a>
					{$t("footer.paragraph2")}
				{/if}
			</div>
		</div>
	</footer>
{/if}

<style>
	* {
		box-sizing: border-box;
	}

	@font-face {
		font-family: "DM Serif Display", sans-serif;
		font-display: optional;
		src: url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap");
	}

	@font-face {
		font-family: "Fira Code", monospace;
		font-display: optional;
		src: url("https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap");
	}

	@font-face {
		font-family: "Lato", sans-serif;
		font-display: optional;
		src: url("https://fonts.googleapis.com/css2?family=Lato:wght@300;400;500;600;700&display=swap");
	}

	@font-face {
		font-family: "Epilogue", sans-serif;
		font-display: optional;
		src: url("https://fonts.googleapis.com/css2?family=Epilogue:wght@300;400;500;600;700&display=swap");
	}

	:global(#svelte) {
		width: 100%;
		height: 100%;
		max-width: 180vw;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	:global(body) {
		transition: background-color 0.2s ease 0s;
		background-color: var(--backgroundColor);
		background-size: 200% 200%;
		color: var(--mainColor);
		margin: 0;
		position: relative;
		width: 100%;
		box-sizing: border-box;
		display: grid;
		line-height: 1.75;
		place-items: center;
		height: 100%;
		overflow-x: hidden;
		font-family: var(--fontFamily);
	}

	:global(h1) {
		border: 0;
	}

	:global(::selection) {
		color: var(--mainColor);
		background: var(--backgroundColor);
	}

	:global(::-webkit-scrollbar) {
		width: 8px;
		height: 8px;
		border-radius: 1px;
	}

	:global(::-webkit-scrollbar-thumb) {
		background-color: var(--backgroundColor);
		border-radius: 3px;
	}

	:global(::-webkit-scrollbar-track) {
		background-color: transparent;
		border-radius: 1px;
	}

	@media (min-width: 900px) {
		/* :global(body) {
			padding: 0 100px;
		} */
	}

	:global(a) {
		text-decoration: none;
		color: var(--visitedColor);
	}

	:global(a) {
		text-decoration: none;
		color: var(--visitedColor);
	}

	a {
		color: var(--visitedColor);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
		color: var(--visitedColor);
	}

	a:visited {
		color: var(--visitedColor);
	}

	.modalContainer div {
		display: flex;
		margin-bottom: 20px;
	}

	.modalContainer p {
		margin: 0;
	}

	:global(.tooltip) {
		visibility: hidden;
	}

	.signature {
		font-size: 10px;
		font-weight: 400;
		text-align: center;
		width: 100%;
		margin: 1rem 0 1rem 0;
	}

	.signature a {
		text-decoration: none;
		color: var(--secondaryColor);
	}

	.socialNetworks {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.socialNetworks a {
		padding: 0.1rem;
	}

	.footerLine {
		display: block;
		height: 1px;
		opacity: 50%;
		border: 0;
		border-top: 1px solid #ccc;
		margin: 1em 0;
		padding: 0;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: 0 30px 0 30px;
		align-items: center;
	}

	.footer-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		max-width: 700px;
		width: 100%;
	}

	.footer-column {
		margin: 1px;
		padding: 0.5em;
		font-size: small;
		display: flex;
		align-items: center;
	}

	.translateButton {
		margin: 1em;
	}

	@media (min-width: 900px) {
		:global(.tooltip) {
			visibility: visible;
		}
	}
</style>
