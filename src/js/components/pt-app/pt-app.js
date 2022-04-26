/**
 * The pt-app web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: grid;
      grid-template-rows: 40rem 2rem 16rem;
      grid-template-columns: auto;
      grid-template-areas:  "editor"
                            "options"
                            "keyboard";
    }
    pt-keyboard {
      grid-area: keyboard;
      overflow-x: scroll;
    }
    pt-editor {
      grid-area: editor;
    }
    #options {
      grid-area: options;
    }
  </style>
  <pt-editor></pt-editor>
  <div id="options">
    <button id="play">Play</button>
    <button id="pause">Pause</button>
    <button id="stop">Stop</button>
  </div>
  <pt-keyboard></pt-keyboard>
`

customElements.define('pt-app',
  /**
   * Element representing a pt-app.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-app.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.playButton = this.shadowRoot.querySelector('#play')
      this.pauseButton = this.shadowRoot.querySelector('#pause')
      this.stopButton = this.shadowRoot.querySelector('#stop')

      this.editor = this.shadowRoot.querySelector('pt-editor')
      this.keyboard = this.shadowRoot.querySelector('pt-keyboard')
      this.roll = this.shadowRoot.querySelector('pt-piano-roll')
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      // Make the keyboard instrument be the same as the editors current instrument.
      this.keyboard.instrument = this.editor.instrument

      // This bugs out once in a while, but decreases latency.
      // Tone.setContext(new Tone.Context({ latencyHint: 'balanced' }))

      document.addEventListener('pointerdown', async () => await Tone.start(), { once: true })

      this.playButton.addEventListener('click', async () => {
        await Tone.start()
        Tone.Transport.setLoopPoints('0:0:0', '0:0:64')
        Tone.Transport.loop = true
        Tone.Transport.start()
      })

      this.pauseButton.addEventListener('click', async () => {
        Tone.Transport.pause()
      })

      this.stopButton.addEventListener('click', async () => {
        Tone.Transport.stop()
      })

      this.editor.addEventListener('instrument-change', event => {
        this.keyboard.instrument = this.editor.instrument
      })
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)
