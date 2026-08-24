/**
 * Entrada MIDI via Web MIDI API.
 *
 * Só o Chrome/Edge (e derivados) implementam `requestMIDIAccess`; em qualquer
 * outro navegador a página continua funcionando pelo teclado virtual.
 */

export interface MidiDevice {
	id: string;
	name: string;
}

export interface MidiHandlers {
	onNoteOn(midi: number, velocity: number): void;
	onNoteOff(midi: number): void;
	onDevices(devices: MidiDevice[]): void;
}

export type MidiStatus = "unsupported" | "denied" | "connected";

export interface MidiSession {
	status: MidiStatus;
	devices: MidiDevice[];
	dispose(): void;
}

export const midiSupported = () =>
	typeof navigator !== "undefined" && typeof navigator.requestMIDIAccess === "function";

export async function connectMidi(handlers: MidiHandlers): Promise<MidiSession> {
	if (!midiSupported()) {
		return { status: "unsupported", devices: [], dispose() {} };
	}

	let access: MIDIAccess;
	try {
		access = await navigator.requestMIDIAccess({ sysex: false });
	} catch {
		return { status: "denied", devices: [], dispose() {} };
	}

	const onMessage = (event: MIDIMessageEvent) => {
		const data = event.data;
		if (!data || data.length < 3) return;
		const command = data[0] & 0xf0;
		const note = data[1];
		const velocity = data[2];

		if (command === 0x90 && velocity > 0) handlers.onNoteOn(note, velocity / 127);
		else if (command === 0x80 || (command === 0x90 && velocity === 0)) handlers.onNoteOff(note);
	};

	const bind = () => {
		const devices: MidiDevice[] = [];
		access.inputs.forEach((input) => {
			input.onmidimessage = onMessage;
			devices.push({ id: input.id, name: input.name ?? "MIDI" });
		});
		handlers.onDevices(devices);
		return devices;
	};

	const devices = bind();
	access.onstatechange = () => bind();

	return {
		status: "connected",
		devices,
		dispose() {
			access.onstatechange = null;
			access.inputs.forEach((input) => (input.onmidimessage = null));
		}
	};
}

/** Mapa teclado do computador → semitons, no layout de piano do trackpad. */
export const KEYBOARD_MAP: Record<string, number> = {
	KeyA: 0,
	KeyW: 1,
	KeyS: 2,
	KeyE: 3,
	KeyD: 4,
	KeyF: 5,
	KeyT: 6,
	KeyG: 7,
	KeyY: 8,
	KeyH: 9,
	KeyU: 10,
	KeyJ: 11,
	KeyK: 12,
	KeyO: 13,
	KeyL: 14,
	KeyP: 15,
	Semicolon: 16,
	Quote: 17
};
