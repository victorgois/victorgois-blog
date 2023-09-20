<script>
	// @ts-nocheck
	import { modalOpened } from "$lib/store";
	import { Canvas, Layer, t } from "svelte-canvas";

	$: render = ({ context, width, height }) => {
		context.fillStyle = `hsl(${$t / 40}, 100%, 50%)`;
		context.beginPath();
		// Set the fill style and draw a rectangle;
		context.fillRect(60, 20, 400, 500);
	};
	const handleClick = (e, context) => {
		render({ context });
		console.log('funciona');
	};
</script>

<svelte:head>
	<title>Victor Góis</title>
</svelte:head>
<main>
	<div class="column">
		<div class="row">
			<h2 class="presentation">Hi! <br /> I'm Victor, a Journalist Engineer, based in brazil</h2>
			<Canvas
				width={350}
				height={350}
				layerEvents={true}
				style="cursor: pointer"
				on:click={handleClick}
			>
				<Layer {render} />
			</Canvas>
		</div>
		<div class="row" />
	</div>
</main>

<style>
	a {
		color: white;
		text-decoration: none;
	}
	main {
		text-align: center;
		padding: 0;
		margin: 0 auto;
		text-align: center;

		display: flex;
		flex-direction: column;
		height: calc(100vh - 80px - 88px);
		justify-content: center;
		align-items: center;
	}

	.column {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: flex;
		flex-direction: row;
	}

	h2 {
		font-weight: 700;
		text-align: start;
		width: 50%;
	}

	.selfImage {
		width: 50%;
		height: 250px;
	}

	.icons {
		display: flex !important;
		align-items: center;
		gap: 20px;
		cursor: pointer;
		justify-content: space-between;
	}

	.icon {
		cursor: pointer;
		transition: color 0.2s ease-in-out;
		width: 40px;
	}
	.icon:hover {
		color: #050424;
	}

	@media (max-width: 900px) {
		main {
			margin-left: 4rem;
		}
	}

	@media (min-width: 600px) {
		main {
			max-width: none;
		}
	}
</style>
