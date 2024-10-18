import { Plugin } from 'obsidian';
import PianoKeys from '@jesperdj/pianokeys';
import verovio from 'verovio';

declare global {
	interface Window {
		VerovioToolkit?: any;
	}
}

export default class PianoRender extends Plugin {
	async loadVerovio() {
		if (window.VerovioToolkit) return;

		return new Promise<void>((resolve, reject) => {
			verovio.module.onRuntimeInitialized = () => {
				try {
					window.VerovioToolkit = new verovio.toolkit();
					resolve();
				} catch (error) {
					reject(new Error("Sorry couldn't start verovio."));
				}
			};
		});
	}

	async onload() {
		await this.loadVerovio();

		this.registerMarkdownCodeBlockProcessor('piano', (source, el, _) => {
			const div = el.createDiv({ cls: 'piano' });
			const keyboard = new PianoKeys.Keyboard(div);
			const notes = source.split(' ').filter(Boolean);
			notes.forEach(note => {
				keyboard.fillKey(note);
			});
		});

		this.registerMarkdownCodeBlockProcessor('verovio', (source, el, _) => {
			const svg = el.createDiv({ cls: 'verovio' });

			const options = {
				scale: 100,
				adjustPageHeight: true,
				pageWidth: window.innerWidth * 0.9,
				pageHeight: window.innerHeight * 0.9,
				svgViewBox: true
			};

			svg.innerHTML = window.VerovioToolkit.renderData(source, options);
		})
	}

	onunload() {

	}
}
