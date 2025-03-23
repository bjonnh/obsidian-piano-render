import { Plugin } from 'obsidian';
import PianoKeys from '@jesperdj/pianokeys';
import verovio from 'verovio';

declare global {
	interface Window {
		VerovioToolkit?: any;
	}
}

export default class PianoRender extends Plugin {
	loadVerovio(): Promise<void> {
		if (window.VerovioToolkit) return Promise.resolve();

		return new Promise<void>((resolve, reject) => {
			try {
				window.VerovioToolkit = new verovio.toolkit();
				resolve();
			} catch (error) {
				verovio.module.onRuntimeInitialized = () => {
					try {
						window.VerovioToolkit = new verovio.toolkit();
						resolve();
					} catch (error) {
						reject(new Error("Sorry couldn't start verovio."));
					}
				};
			}
		});
	}

	async onload() {
		this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
	}

	async onLayoutReady():Promise<void> {
		this.registerMarkdownCodeBlockProcessor('piano', (source, el, _) => {
			const div = el.createDiv({ cls: 'piano' });
			const keyboard = new PianoKeys.Keyboard(div);
			const notes = source.split(' ').filter(Boolean);
			notes.forEach(note => {
				keyboard.fillKey(note);
			});
		});

		this.registerMarkdownCodeBlockProcessor('verovio', (source, el, _) => {
			const renderMei = () => {
				const svg = el.createDiv({cls: 'verovio'});

				const options = {
					scale: 100,
					adjustPageHeight: true,
					pageWidth: window.innerWidth * 0.9,
					pageHeight: window.innerHeight * 0.9,
					svgViewBox: true
				};

				svg.innerHTML = window.VerovioToolkit.renderData(source, options);
			};

			// If Verovio is already loaded, render immediately
			if (window.VerovioToolkit) {
				renderMei();
			} else {
				this.loadVerovio().then(renderMei);
			}
		})
	}

	onunload() {

	}
}
