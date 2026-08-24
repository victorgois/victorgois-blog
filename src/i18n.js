import { browser } from "$app/environment";
import { derived, writable } from "svelte/store";
import { translations } from "./translations";

/** Idioma do HTML renderizado no servidor, e o que sobra se o navegador pedir um que não temos. */
const fallbackLocale = "en";

/**
 * O idioma do navegador, quando ele for um dos que o site tem.
 *
 * `navigator.languages` já vem na ordem de preferência do usuário, e só nos
 * interessa a parte antes do hífen — `pt-BR`, `pt-PT` e `pt` são todos `pt`.
 *
 * @returns {string}
 */
function detectLocale() {
	if (!browser) return fallbackLocale;

	const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];

	for (const tag of preferred) {
		const base = tag?.toLowerCase().split("-")[0];
		if (base && base in translations) return base;
	}

	return fallbackLocale;
}

export const locale = writable(fallbackLocale);
export const locales = Object.keys(translations);

/**
 * Aplica o idioma do navegador. Roda no `onMount` do layout raiz — e não na
 * criação da store — para que a primeira renderização no cliente seja igual à
 * do servidor, que não tem `navigator`. Depois disso, quem manda é o seletor.
 */
export function useBrowserLocale() {
	locale.set(detectLocale());
}

/**
 * @param {string} locale
 * @param {string | number} key
 * @param {object} vars
 */
function translate(locale, key, vars) {
	// Let's throw some errors if we're trying to use keys/locales that don't exist.
	// We could improve this by using Typescript and/or fallback values.
	if (!key) throw new Error("no key provided to $t()");
	if (!locale) throw new Error(`no translation for key "${key}"`);

	// Grab the translation from the translations object.
	// @ts-ignore
	let text = translations[locale][key];

	if (!text) throw new Error(`no translation found for ${locale}.${key}`);

	// Replace any passed in variables in the translation string.
	Object.keys(vars).map((k) => {
		const regex = new RegExp(`{{${k}}}`, "g");
		// @ts-ignore
		text = text.replace(regex, vars[k]);
	});

	return text;
}

export const t = derived(
	locale,
	($locale) =>
		(/** @type {string | number} */ key, vars = {}) =>
			translate($locale, key, vars)
);
