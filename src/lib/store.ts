import { writable } from "svelte/store";

export const visualizations = [
  { title: "Como funciona o ChatGPT?", slug: "como-funciona-chatgpt" },
];

export const defaultTheme = {
  backgroundColor: 'white',
  mainColor: 'black',
  secondaryColor: 'gray',
  visitedColor: "rgb(200, 232, 16)",
  fontFamily: "Fira Code, monospace",
}

export const visualizationTheme = {
  backgroundColor: '#9bd7cb',
  mainColor: 'black',
  secondaryColor: 'tomato',
  visitedColor: "orange",
  fontFamily: "Playfair Display, serif",
};

export const modalOpened = writable(false);

export const customBackground = writable(defaultTheme.backgroundColor);

export const customColor = writable(defaultTheme.mainColor);

export const customFontFamily = writable(defaultTheme.fontFamily);

export const customVisitedColor = writable(defaultTheme.visitedColor)

export const customSecondaryColor = writable(defaultTheme.secondaryColor)

export const navbarOpened = writable(false);

export const selectedTechStore = writable("");
