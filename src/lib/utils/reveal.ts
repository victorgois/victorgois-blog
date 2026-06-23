import type { Action } from "svelte/action";

interface RevealOptions {
	transition?: "fade" | "fly";
	threshold?: number;
	duration?: number;
}

/**
 * Reveal-on-scroll action. Lightweight replacement for the (sunset)
 * `svelte-reveal` package, built on IntersectionObserver.
 *
 * Usage: `use:reveal` (fly up) or `use:reveal={{ transition: "fade" }}`.
 * Actions only run in the browser, so SSR renders the content visible and
 * it stays visible if JavaScript is disabled.
 */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (
	node,
	options
) => {
	const { transition = "fly", threshold = 0.2, duration = 600 } =
		options ?? {};

	const hiddenTransform = transition === "fade" ? "none" : "translateY(20px)";

	node.style.opacity = "0";
	node.style.transform = hiddenTransform;
	node.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
	node.style.willChange = "opacity, transform";

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					node.style.opacity = "1";
					node.style.transform = "none";
					observer.unobserve(node);
				}
			});
		},
		{ threshold }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
