<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from "svelte";
	import type * as THREE_NS from "three";
	import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
	import type { Fingering, InstrumentId, InstrumentModel } from "../../instruments/types";

	export let instrument: InstrumentId = "trumpet";
	export let explode = 0;
	export let autoRotate = false;
	export let selectedPart: string | null = null;
	/** Peça que a câmera deve enquadrar. Dirigida pela narrativa. */
	export let focus: string | null = null;
	export let fingering: Fingering | null = null;
	/** Permite clicar nas peças do modelo para selecioná-las. */
	export let pickable = true;

	const dispatch = createEventDispatcher<{ select: string | null; ready: void; error: string }>();

	let container: HTMLDivElement;
	let THREE: typeof THREE_NS;
	let renderer: THREE_NS.WebGLRenderer;
	let scene: THREE_NS.Scene;
	let camera: THREE_NS.PerspectiveCamera;
	let controls: OrbitControls;
	let model: InstrumentModel | null = null;
	let builders: Record<InstrumentId, () => InstrumentModel>;
	let frame = 0;
	let lastFrameTime = 0;
	let raycaster: THREE_NS.Raycaster;
	let pointer: THREE_NS.Vector2;
	let resizeObserver: ResizeObserver;
	let visibilityObserver: IntersectionObserver;
	let hovered: string | null = null;
	let ready = false;
	let failed = false;
	let onScreen = true;

	/** Enquadramento desejado, perseguido suavemente a cada frame. */
	let desiredTarget: THREE_NS.Vector3;
	let desiredDistance = 100;
	let framingActive = false;

	/** Materiais realçados, criados sob demanda e reaproveitados. */
	const highlightCache = new Map<THREE_NS.Material, THREE_NS.Material>();
	const originalMaterials = new Map<THREE_NS.Mesh, THREE_NS.Material | THREE_NS.Material[]>();

	onMount(async () => {
		try {
			const [three, orbit, room, trumpet, sax, trombone] = await Promise.all([
				import("three"),
				import("three/examples/jsm/controls/OrbitControls.js"),
				import("three/examples/jsm/environments/RoomEnvironment.js"),
				import("../../instruments/trumpet"),
				import("../../instruments/saxophone"),
				import("../../instruments/trombone")
			]);

			THREE = three;
			builders = {
				trumpet: trumpet.buildTrumpet,
				saxophone: sax.buildSaxophone,
				trombone: trombone.buildTrombone
			};

			renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true,
				powerPreference: "high-performance"
			});
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 1.05;
			container.appendChild(renderer.domElement);

			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera(38, 1, 1, 4000);
			desiredTarget = new THREE.Vector3();

			// Sem environment map, metal com metalness 1 renderiza quase preto.
			const pmrem = new THREE.PMREMGenerator(renderer);
			scene.environment = pmrem.fromScene(new room.RoomEnvironment(), 0.04).texture;
			pmrem.dispose();

			const key = new THREE.DirectionalLight(0xffffff, 2.4);
			key.position.set(1, 1.4, 1.2);
			scene.add(key);
			const rimLight = new THREE.DirectionalLight(0xbfd4ff, 1.1);
			rimLight.position.set(-1.2, 0.4, -1);
			scene.add(rimLight);
			scene.add(new THREE.AmbientLight(0xffffff, 0.35));

			controls = new orbit.OrbitControls(camera, renderer.domElement);
			controls.enableDamping = true;
			controls.dampingFactor = 0.08;
			controls.enablePan = false;
			controls.autoRotateSpeed = 1.1;
			controls.minPolarAngle = 0.15;
			controls.maxPolarAngle = Math.PI - 0.15;
			// Assim que o usuário encosta no modelo, ele manda: o enquadramento
			// automático solta o controle até a próxima mudança de passo.
			controls.addEventListener("start", () => (framingActive = false));

			raycaster = new THREE.Raycaster();
			pointer = new THREE.Vector2();

			loadInstrument(instrument);

			resizeObserver = new ResizeObserver(resize);
			resizeObserver.observe(container);
			resize();

			// Dois viewers convivem na página; o que está fora da tela para de
			// renderizar.
			visibilityObserver = new IntersectionObserver(
				([entry]) => (onScreen = entry.isIntersecting),
				{ rootMargin: "120px" }
			);
			visibilityObserver.observe(container);

			ready = true;
			dispatch("ready");
			renderLoop();
		} catch (error) {
			failed = true;
			dispatch("error", error instanceof Error ? error.message : String(error));
		}
	});

	onDestroy(() => {
		// onDestroy também roda no SSR, onde nada disso existe.
		if (frame) cancelAnimationFrame(frame);
		resizeObserver?.disconnect();
		visibilityObserver?.disconnect();
		model?.dispose();
		controls?.dispose();
		renderer?.dispose();
		highlightCache.forEach((material) => material.dispose());
	});

	function loadInstrument(id: InstrumentId) {
		if (!THREE || !builders) return;
		loaded = id;
		if (model) {
			scene.remove(model.root);
			model.dispose();
			originalMaterials.clear();
		}
		model = builders[id]();
		scene.add(model.root);

		model.root.traverse((object) => {
			const mesh = object as THREE_NS.Mesh;
			if (mesh.isMesh) originalMaterials.set(mesh, mesh.material);
		});

		const distance = fitFor(model.size);
		camera.near = distance / 200;
		camera.far = distance * 14;
		controls.minDistance = distance * 0.08;
		controls.maxDistance = distance * 3;
		camera.updateProjectionMatrix();

		// Entrada sem transição: o instrumento já aparece enquadrado.
		applyExplode(explode);
		updateFraming();
		controls.target.copy(desiredTarget);
		camera.position
			.set(distance * 0.42, distance * 0.3, distance * 0.85)
			.setLength(desiredDistance)
			.add(desiredTarget);
		controls.update();
		framingActive = false;

		applyHighlight();
		model.applyFingering(fingering);
	}

	/**
	 * Distância que faz uma caixa daquele tamanho caber na viewport atual. O
	 * trompete é largo e baixo, o sax é alto e estreito, o trombone é longuíssimo
	 * — cada um é limitado por uma dimensão diferente, e isso muda no celular.
	 */
	function fitFor(size: THREE_NS.Vector3) {
		const halfFov = (camera.fov / 2) * (Math.PI / 180);
		const width = Math.hypot(size.x, size.z);
		const vertical = size.y / 2 / Math.tan(halfFov);
		const horizontal = width / 2 / (Math.tan(halfFov) * camera.aspect);
		// `width` já é a maior silhueta possível ao girar em torno de Y, então a
		// margem pode ser apertada em ambos os eixos sem risco de corte.
		return Math.max(vertical * 1.1, horizontal * 1.1);
	}

	/** Peças separadas ocupam mais espaço que o instrumento montado. */
	const zoomFor = (amount: number) => 1 + amount * 0.45;

	/** Fração da altura visível que o instrumento sobe no quadro. */
	const LIFT = 0.07;

	/**
	 * Sobe o instrumento baixando o alvo da câmera. O quadro não é usado de forma
	 * simétrica — a etiqueta ocupa o topo e a leitura do mecanismo a base —, então
	 * centrar no meio geométrico deixa ar sobrando em cima e aperta embaixo. A
	 * medida é uma fração da altura visível, para valer igual no trombone deitado
	 * e no sax em pé, mas nunca gasta mais que 80% da folga que existe acima do
	 * modelo: no sax, que é enquadrado pela altura, essa folga é o que separa o
	 * topo da campana da borda do quadro.
	 */
	function liftTarget(distance: number, height: number) {
		const visible = 2 * distance * Math.tan((camera.fov / 2) * (Math.PI / 180));
		const slack = Math.max((visible - height) / 2, 0);
		desiredTarget.y -= Math.min(visible * LIFT, slack * 0.8);
	}

	/** Recalcula para onde a câmera vai: uma peça, ou o instrumento inteiro. */
	function updateFraming(animate = false) {
		if (!model || !THREE) return;

		const part = focus ? model.parts.find((candidate) => candidate.id === focus) : null;
		if (part) {
			const box = new THREE.Box3().setFromObject(part.group);
			const size = box.getSize(new THREE.Vector3());
			desiredTarget.copy(box.getCenter(new THREE.Vector3()));
			// Um bocal tem 5 cm: sem um piso, a câmera entraria dentro dele.
			desiredDistance = Math.max(fitFor(size) * 1.2, fitFor(model.size) * 0.3);
			liftTarget(desiredDistance, size.y);
		} else {
			desiredTarget.set(0, 0, 0);
			desiredDistance = fitFor(model.size) * zoomFor(explode);
			liftTarget(desiredDistance, model.size.y);
		}
		if (animate) framingActive = true;
	}

	/** Reenquadra imediatamente, com transição. */
	export function reframe() {
		updateFraming(true);
	}

	function resize() {
		if (!renderer || !container) return;
		const { clientWidth, clientHeight } = container;
		if (!clientWidth || !clientHeight) return;
		renderer.setSize(clientWidth, clientHeight, false);
		camera.aspect = clientWidth / clientHeight;
		camera.updateProjectionMatrix();
		// Mantém o instrumento enquadrado quando a janela muda de proporção.
		updateFraming(true);
	}

	function applyExplode(amount: number) {
		if (!model || !THREE) return;
		for (const part of model.parts) {
			const base = part.group.userData.base as THREE_NS.Vector3 | undefined;
			if (!base) continue;
			// Peças com ordem maior começam a sair um pouco depois: a desmontagem
			// acontece em cascata, não tudo de uma vez.
			const delay = Math.min(part.order, 7) / 22;
			const local = THREE.MathUtils.clamp((amount - delay) / (1 - delay || 1), 0, 1);
			const eased = local * local * (3 - 2 * local);
			part.group.position.copy(base).addScaledVector(part.explode, eased);
		}
	}

	function highlightMaterial(material: THREE_NS.Material) {
		let cached = highlightCache.get(material);
		if (!cached) {
			const clone = material.clone() as THREE_NS.MeshStandardMaterial;
			clone.emissive = new THREE.Color(0x3f6dff);
			clone.emissiveIntensity = 0.3;
			cached = clone;
			highlightCache.set(material, cached);
		}
		return cached;
	}

	function applyHighlight() {
		if (!model) return;
		// Na narrativa quem aponta é a câmera; o realce fica só para o clique.
		const active = hovered ?? selectedPart;
		for (const part of model.parts) {
			const on = part.id === active;
			part.group.traverse((object) => {
				const mesh = object as THREE_NS.Mesh;
				if (!mesh.isMesh) return;
				const original = originalMaterials.get(mesh);
				if (!original) return;
				mesh.material = on
					? Array.isArray(original)
						? original.map(highlightMaterial)
						: highlightMaterial(original)
					: original;
			});
		}
	}

	function partAt(event: PointerEvent): string | null {
		if (!model || !renderer) return null;
		const rect = renderer.domElement.getBoundingClientRect();
		pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
		raycaster.setFromCamera(pointer, camera);
		const hits = raycaster.intersectObject(model.root, true);
		for (const hit of hits) {
			let node: THREE_NS.Object3D | null = hit.object;
			while (node) {
				if (node.userData.partId) return node.userData.partId as string;
				node = node.parent;
			}
		}
		return null;
	}

	function onPointerMove(event: PointerEvent) {
		if (!pickable) return;
		const id = partAt(event);
		if (id !== hovered) {
			hovered = id;
			applyHighlight();
		}
	}

	function onPointerLeave() {
		if (hovered) {
			hovered = null;
			applyHighlight();
		}
	}

	let downAt = { x: 0, y: 0 };
	const onPointerDown = (event: PointerEvent) => (downAt = { x: event.clientX, y: event.clientY });

	function onPointerUp(event: PointerEvent) {
		if (!pickable) return;
		// Ignora o clique se o usuário estava girando a câmera.
		const moved = Math.hypot(event.clientX - downAt.x, event.clientY - downAt.y);
		if (moved > 6) return;
		const id = partAt(event);
		selectedPart = id;
		dispatch("select", id);
	}

	function renderLoop() {
		frame = requestAnimationFrame(renderLoop);
		const now = performance.now();
		const delta = Math.min((now - lastFrameTime) / 1000, 0.1);
		lastFrameTime = now;
		if (!onScreen) return;

		if (framingActive) {
			const k = 1 - Math.exp(-4.5 * delta);
			controls.target.lerp(desiredTarget, k);
			const offset = camera.position.clone().sub(controls.target);
			const current = offset.length();
			const next = current + (desiredDistance - current) * k;
			camera.position.copy(controls.target).addScaledVector(offset.normalize(), next);
			if (
				controls.target.distanceTo(desiredTarget) < desiredDistance * 0.004 &&
				Math.abs(next - desiredDistance) < desiredDistance * 0.004
			) {
				framingActive = false;
			}
		}

		model?.update(delta);
		controls.autoRotate = autoRotate;
		controls.update();
		renderer.render(scene, camera);
	}

	let loaded: InstrumentId | null = null;
	$: if (ready && instrument !== loaded) loadInstrument(instrument);
	$: if (ready) {
		applyExplode(explode);
		updateFraming(true);
	}
	$: if (ready && focus !== undefined) {
		updateFraming(true);
		applyHighlight();
	}
	$: if (ready && selectedPart !== undefined) applyHighlight();
	$: if (ready && model) model.applyFingering(fingering);
</script>

<div
	class="viewer"
	bind:this={container}
	role="application"
	aria-label="3D"
	on:pointermove={onPointerMove}
	on:pointerleave={onPointerLeave}
	on:pointerdown={onPointerDown}
	on:pointerup={onPointerUp}
	style:cursor={hovered ? "pointer" : "grab"}
>
	{#if !ready && !failed}
		<div class="overlay"><span class="spinner"></span></div>
	{/if}
	{#if failed}
		<div class="overlay"><slot name="error" /></div>
	{/if}
</div>

<style>
	/* Sem fundo: o instrumento flutua sobre a página. */
	.viewer {
		position: relative;
		width: 100%;
		height: 100%;
		background: transparent;
		touch-action: none;
	}

	.viewer :global(canvas) {
		display: block;
		width: 100% !important;
		height: 100% !important;
	}

	.overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
		text-align: center;
		padding: 1rem;
	}

	.spinner {
		width: 24px;
		height: 24px;
		border: 1px solid currentColor;
		border-right-color: transparent;
		border-radius: 50%;
		opacity: 0.4;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.spinner {
			animation-duration: 3s;
		}
	}
</style>
