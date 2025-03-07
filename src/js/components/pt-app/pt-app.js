/**
 * The pt-app web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import '../pt-editor'
import '../pt-keyboard'
import '../pt-playback'
import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
    }
    pt-keyboard {
      height: 16rem;
      overflow-x: scroll;
      transition: height 0.5s;
    }
    pt-editor {
      height: calc(100vh - 19rem);
      border-bottom: 1px solid gray;
      box-sizing: border-box;
      transition: height 0.5s;
    }
    pt-playback {
      height: 3rem;
      border-bottom: 1px solid gray;
      box-sizing: border-box;
    }
    .keyboard-hidden {
      height: 0;
    }
    .editor-large {
      height: calc(100vh - 3rem);
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
      this.playback = this.shadowRoot.querySelector('pt-playback')
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      // Make the keyboard instrument be the same as the editors current instrument.
      this.keyboard.instrument = this.editor.instrument

      document.addEventListener('pointerdown', async () => await Tone.start(), { once: true })

      this.editor.addEventListener('instrument-change', event => {
        this.keyboard.instrument = this.editor.instrument
      })

      this.playback.addEventListener('keyboard-toggle', event => {
        this.editor.classList.toggle('editor-large')
        this.keyboard.classList.toggle('keyboard-hidden')
      })
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)
