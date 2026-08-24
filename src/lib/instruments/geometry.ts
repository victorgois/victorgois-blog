import * as THREE from "three";

/**
 * Helpers para construir instrumentos de sopro proceduralmente.
 *
 * A ideia central é `sweep()`: varrer uma seção circular de raio variável ao
 * longo de uma curva. É isso que permite modelar tubos cônicos (sax), tubos
 * cilíndricos (trombone) e campanas exponenciais (todos) sem depender de
 * arquivos .glb externos — e, principalmente, permite quebrar o instrumento em
 * peças nomeadas e separáveis.
 */

export type RadiusFn = (t: number) => number;

export const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);

/** Varre um círculo de raio variável ao longo de uma curva. */
export function sweep(
	curve: THREE.Curve<THREE.Vector3>,
	radius: number | RadiusFn,
	tubularSegments = 128,
	radialSegments = 28
): THREE.BufferGeometry {
	const radiusAt: RadiusFn = typeof radius === "function" ? radius : () => radius;
	const frames = curve.computeFrenetFrames(tubularSegments, false);

	const positions: number[] = [];
	const normals: number[] = [];
	const uvs: number[] = [];
	const indices: number[] = [];

	const P = new THREE.Vector3();
	const dir = new THREE.Vector3();

	for (let i = 0; i <= tubularSegments; i++) {
		const t = i / tubularSegments;
		curve.getPointAt(t, P);
		const N = frames.normals[i];
		const B = frames.binormals[i];
		const r = radiusAt(t);

		for (let j = 0; j <= radialSegments; j++) {
			const a = (j / radialSegments) * Math.PI * 2;
			const sin = Math.sin(a);
			const cos = -Math.cos(a);

			dir.set(cos * N.x + sin * B.x, cos * N.y + sin * B.y, cos * N.z + sin * B.z).normalize();

			positions.push(P.x + r * dir.x, P.y + r * dir.y, P.z + r * dir.z);
			normals.push(dir.x, dir.y, dir.z);
			uvs.push(t, j / radialSegments);
		}
	}

	for (let i = 1; i <= tubularSegments; i++) {
		for (let j = 1; j <= radialSegments; j++) {
			const a = (radialSegments + 1) * (i - 1) + (j - 1);
			const b = (radialSegments + 1) * i + (j - 1);
			const c = (radialSegments + 1) * i + j;
			const d = (radialSegments + 1) * (i - 1) + j;
			indices.push(a, b, d, b, c, d);
		}
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setIndex(indices);
	geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
	geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
	geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
	geometry.computeBoundingSphere();
	return geometry;
}

/** Curva suave passando por todos os pontos, com resolução de arco alta. */
export function path(...groups: THREE.Vector3[][]): THREE.CatmullRomCurve3 {
	const points: THREE.Vector3[] = [];
	for (const group of groups) {
		for (const p of group) {
			const last = points[points.length - 1];
			if (last && last.distanceToSquared(p) < 1e-6) continue;
			points.push(p.clone());
		}
	}
	const curve = new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5);
	curve.arcLengthDivisions = 600;
	return curve;
}

/** Segmento reto (subdividido para não distorcer o Catmull-Rom nas junções). */
export function line(a: THREE.Vector3, b: THREE.Vector3, segments = 4): THREE.Vector3[] {
	const points: THREE.Vector3[] = [];
	for (let i = 0; i <= segments; i++) points.push(a.clone().lerp(b, i / segments));
	return points;
}

/**
 * Arco de círculo no plano definido por dois eixos unitários.
 * `p(t) = center + radius * (cos(t) * uAxis + sin(t) * vAxis)`
 */
export function arc(
	center: THREE.Vector3,
	radius: number,
	uAxis: THREE.Vector3,
	vAxis: THREE.Vector3,
	a0: number,
	a1: number,
	segments = 20
): THREE.Vector3[] {
	const points: THREE.Vector3[] = [];
	for (let i = 0; i <= segments; i++) {
		const a = a0 + ((a1 - a0) * i) / segments;
		points.push(
			center
				.clone()
				.addScaledVector(uAxis, radius * Math.cos(a))
				.addScaledVector(vAxis, radius * Math.sin(a))
		);
	}
	return points;
}

/** Raio linear de r0 a r1. */
export const taper =
	(r0: number, r1: number): RadiusFn =>
	(t) =>
		r0 + (r1 - r0) * t;

/** Campana: quase cilíndrica no início, abrindo bruscamente no fim. */
export const flare =
	(r0: number, r1: number, power = 3.4): RadiusFn =>
	(t) =>
		r0 + (r1 - r0) * Math.pow(t, power);

/** Mantém um raio constante até `at`, depois abre como campana. */
export const straightThenFlare =
	(r0: number, r1: number, at: number, power = 3.4): RadiusFn =>
	(t) => {
		if (t <= at) return r0;
		return flare(r0, r1, power)((t - at) / (1 - at));
	};

/** Superfície de revolução a partir de um perfil [raio, altura]. */
export function lathe(profile: [number, number][], segments = 48): THREE.BufferGeometry {
	const points = profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 1e-4), y));
	const geometry = new THREE.LatheGeometry(points, segments);
	geometry.computeVertexNormals();
	return geometry;
}

/** Anel/virola posicionado sobre uma curva, alinhado à tangente. */
export function ferrule(
	curve: THREE.Curve<THREE.Vector3>,
	u: number,
	radius: number,
	length: number,
	material: THREE.Material,
	radialSegments = 28
): THREE.Mesh {
	const geometry = new THREE.CylinderGeometry(radius, radius, length, radialSegments, 1, false);
	const mesh = new THREE.Mesh(geometry, material);
	const position = curve.getPointAt(THREE.MathUtils.clamp(u, 0, 1));
	const tangent = curve.getTangentAt(THREE.MathUtils.clamp(u, 0, 1));
	mesh.position.copy(position);
	mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent.normalize());
	return mesh;
}

/** Cilindro entre dois pontos (hastes, eixos, escoras). */
export function rod(
	a: THREE.Vector3,
	b: THREE.Vector3,
	radius: number,
	material: THREE.Material,
	radialSegments = 16
): THREE.Mesh {
	const dir = b.clone().sub(a);
	const geometry = new THREE.CylinderGeometry(radius, radius, dir.length(), radialSegments, 1);
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.copy(a).addScaledVector(dir, 0.5);
	mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
	return mesh;
}

/** Curva de 180° ligando duas retas paralelas (as inúmeras "voltas" dos metais). */
export function crook(
	from: THREE.Vector3,
	to: THREE.Vector3,
	axis: THREE.Vector3,
	segments = 24
): THREE.Vector3[] {
	const center = from.clone().lerp(to, 0.5);
	const uAxis = from.clone().sub(center);
	const radius = uAxis.length();
	uAxis.normalize();
	const vAxis = axis.clone().normalize();
	return arc(center, radius, uAxis, vAxis, 0, Math.PI, segments);
}

/** Junta várias geometrias já posicionadas em uma malha só (menos draw calls). */
export function meshFrom(
	geometry: THREE.BufferGeometry,
	material: THREE.Material,
	name: string
): THREE.Mesh {
	const mesh = new THREE.Mesh(geometry, material);
	mesh.name = name;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	return mesh;
}

/** Bordo (aro) da campana. */
export function rim(
	center: THREE.Vector3,
	normal: THREE.Vector3,
	radius: number,
	tube: number,
	material: THREE.Material
): THREE.Mesh {
	const geometry = new THREE.TorusGeometry(radius, tube, 12, 72);
	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.copy(center);
	mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal.clone().normalize());
	return mesh;
}
