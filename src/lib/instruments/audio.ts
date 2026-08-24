import type * as ToneNS from "tone";
import type { InstrumentId } from "./types";
import { midiToFrequency } from "./fingerings";

type ToneModule = typeof ToneNS;

/**
 * Síntese dos três timbres com Tone.js.
 *
 * Nenhum sample é baixado: cada instrumento é um MonoSynth (sopros são
 * monofônicos de verdade — não dá para tocar acorde) com filtro ressonante,
 * uma camada de ruído para o sopro e um pouco de saturação. As diferenças de
 * espectro entre eles são as diferenças acústicas reais: o trompete é brilhante
 * e cheio de harmônicos agudos, o trombone é a mesma família uma oitava abaixo
 * e com ataque mais lento, o sax tem a aspereza de palheta e mais ruído de ar.
 */

interface VoiceConfig {
	oscillator: Record<string, unknown>;
	envelope: Record<string, number>;
	filter: Record<string, unknown>;
	filterEnvelope: Record<string, number>;
	portamento: number;
	drive: number;
	vibrato: { frequency: number; depth: number };
	breath: { frequency: number; Q: number; gain: number };
	chorus: boolean;
	gain: number;
}

const VOICES: Record<InstrumentId, VoiceConfig> = {
	trumpet: {
		oscillator: { type: "sawtooth" },
		envelope: { attack: 0.035, decay: 0.18, sustain: 0.82, release: 0.16 },
		filter: { type: "lowpass", rolloff: -12, Q: 2.2 },
		filterEnvelope: {
			attack: 0.05,
			decay: 0.3,
			sustain: 0.55,
			release: 0.4,
			baseFrequency: 420,
			octaves: 3.4,
			exponent: 1.6
		},
		portamento: 0.008,
		drive: 0.16,
		vibrato: { frequency: 5.6, depth: 0.05 },
		breath: { frequency: 2800, Q: 0.8, gain: 0.05 },
		chorus: false,
		gain: 0.62
	},
	trombone: {
		oscillator: { type: "sawtooth" },
		envelope: { attack: 0.06, decay: 0.26, sustain: 0.86, release: 0.24 },
		filter: { type: "lowpass", rolloff: -12, Q: 1.4 },
		filterEnvelope: {
			attack: 0.09,
			decay: 0.42,
			sustain: 0.5,
			release: 0.5,
			baseFrequency: 180,
			octaves: 2.8,
			exponent: 1.8
		},
		// Portamento longo: é o glissando que só o trombone faz de verdade.
		portamento: 0.075,
		drive: 0.09,
		vibrato: { frequency: 4.8, depth: 0.03 },
		breath: { frequency: 1500, Q: 0.7, gain: 0.045 },
		chorus: false,
		gain: 0.68
	},
	saxophone: {
		oscillator: { type: "fatsawtooth", count: 3, spread: 18 },
		envelope: { attack: 0.028, decay: 0.22, sustain: 0.78, release: 0.2 },
		filter: { type: "lowpass", rolloff: -24, Q: 4.5 },
		filterEnvelope: {
			attack: 0.04,
			decay: 0.32,
			sustain: 0.62,
			release: 0.35,
			baseFrequency: 320,
			octaves: 2.7,
			exponent: 1.2
		},
		portamento: 0.012,
		drive: 0.24,
		vibrato: { frequency: 5.2, depth: 0.08 },
		breath: { frequency: 3200, Q: 0.6, gain: 0.09 },
		chorus: true,
		gain: 0.55
	}
};

class Voice {
	private synth: ToneNS.MonoSynth;
	private breathEnvelope: ToneNS.AmplitudeEnvelope;
	private noise: ToneNS.Noise;
	private output: ToneNS.Gain;
	private stack: number[] = [];
	readonly config: VoiceConfig;

	constructor(Tone: ToneModule, config: VoiceConfig, destination: ToneNS.InputNode) {
		this.config = config;
		this.output = new Tone.Gain(0);

		const nodes: ToneNS.ToneAudioNode[] = [];
		if (config.chorus)
			nodes.push(new Tone.Chorus({ frequency: 1.4, depth: 0.4, wet: 0.25 }).start());
		nodes.push(new Tone.Distortion({ distortion: config.drive, wet: 0.35 }));
		nodes.push(new Tone.Vibrato(config.vibrato));

		let head: ToneNS.InputNode = this.output;
		for (let i = nodes.length - 1; i >= 0; i--) {
			nodes[i].connect(head as ToneNS.InputNode);
			head = nodes[i];
		}
		this.output.connect(destination);

		this.synth = new Tone.MonoSynth({
			oscillator: config.oscillator as never,
			envelope: config.envelope as never,
			filter: config.filter as never,
			filterEnvelope: config.filterEnvelope as never,
			portamento: config.portamento,
			volume: -6
		});
		this.synth.connect(head as ToneNS.InputNode);

		// Camada de sopro: ruído rosa filtrado, com a mesma envoltória da nota.
		this.breathEnvelope = new Tone.AmplitudeEnvelope({
			attack: config.envelope.attack * 0.6,
			decay: 0.2,
			sustain: 0.5,
			release: config.envelope.release
		});
		const breathFilter = new Tone.Filter({
			type: "bandpass",
			frequency: config.breath.frequency,
			Q: config.breath.Q
		});
		const breathGain = new Tone.Gain(config.breath.gain);
		this.noise = new Tone.Noise("pink");
		this.noise.chain(breathFilter, this.breathEnvelope, breathGain);
		breathGain.connect(head as ToneNS.InputNode);
	}

	startNoise() {
		if (this.noise.state !== "started") this.noise.start();
	}

	setActive(active: boolean, rampTime = 0.08) {
		this.output.gain.rampTo(active ? this.config.gain : 0, rampTime);
		if (!active) this.allOff();
	}

	noteOn(midi: number, velocity = 0.8) {
		const frequency = midiToFrequency(midi);
		this.stack = this.stack.filter((note) => note !== midi);
		const legato = this.stack.length > 0;
		this.stack.push(midi);

		if (legato) {
			// Sopros são monofônicos: a nota nova toma o lugar da anterior sem
			// reataque, exatamente como uma ligadura.
			this.synth.setNote(frequency);
		} else {
			this.synth.triggerAttack(frequency, undefined, velocity);
			this.breathEnvelope.triggerAttack();
		}
	}

	noteOff(midi: number) {
		this.stack = this.stack.filter((note) => note !== midi);
		if (this.stack.length > 0) {
			this.synth.setNote(midiToFrequency(this.stack[this.stack.length - 1]));
			return;
		}
		this.synth.triggerRelease();
		this.breathEnvelope.triggerRelease();
	}

	allOff() {
		this.stack = [];
		this.synth.triggerRelease();
		this.breathEnvelope.triggerRelease();
	}

	dispose() {
		this.noise.stop();
		this.synth.dispose();
		this.noise.dispose();
		this.breathEnvelope.dispose();
		this.output.dispose();
	}
}

export class InstrumentAudio {
	private Tone: ToneModule;
	private voices: Record<InstrumentId, Voice>;
	private master: ToneNS.Gain;
	current: InstrumentId = "trumpet";
	readonly waveform: ToneNS.Analyser;
	readonly spectrum: ToneNS.Analyser;

	constructor(Tone: ToneModule) {
		this.Tone = Tone;
		this.master = new Tone.Gain(0.9);
		const reverb = new Tone.Reverb({ decay: 2.2, preDelay: 0.02, wet: 0.2 });
		const limiter = new Tone.Limiter(-2);
		this.waveform = new Tone.Analyser("waveform", 1024);
		this.spectrum = new Tone.Analyser("fft", 128);

		this.master.chain(reverb, limiter, Tone.getDestination());
		limiter.connect(this.waveform);
		limiter.connect(this.spectrum);

		this.voices = {
			trumpet: new Voice(Tone, VOICES.trumpet, this.master),
			saxophone: new Voice(Tone, VOICES.saxophone, this.master),
			trombone: new Voice(Tone, VOICES.trombone, this.master)
		};
	}

	/** Precisa ser chamado a partir de um gesto do usuário. */
	async unlock() {
		await this.Tone.start();
		Object.values(this.voices).forEach((voice) => voice.startNoise());
		this.setInstrument(this.current);
	}

	get running() {
		return this.Tone.getContext().state === "running";
	}

	setInstrument(id: InstrumentId) {
		this.current = id;
		(Object.keys(this.voices) as InstrumentId[]).forEach((key) => {
			this.voices[key].setActive(key === id);
		});
	}

	setVolume(value: number) {
		this.master.gain.rampTo(value, 0.05);
	}

	noteOn(midi: number, velocity = 0.8) {
		this.voices[this.current].noteOn(midi, velocity);
	}

	noteOff(midi: number) {
		this.voices[this.current].noteOff(midi);
	}

	allOff() {
		Object.values(this.voices).forEach((voice) => voice.allOff());
	}

	dispose() {
		Object.values(this.voices).forEach((voice) => voice.dispose());
		this.master.dispose();
		this.waveform.dispose();
		this.spectrum.dispose();
	}
}

/** Carrega o Tone.js sob demanda (ele toca em `window`, então nada de SSR). */
export async function createAudio(): Promise<InstrumentAudio> {
	const Tone = await import("tone");
	return new InstrumentAudio(Tone as unknown as ToneModule);
}
