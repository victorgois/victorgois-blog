<script>
	import { onMount } from "svelte";

	let progress = 0;

	onMount(() => {
		document.body.addEventListener("scroll", () => {
			setTimeout(() => {
				const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
				const windowHeight = window.innerHeight;
				const documentHeight = document.body.scrollHeight;

				const docHeight = Math.max(
					documentHeight,
					document.body.scrollHeight,
					document.documentElement.clientHeight,
					document.documentElement.scrollHeight
				);
				const windowHeightAdjusted = docHeight - windowHeight;
				if (scrollTop === 0) {
					progress = 0;
				} else {
					progress = (scrollTop / windowHeightAdjusted) * 100;
				}
			});
		});
	});
</script>

<div class="progress-bar">
	<div class="progress" style="width: {progress}%; " />
</div>

<style>
	.progress-bar {
		width: 100%;
		height: 5px;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		background-color: #eaeaea;
		opacity: 1;
	}

	.progress {
		height: 100%;
		background-color: var(--secondaryColor);
		transition: width 0.3s;
	}
</style>
