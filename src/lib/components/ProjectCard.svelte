<script>
	import { onMount } from "svelte";
	export let project;

	/**
	 * @type {Element}
	 */
	let videoRef;
	/**
	 * @type {IntersectionObserver}
	 */
	let observer;

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (videoRef instanceof HTMLVideoElement) {
							videoRef.src = project.videoUrl;
						}
						observer.unobserve(videoRef);
					}
				});
			},
			{ rootMargin: "100px" }
		);

		observer.observe(videoRef);

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});

	console.log(project);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="project-card"
	on:mouseenter={() => {
		if (videoRef instanceof HTMLVideoElement) {
			videoRef.play();
		}
	}}
	on:mouseleave={() => {
		if (videoRef instanceof HTMLVideoElement) {
			videoRef.pause();
			videoRef.currentTime = 0;
		}
	}}
	on:click={() => window.open(project.link, "_blank")}
	on:keydown={(e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			window.open(project.link, "_blank");
		}
	}}
>
	<video
		bind:this={videoRef}
		preload="metadata"
		muted
		loop
		playsinline
		poster={`/${project.poster}`}
	>
		<source src={`/${project.videoUrl}`} type="video/mp4" />
		<track kind="captions" />
	</video>
	<h3>{project.title}</h3>
	<p>{project.description}</p>
</div>

<style>
	.project-card {
		width: 30%;
		padding: 8px;
		border: none;
		cursor: pointer;
		transition: transform 0.2s ease-in-out;
		position: relative;
		aspect-ratio: 16 / 9;
	}

	.project-card:hover {
		transform: scale(1.05);
	}

	video {
		width: 100%;
		height: auto;
		border-radius: 4px;
	}

	h3 {
		margin-top: 12px;
		margin-bottom: 8px;
		color: var(--mainColor);
	}

	p {
		color: var(--secondaryColor);
		font-size: 14px;
	}

	@media (max-width: 900px) {
		.project-card {
			width: 100%;
			margin-bottom: 20px;
		}
	}
</style>
