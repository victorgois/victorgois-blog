import type { Fingering, InstrumentId } from "./types";

/**
 * Como cada instrumento produz cada nota.
 *
 * Os três tocam a mesma nota de jeitos completamente diferentes — e é essa a
 * diferença que a página quer deixar visível: o trompete combina três pistões,
 * o trombone escorrega a vara entre sete posições e o sax abre e fecha furos.
 */

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_NAMES_PT = [
	"Dó",
	"Dó#",
	"Ré",
	"Ré#",
	"Mi",
	"Fá",
	"Fá#",
	"Sol",
	"Sol#",
	"Lá",
	"Lá#",
	"Si"
];

export const midiToFrequency = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

export function midiToName(midi: number, locale = "en") {
	const names = locale === "pt" ? NOTE_NAMES_PT : NOTE_NAMES;
	return `${names[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
}

export const isBlackKey = (midi: number) => [1, 3, 6, 8, 10].includes(((midi % 12) + 12) % 12);

/** Faixa tocável (em altura real, não escrita) de cada instrumento. */
export const RANGES: Record<InstrumentId, { low: number; high: number }> = {
	trumpet: { low: 52, high: 82 }, // Mi3 – Lá#5
	saxophone: { low: 49, high: 81 }, // Dó#3 – Lá5
	trombone: { low: 40, high: 70 } // Mi2 – Sib4
};

/** Transposição: quanto o som real difere da nota escrita, em semitons. */
export const TRANSPOSITION: Record<InstrumentId, number> = {
	trumpet: -2, // instrumento em Sib
	saxophone: -9, // instrumento em Mib
	trombone: 0 // lê em som real
};

/**
 * Altura escrita ↔ altura real.
 *
 * As duas convivem na página com papéis distintos: o áudio e a extensão são em
 * altura real, porque é o que sai do instrumento; o teclado e o mostrador são em
 * altura escrita, porque é a nota que explica a digitação. No trompete em Sib um
 * Dó escrito é solto e soa Sib — trocar as duas faz o mecanismo parecer errado.
 */
export const toWritten = (instrument: InstrumentId, sounding: number) =>
	sounding - TRANSPOSITION[instrument];

export const toSounding = (instrument: InstrumentId, written: number) =>
	written + TRANSPOSITION[instrument];

/** Extensão em altura escrita — a que o instrumentista lê na parte. */
export const writtenRange = (instrument: InstrumentId) => ({
	low: toWritten(instrument, RANGES[instrument].low),
	high: toWritten(instrument, RANGES[instrument].high)
});

/**
 * Digitação padrão do trompete, por nota *escrita*, de Fá#3 a Dó6.
 * Cada entrada lista os pistões apertados.
 */
const TRUMPET_VALVES: Record<number, number[]> = {
	54: [1, 2, 3],
	55: [1, 3],
	56: [2, 3],
	57: [1, 2],
	58: [1],
	59: [2],
	60: [],
	61: [1, 2, 3],
	62: [1, 3],
	63: [2, 3],
	64: [1, 2],
	65: [1],
	66: [2],
	67: [],
	68: [2, 3],
	69: [1, 2],
	70: [1],
	71: [2],
	72: [],
	73: [1, 2],
	74: [1],
	75: [2],
	76: [],
	77: [1],
	78: [2],
	79: [],
	80: [2, 3],
	81: [1, 2],
	82: [1],
	83: [2],
	84: []
};

/**
 * Deslocamento da vara em cada uma das 7 posições, em centímetros. Elas ficam
 * progressivamente mais largas porque a frequência cai por proporção.
 *
 * Vive aqui, e não em `trombone.ts`, para que o mostrador de mecanismo possa
 * lê-las sem arrastar o three.js junto.
 */
export const SLIDE_POSITIONS = [0, 8.0, 16.6, 25.8, 35.8, 46.6, 58.0];

/** Notas disponíveis na 1ª posição do trombone (série harmônica do Sib). */
const TROMBONE_PARTIALS = [34, 46, 53, 58, 62, 65, 70, 72, 74];

export function trombonePosition(sounding: number): number {
	for (let position = 1; position <= 7; position++) {
		if (TROMBONE_PARTIALS.includes(sounding + position - 1)) return position;
	}
	// Fora da série: aproxima pela posição mais provável.
	for (let position = 1; position <= 7; position++) {
		if (TROMBONE_PARTIALS.some((p) => Math.abs(p - (sounding + position - 1)) <= 1))
			return position;
	}
	return 1;
}

/** Converte uma nota real no dedilhado do instrumento escolhido. */
export function fingeringFor(instrument: InstrumentId, sounding: number): Fingering {
	const written = sounding - TRANSPOSITION[instrument];

	if (instrument === "trumpet") {
		const valves = TRUMPET_VALVES[written] ?? [];
		return {
			kind: "valves",
			valves: [valves.includes(1), valves.includes(2), valves.includes(3)]
		};
	}

	if (instrument === "trombone") {
		return { kind: "slide", position: trombonePosition(sounding) };
	}

	// Saxofone: a partir do Sib grave escrito (58), cada semitom abre um furo;
	// doze semitons acima repete a mesma digitação com a chave de oitava.
	const base = written - 58;
	const step = ((base % 12) + 12) % 12;
	return { kind: "keys", closed: 12 - step, octave: base >= 12 };
}

/** Digitação a partir da nota escrita — a que o instrumentista lê na parte. */
export const fingeringForWritten = (instrument: InstrumentId, written: number): Fingering =>
	fingeringFor(instrument, toSounding(instrument, written));

/** Descrição curta do dedilhado, para mostrar no HUD. */
export function fingeringLabel(instrument: InstrumentId, sounding: number, locale = "en"): string {
	const fingering = fingeringFor(instrument, sounding);
	if (fingering.kind === "valves") {
		const pressed = fingering.valves
			.map((on, index) => (on ? String(index + 1) : ""))
			.filter(Boolean);
		if (pressed.length === 0) return locale === "pt" ? "solto (0)" : "open (0)";
		return (locale === "pt" ? "pistões " : "valves ") + pressed.join("+");
	}
	if (fingering.kind === "slide") {
		return locale === "pt" ? `${fingering.position}ª posição` : `position ${fingering.position}`;
	}
	const octave = fingering.octave ? (locale === "pt" ? " + oitava" : " + octave") : "";
	return `${fingering.closed}${locale === "pt" ? " furos fechados" : " holes closed"}${octave}`;
}
