import { writable } from "svelte/store";

/**
 * Cola para o embed do Spotify.
 *
 * Por que o embed e não a Web API: a Web API exige OAuth e um servidor para
 * guardar o segredo, o `preview_url` dela foi desligado em 2024, e o Web
 * Playback SDK só toca para quem tem Premium. O embed não precisa de chave, de
 * backend nem de conta — este site é estático no Netlify — e é o único caminho
 * em que a reprodução é licenciada: quem não estiver logado ouve o trecho de
 * 30 segundos, quem estiver ouve a faixa inteira.
 *
 * Por que o `<iframe>` cru e não o IFrame API do Spotify: o `theme=0` é o que
 * troca o bloco colorido tirado da capa do disco por um cinza neutro, e ele só
 * existe como parâmetro de URL — o `createController` do IFrame API não repassa
 * a opção (testado). Como a página é preta e as fotos são quase todas em preto
 * e branco, o bloco colorido era a única coisa gritando na tela.
 *
 * O que se perde ao dispensar o SDK — mandar tocar e mandar parar — se resolve
 * sem ele: `play` vai por `postMessage`, e "parar" é desmontar o iframe, que é
 * mais garantido que pedir pausa.
 */

export const EMBED_ORIGIN = "https://open.spotify.com";

/** `theme=0`: cromo cinza neutro em vez da cor tirada da capa. */
export const embedUrl = (trackId: string) =>
	`${EMBED_ORIGIN}/embed/track/${trackId}?utm_source=generator&theme=0`;

/**
 * A foto cujo player está aberto agora, ou `null`.
 *
 * Serve a dois donos: cada player para se fechar quando outro abre — só um toca
 * por vez —, e a página para soltar as notas do sintetizador, porque dois sons
 * ao mesmo tempo não ajudam a escutar nem um nem outro.
 */
export const playingPlate = writable<string | null>(null);
