import * as THREE from "three";
import { InstrumentBuilder, damp } from "./builder";
import * as M from "./materials";
import { crook, lathe, line, path, rim, rod, straightThenFlare, sweep, taper, v } from "./geometry";
import type { Fingering, InstrumentModel } from "./types";

/**
 * Saxofone alto em Mib. ~65 cm de altura, campana de ~12 cm.
 *
 * Ao contrário dos metais, o sax é um tubo *cônico* fechado por uma palheta
 * simples: a coluna de ar é encurtada abrindo furos, não alongada por pistões.
 * Toda a geometria abaixo é construída em torno desse cone.
 */

const BODY_TOP = 30;
const BODY_BOTTOM = -22;
const R_TOP = 1.35;
const R_BOTTOM = 3.1;

/** Raio do corpo cônico numa dada altura. */
const bodyRadius = (y: number) =>
	THREE.MathUtils.lerp(R_BOTTOM, R_TOP, (y - BODY_BOTTOM) / (BODY_TOP - BODY_BOTTOM));

/** Furos do tubo, de cima para baixo. O de cima é o primeiro a fechar. */
const TONE_HOLES: { y: number; r: number; pearl?: boolean }[] = [
	{ y: 24.5, r: 0.62 },
	{ y: 21.5, r: 0.7, pearl: true },
	{ y: 18.0, r: 0.76, pearl: true },
	{ y: 14.5, r: 0.82, pearl: true },
	{ y: 10.5, r: 0.88 },
	{ y: 6.5, r: 0.94, pearl: true },
	{ y: 2.5, r: 1.0, pearl: true },
	{ y: -1.5, r: 1.08, pearl: true },
	{ y: -5.5, r: 1.16 },
	{ y: -9.5, r: 1.24 },
	{ y: -13.5, r: 1.3 },
	{ y: -17.5, r: 1.36 }
];

const ROD_X = -3.0;
const OPEN_ANGLE = -0.26;

/** Achata e afina uma caixa para virar palheta. */
function reedGeometry(): THREE.BufferGeometry {
	const geometry = new THREE.BoxGeometry(2.2, 5.8, 0.34, 1, 12, 1);
	const position = geometry.attributes.position as THREE.BufferAttribute;
	for (let i = 0; i < position.count; i++) {
		const y = position.getY(i);
		const t = THREE.MathUtils.clamp((y + 2.9) / 5.8, 0, 1);
		// Estreita e afina em direção à ponta (a parte que vibra).
		position.setX(i, position.getX(i) * THREE.MathUtils.lerp(1, 0.72, t));
		position.setZ(i, position.getZ(i) * THREE.MathUtils.lerp(1, 0.12, Math.pow(t, 2)));
	}
	geometry.computeVertexNormals();
	return geometry;
}

export function buildSaxophone(): InstrumentModel {
	const b = new InstrumentBuilder();

	// ─── Corpo cônico ─────────────────────────────────────────────────────────
	const body = b.part("body", v(0, 0, 0), 5);
	{
		const curve = path(line(v(0, BODY_TOP + 2, 0), v(0, BODY_BOTTOM, 0), 16));
		body.add(new THREE.Mesh(sweep(curve, taper(R_TOP * 0.94, R_BOTTOM), 120, 40), M.goldLacquer));

		// Espiga do tudel, com parafuso de aperto.
		const tenon = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2.6, 32), M.goldLacquer);
		tenon.position.set(0, BODY_TOP + 1.6, 0);
		body.add(tenon);
		const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.6, 16), M.nickel);
		screw.quaternion.setFromUnitVectors(v(0, 1, 0), v(0, 0, 1));
		screw.position.set(0, BODY_TOP + 1.6, 1.9);
		body.add(screw);

		// Chaminés dos furos: cada furo é um tubinho soldado no cone.
		for (const hole of TONE_HOLES) {
			const r = bodyRadius(hole.y);
			const chimney = new THREE.Mesh(
				new THREE.CylinderGeometry(hole.r, hole.r * 1.05, 0.9, 24, 1, true),
				M.goldLacquer
			);
			chimney.material = M.goldLacquer.clone();
			(chimney.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
			chimney.quaternion.setFromUnitVectors(v(0, 1, 0), v(0, 0, 1));
			chimney.position.set(0, hole.y, r + 0.35);
			body.add(chimney);
		}

		// Apoio e gancho do polegar, nas costas do tubo.
		const thumbRest = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.7), M.ebonite);
		thumbRest.position.set(0, 4.5, -bodyRadius(4.5) - 0.3);
		body.add(thumbRest);
		const hook = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.18, 10, 24, Math.PI), M.goldLacquer);
		hook.position.set(0, 22, -bodyRadius(22) - 0.5);
		hook.rotation.y = Math.PI / 2;
		body.add(hook);
	}

	// ─── Curva (bow) ──────────────────────────────────────────────────────────
	const bow = b.part("bow", v(-3, -12, 0), 6);
	{
		const curve = path(
			line(v(0, BODY_BOTTOM + 1, 0), v(0, BODY_BOTTOM - 1.5, 0), 2),
			crook(v(0, BODY_BOTTOM - 1.5, 0), v(10.5, BODY_BOTTOM - 1.5, 0), v(0, -1, 0), 30),
			line(v(10.5, BODY_BOTTOM - 1.5, 0), v(10.5, BODY_BOTTOM + 1, 0), 2)
		);
		bow.add(new THREE.Mesh(sweep(curve, taper(R_BOTTOM, 3.5), 120, 36), M.goldLacquer));
	}

	// ─── Campana ──────────────────────────────────────────────────────────────
	const bell = b.part("bell", v(9, 6, 0), 7);
	{
		const curve = path([
			v(10.5, BODY_BOTTOM - 0.5, 0),
			v(10.7, -16, 0),
			v(11.4, -10, 0),
			v(12.6, -4, 0),
			v(14.4, 1.5, 0),
			v(17.0, 6.4, 0)
		]);
		bell.add(
			new THREE.Mesh(sweep(curve, straightThenFlare(3.5, 6.3, 0.32, 2.3), 140, 56), M.brassBell)
		);
		bell.add(rim(v(17.4, 7.0, 0), v(0.45, 0.9, 0).normalize(), 6.3, 0.22, M.goldLacquer));

		// Chaves de Si e Sib graves, montadas na própria campana.
		for (const [y, x] of [
			[-8.5, 11.4],
			[-12.5, 11.0]
		]) {
			const cup = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.4, 28), M.goldLacquer);
			cup.quaternion.setFromUnitVectors(v(0, 1, 0), v(0.25, 0, 1).normalize());
			cup.position.set(x, y, 3.4);
			bell.add(cup);
			bell.add(rod(v(x, y, 3.2), v(x + 3.4, y, 1.6), 0.16, M.goldLacquer));
		}
		bell.add(rod(v(14.6, -14.5, 1.4), v(14.6, -6.5, 1.4), 0.2, M.goldLacquer));
	}

	// ─── Tudel (neck) ─────────────────────────────────────────────────────────
	const neck = b.part("neck", v(-6, 14, 0), 3);
	const neckCurve = path(line(v(0, BODY_TOP + 0.6, 0), v(0, BODY_TOP + 4.5, 0), 2), [
		v(-0.5, 37.2, 0),
		v(-2.2, 39.4, 0),
		v(-4.8, 40.4, 0),
		v(-7.6, 40.0, 0),
		v(-9.8, 38.3, 0),
		v(-11.2, 36.4, 0)
	]);
	{
		neck.add(new THREE.Mesh(sweep(neckCurve, taper(1.42, 0.78), 120, 28), M.goldLacquer));
		// Cortiça onde o bocal encaixa e desliza para afinar.
		const corkMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.94, 0.9, 3.4, 24), M.cork);
		corkMesh.quaternion.setFromUnitVectors(v(0, 1, 0), v(-0.62, -0.79, 0).normalize());
		corkMesh.position.set(-10.6, 36.9, 0);
		neck.add(corkMesh);
		// Chave de oitava do tudel.
		neck.add(rod(v(-1.2, 38.2, 0.9), v(-5.4, 40.6, 0.9), 0.16, M.goldLacquer));
		const octaveCup = new THREE.Mesh(
			new THREE.CylinderGeometry(0.42, 0.42, 0.3, 20),
			M.goldLacquer
		);
		octaveCup.quaternion.setFromUnitVectors(v(0, 1, 0), v(0, 0.5, 1).normalize());
		octaveCup.position.set(-5.6, 40.6, 1.1);
		neck.add(octaveCup);
	}

	// ─── Bocal, braçadeira e palheta ──────────────────────────────────────────
	// Direção do bocal: continua a tangente final do tudel.
	const mouthAxis = v(-0.62, -0.79, 0).normalize();
	const mouthOrigin = v(-11.0, 36.6, 0);
	const mouthQuat = new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), mouthAxis);
	const place = (local: THREE.Vector3) => local.clone().applyQuaternion(mouthQuat).add(mouthOrigin);

	{
		const mouthpiece = b.part("mouthpiece", v(-11, -9, 0), 1);
		const profile: [number, number][] = [
			[1.28, 0],
			[1.36, 0.5],
			[1.4, 2.4],
			[1.36, 3.6],
			[1.22, 5.0],
			[0.95, 6.2],
			[0.62, 6.9],
			[0.46, 7.05],
			[0.34, 6.95],
			[0.62, 6.1],
			[0.95, 4.6],
			[1.12, 2.6],
			[1.12, 0.12],
			[1.28, 0]
		];
		const mesh = new THREE.Mesh(lathe(profile, 48), M.ebonite.clone());
		(mesh.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
		mesh.quaternion.copy(mouthQuat);
		mesh.position.copy(mouthOrigin);
		mouthpiece.add(mesh);

		const reed = b.part("reed", v(-4, -7, -6), 0);
		const reedMesh = new THREE.Mesh(reedGeometry(), M.cane);
		reedMesh.quaternion.copy(mouthQuat);
		reedMesh.position.copy(place(v(0, 4.0, 1.24)));
		reed.add(reedMesh);

		const ligature = b.part("ligature", v(-7, -4, 0), 2);
		const band = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.52, 1.6, 32, 1, true), M.nickel);
		band.material = M.nickel.clone();
		(band.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
		band.quaternion.copy(mouthQuat);
		band.position.copy(place(v(0, 2.2, 0)));
		ligature.add(band);
		for (const dy of [-0.5, 0.5]) {
			const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.9, 14), M.nickel);
			screw.quaternion
				.copy(mouthQuat)
				.multiply(new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), v(0, 0, 1)));
			screw.position.copy(place(v(0, 2.2 + dy, 1.9)));
			ligature.add(screw);
		}
	}

	// ─── Mecanismo de chaves ──────────────────────────────────────────────────
	const keywork = b.part("keywork", v(0, 0, 16), 4);
	const keys: THREE.Group[] = [];
	{
		// Hastes-eixo dos dois grupos de chaves (mão esquerda e mão direita).
		for (const [y0, y1] of [
			[25.6, 9.5],
			[7.5, -18.5]
		]) {
			const shaft = new THREE.Mesh(
				new THREE.CylinderGeometry(0.3, 0.3, y0 - y1, 16),
				M.goldLacquer
			);
			shaft.position.set(ROD_X, (y0 + y1) / 2, bodyRadius((y0 + y1) / 2) + 1.1);
			keywork.add(shaft);
		}

		TONE_HOLES.forEach((hole, index) => {
			const r = bodyRadius(hole.y);
			const pivot = new THREE.Group();
			pivot.position.set(ROD_X, hole.y, r + 1.1);
			keywork.add(pivot);
			keys.push(pivot);

			// Braço indo do eixo até o furo.
			pivot.add(rod(v(0, 0, 0), v(-ROD_X, 0, -1.1), 0.17, M.goldLacquer));

			// Sapatilha (chave): copo de metal + pastilha de feltro/couro.
			const cup = new THREE.Mesh(
				new THREE.CylinderGeometry(hole.r + 0.34, hole.r + 0.34, 0.34, 28),
				M.goldLacquer
			);
			cup.quaternion.setFromUnitVectors(v(0, 1, 0), v(0, 0, 1));
			cup.position.set(-ROD_X, 0, -0.35);
			pivot.add(cup);

			const padMesh = new THREE.Mesh(
				new THREE.CylinderGeometry(hole.r + 0.2, hole.r + 0.2, 0.22, 26),
				M.pad
			);
			padMesh.quaternion.setFromUnitVectors(v(0, 1, 0), v(0, 0, 1));
			padMesh.position.set(-ROD_X, 0, -0.6);
			pivot.add(padMesh);

			// Botão de madrepérola, onde o dedo realmente encosta.
			if (hole.pearl) {
				const stem = rod(v(0, 0, 0), v(1.7, 0, 1.5), 0.15, M.goldLacquer);
				pivot.add(stem);
				const button = new THREE.Mesh(
					lathe(
						[
							[0, 0],
							[0.58, 0.04],
							[0.62, 0.2],
							[0.5, 0.48],
							[0, 0.56]
						],
						28
					),
					M.pearl
				);
				button.quaternion.setFromUnitVectors(v(0, 1, 0), v(0, 0, 1));
				button.position.set(1.7, 0, 1.5);
				pivot.add(button);
			}

			// Molas de agulha em cada chave.
			const spring = rod(v(0, 0, 0), v(0.9, index % 2 ? 1.1 : -1.1, 0), 0.07, M.steel);
			pivot.add(spring);
		});

		// Postes de sustentação soldados ao corpo.
		for (const y of [26, 18, 10, 2, -6, -14, -19]) {
			keywork.add(
				rod(v(ROD_X, y, bodyRadius(y) + 0.2), v(ROD_X, y, bodyRadius(y) + 1.1), 0.28, M.goldLacquer)
			);
		}

		// Espátulas graves (mindinho esquerdo) e chaves laterais (mão direita).
		for (const [y, dx] of [
			[-4.5, 2.6],
			[-6.2, 3.4],
			[-7.9, 2.6],
			[-9.6, 3.4]
		]) {
			const spatula = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.1, 0.3), M.pearl);
			spatula.position.set(-dx - 1.4, y, bodyRadius(y) + 1.3);
			spatula.rotation.z = 0.25;
			keywork.add(spatula);
		}
		for (const y of [12.5, 14.2, 15.9]) {
			const side = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.7, 0.28), M.goldLacquer);
			side.position.set(3.1, y, bodyRadius(y) + 0.9);
			keywork.add(side);
		}
	}

	const size = b.center();

	// ─── Animação das chaves ──────────────────────────────────────────────────
	const angles = keys.map(() => OPEN_ANGLE);
	const targets = keys.map(() => OPEN_ANGLE);

	return {
		id: "saxophone",
		root: b.root,
		parts: b.parts,
		size,
		applyFingering(fingering: Fingering | null) {
			const closed = !fingering || fingering.kind !== "keys" ? 0 : fingering.closed;
			for (let i = 0; i < targets.length; i++) targets[i] = i < closed ? 0 : OPEN_ANGLE;
		},
		update(delta: number) {
			for (let i = 0; i < keys.length; i++) {
				angles[i] = damp(angles[i], targets[i], 22, delta);
				keys[i].rotation.y = angles[i];
			}
		},
		dispose() {
			b.dispose();
		}
	};
}
