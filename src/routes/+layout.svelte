<script lang="ts">
	import NavBar from "../lib/components/NavBar.svelte";
	import Button from "../lib/components/Button.svelte";
	import Tooltip from "../lib/components/Tooltip.svelte";
	import { page } from "$app/stores";
	import Modal from "../lib/components/Modal.svelte";
	import { onMount } from "svelte";
	import { customBackground } from "../lib/store";
	import { Email } from "../lib/Constants";
	import SocialIcons from "@rodneylab/svelte-social-icons";
	import { t, locale, locales } from "../i18n";

	let copied = false;
	const cookieEnabled = false;
	$: showCookieModal = false;

	interface CssVariables {
		[name: string]: string;
	}

	const cssVariables = (
		node: HTMLElement,
		variables: CssVariables
	): { update: (variables: CssVariables) => void } => {
		setCssVariables(node, variables);

		return {
			update(variables: CssVariables) {
				setCssVariables(node, variables);
			}
		};
	};

	const setCssVariables = (node: HTMLElement, variables: CssVariables): void => {
		for (const name in variables) {
			node.style.setProperty(`--${name}`, variables[name]);
		}
	};

	const copy = () => {
		navigator.clipboard.writeText(Email);
	};

	onMount(() => {
		const showCookie = localStorage.getItem("showCookieModal");
		if (showCookie !== null) showCookieModal = JSON.parse(showCookie);
		else showCookieModal = true;
	});

	// beforeNavigate(({ to }) => {
	// 	const pathName = to.pathname;
	// 	const route = routes.find((route) => pathName === route.href);
	// 	if (!route.customColor) {
	// 		customBackground.set('#3E7941');
	// 	} else customBackground.set(route.customColor);
	// });
</script>

<svelte:body use:cssVariables={{ background: $customBackground }} />

{#if showCookieModal && cookieEnabled}
	<div class="cookieContainer">
		<p>🍪 This website use <a href="privacy-policy">Cookies.</a></p>
		<div
			role="button"
			tabindex="0"
			on:keypress={() => {
				showCookieModal = false;
				localStorage.setItem("showCookieModal", "false");
			}}
			on:click={() => {
				showCookieModal = false;
				localStorage.setItem("showCookieModal", "false");
			}}
		>
			&#10005;
		</div>
	</div>
{/if}

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
<NavBar segment={$page.url.pathname} />

<slot />
<hr class="footerLine" />
<footer>
	<p>
		<select bind:value={$locale}>
			{#each locales as l}
				<option value={l}>{l}</option>
			{/each}
		</select>
	</p>
	<div class="socialNetworks">
		<a href="https://github.com/victorgois"
			><SocialIcons network="github" fgColor="#eeeeee" bgColor="transparent" />
		</a>
		<a href="mailto:victorgois18@gmail.com">
			<SocialIcons network="mailto" fgColor="#eeeeee" bgColor="transparent" />
		</a>
		<a href="https://medium.com/@victorgispacheco">
			<SocialIcons network="medium" fgColor="#eeeeee" bgColor="transparent" />
		</a>
		<a href="https://www.linkedin.com/in/victorgoisp/">
			<SocialIcons network="linkedin" fgColor="#eeeeee" bgColor="transparent" />
		</a>
	</div>
</footer>
<div class="signature">
	<div class="">
		{#if $locale === "en"}
			{$t("footer.paragraph1")}
			<a href="https://github.com/Ladvace/SvelteKit-Portfolio?tab=MIT-1-ov-file"
				>Gianmarco Ladvace's project</a
			>
			{$t("footer.paragraph2")}
		{/if}
		{#if $locale === "pt"}
			{$t("footer.paragraph1")}
			<a href="https://github.com/Ladvace/SvelteKit-Portfolio?tab=MIT-1-ov-file"
				>Gianmarco Ladvace</a
			>
			{$t("footer.paragraph2")}
		{/if}
	</div>
</div>

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
		width: 100vw;
		height: 100%;
		max-width: 800px;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	:global(html),
	:global(body) {
		transition: background-color 0.2s ease 0s;
		position: relative;
		width: 100%;
		height: 100%;
		overflow: auto;
		font-family: "Fira Code", monospace;
		background: rgb(2, 0, 36);
		background: linear-gradient(
			180deg,
			rgb(2, 1, 21) 0%,
			rgb(49, 49, 49) 54%,
			rgba(255, 255, 255, 0.4990371148459384) 100%
		);
	}

	:global(body) {
		background-color: var(--background);
		background-size: 200% 200%;
		color: white;
		margin: 0;
		box-sizing: border-box;
		display: grid;
		line-height: 1.75;
		place-items: center;
		height: 100%;
		overflow-x: hidden;
	}

	:global(h1) {
		border: 0;
	}

	:global(::selection) {
		color: white;
		background: #050424;
	}

	:global(::-webkit-scrollbar) {
		width: 8px;
		height: 8px;
		border-radius: 1px;
	}

	:global(::-webkit-scrollbar-thumb) {
		background-color: #fafffd;
		border-radius: 3px;
	}

	:global(::-webkit-scrollbar-track) {
		background-color: transparent;
		border-radius: 1px;
	}

	@media (min-width: 900px) {
		:global(body) {
			padding: 0 100px;
		}
	}

	:global(a) {
		text-decoration: none;
		color: rgb(200, 232, 16);
	}

	:global(a) {
		text-decoration: none;
		color: rgb(200, 232, 16);
	}

	a {
		color: rgb(200, 232, 16);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
		color: rgb(12, 255, 3);
	}

	a:visited {
		color: rgb(103, 246, 32);
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

	.cookieContainer {
		background: white;
		border-radius: 0px;
		text-align: center;
		width: 100%;
		height: 30px;
		color: black;
		padding: 30px;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		position: fixed;
		bottom: 0px;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
	}
	.cookieContainer > p > a {
		text-decoration: underline;
	}

	.cookieContainer > div {
		cursor: pointer;
	}

	.signature {
		font-size: 10px;
		font-weight: 400;
		max-width: 900px;
		text-align: center;
		width: 100%;
	}

	.signature a {
		text-decoration: none;
		color: #cfea11;
	}
	.signature .svelte {
		color: #cfea11;
	}

	.signature .me {
		color: #cfea11;
	}

	select {
		border-radius: 4px;
		cursor: pointer;
		width: 40px;
		height: 30px;
		font-size: medium;
		font-weight: 500;
		font-family: "Fira Code", monospace;
	}

	.socialNetworks {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
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
		flex-direction: row;
		justify-content: space-between;
		margin: 0 30px 0 30px;
	}

	footer p {
		margin: 1px;
		padding: 0.5em;
		font-size: small;
	}

	@media (min-width: 900px) {
		:global(.tooltip) {
			visibility: visible;
		}
	}
	@media (min-width: 600px) {
		.cookieContainer {
			background: white;
			border-radius: 50px;
			text-align: center;
			width: 350px;
			height: 30px;
			color: black;
			padding: 0 10px;
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			position: fixed;
			bottom: 50px;
			left: 0;
			right: 0;
			margin-left: auto;
			margin-right: auto;
		}
	}
</style>
