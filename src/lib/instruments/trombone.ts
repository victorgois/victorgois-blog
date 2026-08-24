import * as THREE from "three";
import { InstrumentBuilder, damp } from "./builder";
import * as M from "./materials";
import { arc, crook, ferrule, flare, lathe, line, path, rim, rod, sweep, taper, v } from "./geometry";
import { SLIDE_POSITIONS } from "./fingerings";
import type { Fingering, InstrumentModel } from "./types";

/**
 * Trombone tenor em Sib. Mesma escala em centímetros dos outros dois
 * instrumentos.
 *
 * O ponto que menos se percebe olhando de lado: a vara não está no plano da
 * campana. Os dois tubos dela ficam lado a lado, girados 90° para fora, e a
 * vara inteira fica de um lado só do plano da campana — o lado direito de quem
 * toca. Tocando, é isso que faz a campana sair pelo ombro esquerdo enquanto o
 * bocal continua no meio da boca. E é por isso que o tubo de ligação faz uma
 * curva *lateral*, não vertical: ele sai do plano da campana e vai buscar o
 * tubo da vara, três centímetros e meio para o lado.
 *
 * Proporções tiradas de um tenor de estudante (calibre .500", campana de 8"):
 *   • ~117 cm de comprimento com a vara recolhida (~175 cm na 7ª posição);
 *   • campana de 20,3 cm de diâmetro, com o bordo ~44 cm atrás da curva da vara;
 *   • os dois tubos da vara a 9,8 cm um do outro, em Z;
 *   • o U da bomba de afinação tem 10,5 cm e cai quase até a altura da vara;
 *   • ~274 cm (9 pés) de tubo somando tudo, que é o que faz dele um Sib.
 *
 * Ordem do ar: bocal → tubo de um lado da vara → curva → tubo do outro lado →
 * tubo de ligação → bomba de afinação → campana.
 *
 * O trombone é o único dos três sem pistões: a vara alonga o tubo de forma
 * contínua, e é por isso que ele pode tocar glissando de verdade.
 *
 * Eixos: +X aponta para a campana, +Y para cima, +Z na direção do observador.
 */

const Y_SLIDE = 0; // os dois tubos da vara, na mesma altura
const Y_TUNE = 1.9; // ramo inferior da bomba, quase na altura da vara
const Y_BELL = 11.6; // eixo da campana

const Z_BELL = 0; // plano da campana e da bomba: a vara inteira fica à direita
const Z_BACK = 3.4; // tubo da vara que recebe o tubo de ligação
const Z_LEAD = 13.2; // tubo da vara que recebe o bocal (o mais à direita)
const SWING = THREE.MathUtils.degToRad(8.4); // desvio lateral da ligação

const R_INNER = 0.6; // vara interna
const R_STOCK = 0.65; // meias, na ponta da vara interna
const R_OUTER = 0.68; // vara externa
const R_TUNE = 0.78; // bomba de afinação

const X_LOCK = -2.3; // porca que trava a seção da campana
const X_OUTER_TOP = 5.6; // topo da vara externa, na 1ª posição
const X_INNER_END = 66.8; // ponta da vara interna
const X_CROOK = 67.5; // centro da curva da vara, na 1ª posição
const X_TUNE_JOINT = -27.5; // juntas da bomba de afinação
const X_TUNE_BOW = -38.7; // centro do U da bomba
const X_FLARE = 9.3; // onde a campana começa a abrir
const X_RIM = 29; // bordo da campana
const R_RIM = 10.15;

/**
 * O tubo de ligação é desenhado deitado (todo em Y=0) e depois recebe a subida
 * suave até a altura da bomba — assim a curva lateral fica exata e a subida
 * entra sem quebrar a tangente nas duas pontas.
 */
function liftY(points: THREE.Vector3[]): THREE.Vector3[] {
	return points.map((p) => {
		const t = THREE.MathUtils.clamp((p.x + 1.8) / (X_TUNE_JOINT + 1.8), 0, 1);
		p.y = Y_TUNE * t * t * (3 - 2 * t);
		return p;
	});
}

export function buildTrombone(): InstrumentModel {
	const b = new InstrumentBuilder();

	// ─── Bocal ────────────────────────────────────────────────────────────────
	const mouthpiece = b.part("mouthpiece", v(-16, -6, 10), 1);
	{
		// 8,5 cm de comprimento, aro de 3 cm: taça larga e funda, o oposto do
		// bocal raso do trompete.
		const profile: [number, number][] = [
			[0.56, 0],
			[0.63, 1.2],
			[0.76, 3.3],
			[0.82, 4.1],
			[0.88, 4.4],
			[1.14, 4.9],
			[1.34, 6.3],
			[1.46, 7.5],
			[1.5, 8.1],
			[1.48, 8.42],
			[1.3, 8.5],
			[1.08, 8.24],
			[0.8, 7.4],
			[0.47, 6.3],
			[0.31, 5.1],
			[0.29, 3.5],
			[0.3, 0.06],
			[0.56, 0]
		];
		const mesh = new THREE.Mesh(lathe(profile, 56), M.nickel.clone());
		(mesh.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
		// O perfil sobe em +Y; o bocal aponta para -X (para trás).
		mesh.quaternion.setFromUnitVectors(v(0, 1, 0), v(-1, 0, 0));
		mesh.position.set(2.4, Y_SLIDE, Z_LEAD);
		mouthpiece.add(mesh);
	}

	// ─── Vara interna (fixa) ──────────────────────────────────────────────────
	const innerSlide = b.part("inner-slide", v(0, -24, 0), 3);
	{
		for (const [z, x0] of [
			[Z_LEAD, -1.2],
			[Z_BACK, -2.8]
		]) {
			const curve = path(line(v(x0, Y_SLIDE, z), v(X_INNER_END, Y_SLIDE, z), 12));
			innerSlide.add(new THREE.Mesh(sweep(curve, R_INNER, 64, 20), M.nickel));
			// "Meias": o alargamento na ponta que veda contra a vara externa. Na
			// 7ª posição é quase só elas que continuam encaixadas.
			const stocking = new THREE.Mesh(
				new THREE.CylinderGeometry(R_STOCK, R_STOCK, 3.0, 24),
				M.nickel
			);
			stocking.quaternion.setFromUnitVectors(v(0, 1, 0), v(1, 0, 0));
			stocking.position.set(X_INNER_END - 1.6, Y_SLIDE, z);
			innerSlide.add(stocking);
		}

		// Receptor do bocal, no tubo da frente.
		const receiver = new THREE.Mesh(new THREE.CylinderGeometry(0.94, 0.8, 4.6, 32), M.brass);
		receiver.quaternion.setFromUnitVectors(v(0, 1, 0), v(1, 0, 0));
		receiver.position.set(1.1, Y_SLIDE, Z_LEAD);
		innerSlide.add(receiver);

		// Porca de trava, no tubo de trás: é aqui que o trombone se separa em
		// duas metades, a da vara e a da campana.
		const lockNut = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 1.8, 32), M.brass);
		lockNut.quaternion.setFromUnitVectors(v(0, 1, 0), v(1, 0, 0));
		lockNut.position.set(X_LOCK, Y_SLIDE, Z_BACK);
		innerSlide.add(lockNut);

		// Escora da vara interna: é onde a mão esquerda segura o instrumento.
		// A vara externa recolhida para quase encostada nela.
		innerSlide.add(rod(v(3.0, Y_SLIDE, Z_BACK), v(3.0, Y_SLIDE, Z_LEAD), 0.3, M.brass));
	}

	// ─── Vara externa (móvel) ─────────────────────────────────────────────────
	const outerSlide = b.part("outer-slide", v(34, 0, 0), 2);
	const outerInner = new THREE.Group();
	outerSlide.add(outerInner);
	{
		for (const z of [Z_LEAD, Z_BACK]) {
			const curve = path(line(v(X_OUTER_TOP, Y_SLIDE, z), v(X_CROOK, Y_SLIDE, z), 12));
			outerInner.add(new THREE.Mesh(sweep(curve, R_OUTER, 64, 22), M.brass));
			for (const [x, len] of [
				[X_OUTER_TOP + 0.6, 1.5],
				[X_CROOK - 1.3, 1.3]
			]) {
				const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, len, 26), M.nickel);
				ring.quaternion.setFromUnitVectors(v(0, 1, 0), v(1, 0, 0));
				ring.position.set(x, Y_SLIDE, z);
				outerInner.add(ring);
			}
		}
		// Curva da vara (a ponta em U) — deitada, no plano horizontal.
		const bow = path(crook(v(X_CROOK, Y_SLIDE, Z_BACK), v(X_CROOK, Y_SLIDE, Z_LEAD), v(1, 0, 0), 28));
		outerInner.add(new THREE.Mesh(sweep(bow, R_OUTER, 72, 22), M.brass));
		// Escora externa: onde a mão direita empurra e puxa. Fica no alto da
		// vara, logo à frente da escora interna.
		outerInner.add(rod(v(8.7, Y_SLIDE, Z_BACK), v(8.7, Y_SLIDE, Z_LEAD), 0.3, M.brass));
		// Chave de água, embaixo da ponta da curva.
		const zBow = (Z_BACK + Z_LEAD) / 2;
		const xBow = X_CROOK + Math.abs(Z_LEAD - Z_BACK) / 2;
		outerInner.add(rod(v(xBow - 1.4, -0.2, zBow), v(xBow + 1.0, -0.9, zBow), 0.2, M.brass));
		const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.26, 16), M.cork);
		cap.quaternion.setFromUnitVectors(v(0, 1, 0), v(0.6, -0.8, 0));
		cap.position.set(xBow + 1.1, -1.05, zBow);
		outerInner.add(cap);
		outerInner.add(rod(v(xBow + 1.0, -1.2, zBow), v(xBow - 2.6, -2.2, zBow), 0.12, M.brass));
	}

	// ─── Tubo de ligação: da vara até a bomba de afinação ─────────────────────
	// A curva é lateral, quase deitada: sai do tubo da vara e atravessa 4,9 cm
	// em Z até o plano da campana, com apenas 1,9 cm de subida no caminho. As
	// duas dobras são assimétricas — fechada do lado do bocal (raio 6) e
	// longuíssima do lado da bomba (raio 30, seis centímetros para virar doze
	// graus). O miolo é reto.
	const gooseneck = b.part("gooseneck", v(-12, -16, -8), 4);
	const goosePath = path(
		liftY([
			...arc(v(-1.8, 0, Z_BACK - 6), 6, v(0, 0, 1), v(-1, 0, 0), 0, SWING, 6),
			...line(v(-2.677, 0, 3.336), v(-23.117, 0, 0.322), 6),
			...arc(v(X_TUNE_JOINT, 0, 30), 30, v(0, 0, -1), v(-1, 0, 0), -SWING, 0, 8)
		])
	);
	{
		gooseneck.add(new THREE.Mesh(sweep(goosePath, taper(0.6, R_TUNE), 96, 20), M.brass));
		gooseneck.add(ferrule(goosePath, 0.04, 0.86, 1.4, M.brass));
	}

	// ─── Bomba de afinação (o U do fundo, atrás da cabeça) ────────────────────
	const tuningSlide = b.part("tuning-slide", v(-24, 6, 0), 5);
	{
		const curve = path(
			line(v(X_TUNE_JOINT, Y_TUNE, Z_BELL), v(X_TUNE_BOW, Y_TUNE, Z_BELL), 4),
			crook(v(X_TUNE_BOW, Y_TUNE, Z_BELL), v(X_TUNE_BOW, Y_BELL, Z_BELL), v(-1, 0, 0), 28),
			line(v(X_TUNE_BOW, Y_BELL, Z_BELL), v(X_TUNE_JOINT, Y_BELL, Z_BELL), 4)
		);
		tuningSlide.add(new THREE.Mesh(sweep(curve, R_TUNE, 120, 22), M.brass));
		// O trecho que corre dentro do receptor é niquelado, como no real.
		for (const u of [0.05, 0.95]) tuningSlide.add(ferrule(curve, u, R_TUNE + 0.02, 4.6, M.nickel));
		tuningSlide.add(ferrule(curve, 0.012, 0.92, 1.4, M.brass));
		tuningSlide.add(ferrule(curve, 0.988, 0.92, 1.4, M.brass));
		// Escora junto das juntas (a do fundo carrega o contrapeso).
		tuningSlide.add(
			rod(v(X_TUNE_JOINT - 1.0, Y_TUNE, Z_BELL), v(X_TUNE_JOINT - 1.0, Y_BELL, Z_BELL), 0.26, M.brass)
		);
	}

	// ─── Contrapeso ───────────────────────────────────────────────────────────
	const counterweight = b.part("counterweight", v(-20, 12, 0), 6);
	{
		// Disco de latão preso entre os dois ramos da bomba, junto do U.
		const X_W = X_TUNE_BOW + 2.7;
		const Y_W = (Y_TUNE + Y_BELL) / 2;
		counterweight.add(rod(v(X_W, Y_TUNE, Z_BELL), v(X_W, Y_BELL, Z_BELL), 0.26, M.brass));
		const disc = new THREE.Mesh(
			lathe(
				[
					[0, 0],
					[1.9, 0],
					[2.15, 0.25],
					[2.15, 1.05],
					[1.9, 1.3],
					[0, 1.3]
				],
				40
			),
			M.brass
		);
		disc.quaternion.setFromUnitVectors(v(0, 1, 0), v(0, 0, 1));
		disc.position.set(X_W, Y_W, Z_BELL - 0.65);
		counterweight.add(disc);
	}

	// ─── Campana ──────────────────────────────────────────────────────────────
	const bell = b.part("bell", v(0, 22, 0), 7);
	{
		// Cone lento por quase quarenta centímetros; a abertura acontece toda
		// nos últimos vinte.
		const tube = path(line(v(X_TUNE_JOINT - 0.6, Y_BELL, Z_BELL), v(X_FLARE, Y_BELL, Z_BELL), 14));
		bell.add(new THREE.Mesh(sweep(tube, taper(0.88, 2.1), 120, 24), M.brass));

		const mouth = path(line(v(X_FLARE - 0.2, Y_BELL, Z_BELL), v(X_RIM, Y_BELL, Z_BELL), 24));
		bell.add(new THREE.Mesh(sweep(mouth, flare(2.1, R_RIM, 3.0), 140, 72), M.brassBell));
		bell.add(rim(v(X_RIM, Y_BELL, Z_BELL), v(1, 0, 0), R_RIM, 0.26, M.brass));

		// Escora que amarra a campana ao tubo de ligação, logo acima do bocal:
		// é ela que fecha o triângulo rígido que a mão esquerda abraça.
		bell.add(rod(v(-8, Y_BELL - 0.9, Z_BELL), v(-8, 0.6, 2.55), 0.26, M.brass));
	}

	const size = b.center();

	// A vara estendida faz parte do tamanho do instrumento: reserva o curso
	// inteiro no enquadramento e desloca a origem para que a 1ª e a 7ª posição
	// fiquem simétricas em torno do centro.
	const travel = SLIDE_POSITIONS[SLIDE_POSITIONS.length - 1];
	b.root.position.x = -travel / 2;
	size.x += travel;

	// ─── Animação da vara ─────────────────────────────────────────────────────
	let extension = 0;
	let targetExtension = 0;

	return {
		id: "trombone",
		root: b.root,
		parts: b.parts,
		size,
		applyFingering(fingering: Fingering | null) {
			if (!fingering || fingering.kind !== "slide") return;
			const index = THREE.MathUtils.clamp(Math.round(fingering.position) - 1, 0, 6);
			targetExtension = SLIDE_POSITIONS[index];
		},
		update(delta: number) {
			extension = damp(extension, targetExtension, 12, delta);
			outerInner.position.x = extension;
		},
		dispose() {
			b.dispose();
		}
	};
}
