import * as THREE from "three";
import type { InstrumentPart } from "./types";

/**
 * Acumula peças nomeadas dentro de um grupo raiz e, no fim, centraliza o
 * instrumento na origem sem perder a posição-base de cada peça (a vista
 * explodida precisa dela).
 */
export class InstrumentBuilder {
	root = new THREE.Group();
	parts: InstrumentPart[] = [];

	part(id: string, explode: THREE.Vector3, order: number): THREE.Group {
		const group = new THREE.Group();
		group.name = id;
		group.userData.partId = id;
		this.root.add(group);
		this.parts.push({ id, group, explode, order });
		return group;
	}

	/**
	 * Centraliza tudo na origem, grava a posição-base de cada peça e devolve as
	 * dimensões do instrumento montado (o viewer usa isso para enquadrar).
	 */
	center(): THREE.Vector3 {
		const box = new THREE.Box3().setFromObject(this.root);
		const offset = box.getCenter(new THREE.Vector3()).negate();
		for (const part of this.parts) {
			part.group.position.add(offset);
			part.group.userData.base = part.group.position.clone();
		}
		return box.getSize(new THREE.Vector3());
	}

	dispose() {
		this.root.traverse((object) => {
			const mesh = object as THREE.Mesh;
			if (mesh.isMesh) mesh.geometry.dispose();
		});
	}
}

/** Interpolação exponencial estável em qualquer frame rate. */
export function damp(current: number, target: number, lambda: number, delta: number) {
	return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * delta));
}
