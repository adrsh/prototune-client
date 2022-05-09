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
      grid-template-rows: 40rem 3rem 16rem;
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
    pt-playback {
      grid-area: options;
      border-bottom: 1px solid gray;
    }
  </style>
  <pt-editor></pt-editor>
  <pt-playback></pt-playback>
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

      this.editor = this.shadowRoot.querySelector('pt-editor')
      this.keyboard = this.shadowRoot.querySelector('pt-keyboard')
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      // Make the keyboard instrument be the same as the editors current instrument.
      this.keyboard.instrument = this.editor.instrument

      // This bugs out once in a while, but decreases latency.
      // Tone.setContext(new Tone.Context({ latencyHint: 'balanced' }))

      // Seems like the transport time floating point gets less variance with this, which in turn fixes double scheduling
      Tone.Transport.PPQ = 256

      document.addEventListener('pointerdown', async () => await Tone.start(), { once: true })

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
