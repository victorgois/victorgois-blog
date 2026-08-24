import * as THREE from "three";

/**
 * Paleta de materiais. Metais dependem de um environment map para parecerem
 * metal — sem `scene.environment` um MeshStandardMaterial com metalness 1 fica
 * praticamente preto.
 */

export const brass = new THREE.MeshStandardMaterial({
	color: 0xc8952f,
	metalness: 1,
	roughness: 0.24,
	name: "brass"
});

/** Latão do interior da campana: mais escuro, visto por dentro. */
export const brassInner = new THREE.MeshStandardMaterial({
	color: 0x8a6420,
	metalness: 1,
	roughness: 0.42,
	side: THREE.DoubleSide,
	name: "brassInner"
});

export const brassBell = new THREE.MeshStandardMaterial({
	color: 0xc8952f,
	metalness: 1,
	roughness: 0.2,
	side: THREE.DoubleSide,
	name: "brassBell"
});

export const goldLacquer = new THREE.MeshPhysicalMaterial({
	color: 0xd8a53c,
	metalness: 1,
	roughness: 0.16,
	clearcoat: 0.6,
	clearcoatRoughness: 0.12,
	name: "goldLacquer"
});

export const nickel = new THREE.MeshStandardMaterial({
	color: 0xd7dade,
	metalness: 1,
	roughness: 0.14,
	name: "nickel"
});

export const steel = new THREE.MeshStandardMaterial({
	color: 0x9aa1a8,
	metalness: 1,
	roughness: 0.3,
	name: "steel"
});

/** Madrepérola dos botões de pistão e das chaves do sax. */
export const pearl = new THREE.MeshPhysicalMaterial({
	color: 0xf2ece2,
	metalness: 0.1,
	roughness: 0.18,
	clearcoat: 1,
	clearcoatRoughness: 0.05,
	iridescence: 0.9,
	iridescenceIOR: 1.5,
	iridescenceThicknessRange: [180, 520],
	name: "pearl"
});

/** Ebonite do bocal do sax. */
export const ebonite = new THREE.MeshPhysicalMaterial({
	color: 0x121212,
	metalness: 0,
	roughness: 0.32,
	clearcoat: 0.5,
	name: "ebonite"
});

export const cane = new THREE.MeshPhysicalMaterial({
	color: 0xd9c08c,
	metalness: 0,
	roughness: 0.55,
	sheen: 0.4,
	sheenColor: new THREE.Color(0xfff0cc),
	name: "cane"
});

export const cork = new THREE.MeshStandardMaterial({
	color: 0xb08245,
	metalness: 0,
	roughness: 0.95,
	name: "cork"
});

export const felt = new THREE.MeshStandardMaterial({
	color: 0x8c1f28,
	metalness: 0,
	roughness: 1,
	name: "felt"
});

export const pad = new THREE.MeshStandardMaterial({
	color: 0xc9b18b,
	metalness: 0,
	roughness: 0.85,
	name: "pad"
});

export const materials = {
	brass,
	brassInner,
	brassBell,
	goldLacquer,
	nickel,
	steel,
	pearl,
	ebonite,
	cane,
	cork,
	felt,
	pad
};

export type MaterialName = keyof typeof materials;

/** Clona todos os materiais — usado para o realce da peça selecionada. */
export function withEmissive(material: THREE.Material, color: number, intensity: number) {
	const clone = material.clone() as THREE.MeshStandardMaterial;
	clone.emissive = new THREE.Color(color);
	clone.emissiveIntensity = intensity;
	return clone;
}

export function disposeMaterials() {
	Object.values(materials).forEach((material) => material.dispose());
}
