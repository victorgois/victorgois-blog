import * as THREE from "three";
import { InstrumentBuilder, damp } from "./builder";
import * as M from "./materials";
import { crook, ferrule, flare, lathe, line, path, rim, rod, sweep, taper, v } from "./geometry";
import type { Fingering, InstrumentModel } from "./types";

/**
 * Trompete em Sib. Unidades em centímetros (comprimento total ~48 cm,
 * campana de 12,5 cm de diâmetro), o que mantém a escala coerente com o
 * saxofone e o trombone quando os três são comparados lado a lado.
 *
 * Eixos: +X aponta para a campana, +Y para cima, +Z na direção do observador.
 */

const CASING_R = 1.18;
const VALVE_X = [-6.6, -3.8, -1.0];
const Z_LEAD = 1.95;
const Z_BELL = -2.0;
const Y_LEAD = -1.2;
const Y_BELL = 3.0;
const PISTON_TRAVEL = 1.15;

export function buildTrumpet(): InstrumentModel {
	const b = new InstrumentBuilder();

	// ─── Bocal ────────────────────────────────────────────────────────────────
	const mouthpiece = b.part("mouthpiece", v(-9, 0, 0), 1);
	{
		// Perfil de revolução: sobe pelo lado de fora (haste → grão → aro) e
		// desce pelo lado de dentro (mordida → taça → garganta → furo).
		const profile: [number, number][] = [
			[0.46, 0],
			[0.5, 0.6],
			[0.56, 2.0],
			[0.62, 2.5],
			[0.66, 2.6],
			[1.02, 2.95],
			[1.24, 3.7],
			[1.4, 4.6],
			[1.45, 4.9],
			[1.32, 5.05],
			[1.06, 4.98],
			[0.94, 4.55],
			[0.58, 3.85],
			[0.27, 3.2],
			[0.22, 2.4],
			[0.2, 0.06],
			[0.46, 0]
		];
		const mesh = new THREE.Mesh(lathe(profile, 56), M.nickel);
		mesh.material = M.nickel.clone();
		(mesh.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
		// O perfil é construído em +Y; o bocal aponta para -X (para trás).
		mesh.quaternion.setFromUnitVectors(v(0, 1, 0), v(-1, 0, 0));
		mesh.position.set(-19.2, Y_LEAD, Z_LEAD);
		mouthpiece.add(mesh);
	}

	// ─── Tudel (leadpipe) ─────────────────────────────────────────────────────
	const leadpipeCurve = path(
		line(v(-19.6, Y_LEAD, Z_LEAD), v(-14, Y_LEAD, Z_LEAD), 3),
		line(v(-14, Y_LEAD, Z_LEAD), v(12.6, Y_LEAD, Z_LEAD), 10)
	);
	const leadpipe = b.part("leadpipe", v(0, 0, 9), 2);
	{
		leadpipe.add(new THREE.Mesh(sweep(leadpipeCurve, taper(0.52, 0.74), 96, 24), M.brass));
		// Bocal-receptor e virola de reforço.
		leadpipe.add(ferrule(leadpipeCurve, 0.02, 0.95, 2.4, M.nickel));
		leadpipe.add(ferrule(leadpipeCurve, 0.35, 0.86, 1.1, M.nickel));
		leadpipe.add(ferrule(leadpipeCurve, 0.985, 0.9, 1.2, M.nickel));
	}

	// ─── Bomba de afinação geral ──────────────────────────────────────────────
	const tuningCurve = path(
		line(v(12.2, Y_LEAD, Z_LEAD), v(17.4, Y_LEAD, Z_LEAD), 4),
		crook(v(17.4, Y_LEAD, Z_LEAD), v(17.4, Y_LEAD + 2.7, Z_LEAD), v(1, 0, 0), 24),
		line(v(17.4, Y_LEAD + 2.7, Z_LEAD), v(12.2, Y_LEAD + 2.7, Z_LEAD), 4)
	);
	const tuningSlide = b.part("tuning-slide", v(11, 0, 0), 3);
	{
		tuningSlide.add(new THREE.Mesh(sweep(tuningCurve, 0.78, 128, 22), M.brass));
		tuningSlide.add(ferrule(tuningCurve, 0.03, 0.9, 1.0, M.brass));
		tuningSlide.add(ferrule(tuningCurve, 0.97, 0.9, 1.0, M.brass));
		// Chave de água (dreno de condensação) na curva.
		const key = rod(v(19.6, Y_LEAD + 1.35, Z_LEAD), v(21.4, Y_LEAD + 1.35, Z_LEAD), 0.14, M.brass);
		tuningSlide.add(key);
		const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.22, 16), M.cork);
		cap.position.set(19.9, Y_LEAD + 1.0, Z_LEAD);
		tuningSlide.add(cap);
		// Escora entre os dois ramos.
		tuningSlide.add(
			rod(v(14.4, Y_LEAD + 0.5, Z_LEAD), v(14.4, Y_LEAD + 2.2, Z_LEAD), 0.16, M.brass)
		);
	}

	// ─── Corpo: caixas dos pistões, joelhos e retorno da bomba ────────────────
	const body = b.part("valve-block", v(0, 0, 0), 6);
	{
		for (const x of VALVE_X) {
			const casing = new THREE.Mesh(
				new THREE.CylinderGeometry(CASING_R, CASING_R, 6.8, 40, 1, true),
				M.brass
			);
			casing.material = M.brass.clone();
			(casing.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
			casing.position.set(x, -1.9, 0);
			body.add(casing);

			const topCap = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.24, 1.0, 40), M.brass);
			topCap.position.set(x, 1.9, 0);
			body.add(topCap);

			const bottomCap = new THREE.Mesh(new THREE.CylinderGeometry(1.26, 1.1, 1.2, 40), M.brass);
			bottomCap.position.set(x, -5.8, 0);
			body.add(bottomCap);
		}

		// Joelhos ligando as caixas (passam por trás, entre uma caixa e outra).
		for (let i = 0; i < 2; i++) {
			const x0 = VALVE_X[i];
			const x1 = VALVE_X[i + 1];
			for (const [y, depth] of [
				[0.4, -1.5],
				[-4.2, -2.0]
			]) {
				const knuckle = path([
					v(x0, y, -0.6),
					v(x0 + 0.5, y, depth * 0.8),
					v((x0 + x1) / 2, y, depth),
					v(x1 - 0.5, y, depth * 0.8),
					v(x1, y, -0.6)
				]);
				body.add(new THREE.Mesh(sweep(knuckle, 0.5, 48, 16), M.brass));
			}
		}

		// Retorno da bomba de afinação até a 3ª caixa.
		const returnCurve = path(line(v(12.6, Y_LEAD + 2.7, Z_LEAD), v(1.2, Y_LEAD + 2.7, Z_LEAD), 6), [
			v(-0.2, 1.0, 1.9),
			v(-0.9, -0.2, 1.75),
			v(VALVE_X[2], -1.3, 1.05)
		]);
		body.add(new THREE.Mesh(sweep(returnCurve, taper(0.74, 0.6), 96, 20), M.brass));

		// Apoio de polegar e gancho do mindinho — o que fixa a mão direita.
		const hook = path([v(-2.6, 0.9, 2.3), v(-1.6, 1.6, 2.6), v(-0.5, 1.5, 2.5), v(-0.3, 0.7, 2.2)]);
		body.add(new THREE.Mesh(sweep(hook, 0.2, 40, 12), M.brass));
		const thumb = path([v(-7.6, -0.2, 1.6), v(-8.6, 0.4, 1.9), v(-9.2, 1.3, 1.6)]);
		body.add(new THREE.Mesh(sweep(thumb, 0.2, 32, 12), M.brass));
	}

	// ─── Pistões ──────────────────────────────────────────────────────────────
	const pistons: THREE.Group[] = [];
	VALVE_X.forEach((x, i) => {
		const part = b.part(`piston-${i + 1}`, v(0, 13 + i * 0.6, 0), 4 + i * 0.01);
		const inner = new THREE.Group();
		part.add(inner);
		pistons.push(inner);

		const barrel = new THREE.Mesh(new THREE.CylinderGeometry(1.04, 1.04, 6.4, 32), M.nickel);
		barrel.position.set(x, -1.9, 0);
		inner.add(barrel);

		// "Janelas" do pistão: é por elas que o ar entra no tubo extra.
		for (const y of [-0.4, -3.4]) {
			for (const z of [1, -1]) {
				const port = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 20), M.steel);
				port.quaternion.setFromUnitVectors(v(0, 1, 0), v(0, 0, z));
				port.position.set(x, y, z * 0.98);
				inner.add(port);
			}
		}

		const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.6, 20), M.nickel);
		stem.position.set(x, 2.9, 0);
		inner.add(stem);

		const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.5, 0.5, 28), M.brass);
		collar.position.set(x, 4.1, 0);
		inner.add(collar);

		const button = new THREE.Mesh(
			lathe(
				[
					[0, 0],
					[0.62, 0.02],
					[0.72, 0.22],
					[0.7, 0.7],
					[0.5, 0.92],
					[0, 0.98]
				],
				36
			),
			M.pearl
		);
		button.position.set(x, 4.3, 0);
		inner.add(button);
	});

	// ─── Bombas dos pistões ───────────────────────────────────────────────────
	{
		// 1ª bomba: volta curta para trás, acima da 3ª.
		const slide1 = b.part("slide-1", v(-8, 2.5, 0), 5);
		const c1 = path(
			line(v(VALVE_X[0], -1.8, 0), v(-11.6, -1.8, 0), 4),
			crook(v(-11.6, -1.8, 0), v(-11.6, -3.5, 0), v(-1, 0, 0), 20),
			line(v(-11.6, -3.5, 0), v(VALVE_X[0], -3.5, 0), 4)
		);
		slide1.add(new THREE.Mesh(sweep(c1, 0.56, 110, 18), M.brass));
		slide1.add(ferrule(c1, 0.06, 0.66, 0.9, M.brass));
		slide1.add(ferrule(c1, 0.94, 0.66, 0.9, M.brass));

		// 2ª bomba: a mais curta de todas, saindo pela frente da 2ª caixa.
		const slide2 = b.part("slide-2", v(0, 0, -7), 5.01);
		const c2 = path(
			line(v(VALVE_X[1], -2.4, 0), v(VALVE_X[1], -2.4, -3.4), 3),
			crook(v(VALVE_X[1], -2.4, -3.4), v(VALVE_X[1], -3.9, -3.4), v(0, 0, -1), 20),
			line(v(VALVE_X[1], -3.9, -3.4), v(VALVE_X[1], -3.9, 0), 3)
		);
		slide2.add(new THREE.Mesh(sweep(c2, 0.56, 90, 18), M.brass));
		slide2.add(ferrule(c2, 0.08, 0.66, 0.9, M.brass));
		slide2.add(ferrule(c2, 0.92, 0.66, 0.9, M.brass));

		// 3ª bomba: a mais longa, com anel para o dedo anelar corrigir a afinação.
		const slide3 = b.part("slide-3", v(-10, -3, -3), 5.02);
		const c3 = path(
			[v(VALVE_X[2], -3.9, 0), v(VALVE_X[2] - 0.4, -4.1, -1.6), v(-2.6, -4.3, -2.7)],
			line(v(-2.6, -4.3, -2.7), v(-11.2, -4.3, -2.7), 5),
			crook(v(-11.2, -4.3, -2.7), v(-11.2, -6.1, -2.7), v(-1, 0, 0), 20),
			line(v(-11.2, -6.1, -2.7), v(-3.0, -6.1, -2.7), 5),
			[v(-1.6, -5.9, -2.2), v(VALVE_X[2], -5.4, -0.7)]
		);
		slide3.add(new THREE.Mesh(sweep(c3, 0.56, 140, 18), M.brass));
		slide3.add(ferrule(c3, 0.05, 0.66, 0.9, M.brass));
		slide3.add(ferrule(c3, 0.95, 0.66, 0.9, M.brass));
		const ring = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.16, 10, 32), M.brass);
		ring.position.set(-9.4, -5.2, -2.7);
		ring.quaternion.setFromUnitVectors(v(0, 0, 1), v(0, 0, 1));
		slide3.add(ring);
		slide3.add(rod(v(-9.4, -4.3, -2.7), v(-9.4, -6.1, -2.7), 0.14, M.brass));
	}

	// ─── Campana ──────────────────────────────────────────────────────────────
	const bell = b.part("bell", v(0, 0, -14), 7);
	{
		const throat = path(
			[v(VALVE_X[0], -1.9, -1.0), v(-7.6, -1.7, -1.9), v(-9.6, -1.5, Z_BELL)],
			line(v(-9.6, -1.5, Z_BELL), v(-12.6, -1.4, Z_BELL), 3),
			crook(v(-12.6, -1.4, Z_BELL), v(-12.6, Y_BELL, Z_BELL), v(-1, 0, 0), 26),
			line(v(-12.6, Y_BELL, Z_BELL), v(12.4, Y_BELL, Z_BELL), 10)
		);
		bell.add(new THREE.Mesh(sweep(throat, taper(0.6, 1.05), 200, 24), M.brass));

		const mouth = path(line(v(12.2, Y_BELL, Z_BELL), v(24.6, Y_BELL, Z_BELL), 20));
		bell.add(new THREE.Mesh(sweep(mouth, flare(1.05, 6.25, 3.2), 120, 64), M.brassBell));
		bell.add(rim(v(24.6, Y_BELL, Z_BELL), v(1, 0, 0), 6.25, 0.22, M.brass));

		// Escoras que amarram a campana ao resto do corpo.
		bell.add(rod(v(-11.4, 0.9, Z_BELL), v(-11.4, -1.2, Z_BELL - 0.1), 0.22, M.brass));
		bell.add(rod(v(6.5, Y_BELL - 0.9, Z_BELL), v(6.5, Y_LEAD + 0.8, Z_LEAD - 0.2), 0.24, M.brass));
		bell.add(
			rod(v(-1.2, Y_BELL - 0.9, Z_BELL), v(-1.2, Y_LEAD + 0.8, Z_LEAD - 0.2), 0.24, M.brass)
		);
	}

	const size = b.center();

	// ─── Animação ─────────────────────────────────────────────────────────────
	const pressed = [0, 0, 0];
	const target = [0, 0, 0];

	return {
		id: "trumpet",
		root: b.root,
		parts: b.parts,
		size,
		applyFingering(fingering: Fingering | null) {
			if (!fingering || fingering.kind !== "valves") {
				target[0] = target[1] = target[2] = 0;
				return;
			}
			for (let i = 0; i < 3; i++) target[i] = fingering.valves[i] ? 1 : 0;
		},
		update(delta: number) {
			for (let i = 0; i < 3; i++) {
				pressed[i] = damp(pressed[i], target[i], 26, delta);
				pistons[i].position.y = -pressed[i] * PISTON_TRAVEL;
			}
		},
		dispose() {
			b.dispose();
		}
	};
}
