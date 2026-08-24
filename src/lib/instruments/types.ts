import type * as THREE from "three";

export type InstrumentId = "trumpet" | "saxophone" | "trombone";

/** Uma peça desmontável do instrumento. */
export interface InstrumentPart {
	id: string;
	/** Grupo com as malhas da peça, já posicionadas no espaço do instrumento. */
	group: THREE.Group;
	/** Deslocamento aplicado quando a "explosão" está em 100%. */
	explode: THREE.Vector3;
	/** Ordem de desmontagem — peças com ordem maior saem depois. */
	order: number;
}

/**
 * Como o instrumento muda de altura. Cada família resolve isso de um jeito
 * diferente, e é justamente essa a diferença que a página quer mostrar.
 */
export type Fingering =
	/** Metais com pistões: cada pistão insere um trecho extra de tubo. */
	| { kind: "valves"; valves: [boolean, boolean, boolean] }
	/** Trombone: a vara alonga o tubo continuamente (posições 1 a 7). */
	| { kind: "slide"; position: number }
	/** Madeiras: chaves fecham furos, encurtando a coluna de ar. */
	| { kind: "keys"; closed: number; octave: boolean };

export interface InstrumentModel {
	id: InstrumentId;
	root: THREE.Group;
	parts: InstrumentPart[];
	/** Dimensões do instrumento montado, usadas para enquadrar a câmera. */
	size: THREE.Vector3;
	/** Aplica (ou solta, com `null`) o dedilhado da nota tocada. */
	applyFingering(fingering: Fingering | null): void;
	/** Interpolação suave das animações mecânicas. */
	update(delta: number): void;
	dispose(): void;
}
