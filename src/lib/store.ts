import { writable } from "svelte/store";
import { browser } from "$app/environment";

interface Theme {
	backgroundColor: string;
	mainColor: string;
	secondaryColor: string;
	visitedColor: string;
	fontFamily: string;
}

export const defaultTheme: Theme = {
	backgroundColor: "white",
	mainColor: "black",
	secondaryColor: "gray",
	visitedColor: "tomato",
	fontFamily: "Fira Code, monospace"
};

export const darkTheme: Theme = {
	backgroundColor: "#1a1a1a",
	mainColor: "white",
	secondaryColor: "darkgray",
	visitedColor: "rgb(200, 232, 16)",
	fontFamily: "Fira Code, monospace"
};

export const visualizationTheme: Theme = {
	backgroundColor: "#9bd7cb",
	mainColor: "black",
	secondaryColor: "tomato",
	visitedColor: "orange",
	fontFamily: "Playfair Display, serif"
};

export const themes: { [key: string]; theme: value } = {
	darkTheme: darkTheme,
	defaultTheme: defaultTheme
};

// Assinando mudanças no tema selecionado para salvar nos cookies
function setThemeCookie(theme: string) {
	if (typeof document !== "undefined") {
		document.cookie = `selectedTheme=${theme}`;
	}
}

function getThemeFromCookie(): string | null {
	if (typeof document !== "undefined") {
		const cookies = document.cookie.split(";").map((cookie) => cookie.trim().split("="));

		const selectedThemeCookie = cookies.find((cookie) => cookie[0] === "selectedTheme");

		return selectedThemeCookie ? selectedThemeCookie[1] : null;
	}
	return null;
}
// Obter o tema inicial do cookie ou usar o tema padrão
const initialTheme = getThemeFromCookie() || "defaultTheme";

// Criar o store para o tema selecionado
export const selectedTheme = writable(initialTheme);

selectedTheme.subscribe((theme) => {
	setThemeCookie(theme);
});

// Criando o store para o tema selecionado

export const visualizations = [
	{ title: "Como funciona o ChatGPT?", slug: "como-funciona-chatgpt" }
];

export const modalOpened = writable(false);

export const customBackground = writable(selectedTheme.backgroundColor);
export const customColor = writable(selectedTheme.mainColor);
export const customFontFamily = writable(selectedTheme.fontFamily);
export const customVisitedColor = writable(selectedTheme.visitedColor);
export const customSecondaryColor = writable(selectedTheme.secondaryColor);

// Funções para atualizar os temas personalizados
export function setCustomBackground(color) {
	customBackground.set(color);
}

export function setCustomColor(color) {
	customColor.set(color);
}

export function setCustomFontFamily(font) {
	customFontFamily.set(font);
}

export function setCustomVisitedColor(color) {
	customVisitedColor.set(color);
}

export function setCustomSecondaryColor(color) {
	customSecondaryColor.set(color);
}

export const navbarOpened = writable(false);
export const selectedTechStore = writable("");
