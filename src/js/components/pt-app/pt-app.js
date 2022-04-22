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
      grid-template-columns: minmax(16rem, 24rem) minmax(48rem, auto);
      grid-template-areas:  "instruments piano-roll"
                            "options options"
                            "keyboard keyboard";
    }
    pt-keyboard {
      grid-area: keyboard;
      overflow-x: scroll;
    }
    pt-piano-roll {
      grid-area: piano-roll;
    }
    #options {
      grid-area: options;
    }
  </style>
  <pt-editor></pt-editor>
  <pt-piano-roll></pt-piano-roll>
  <div id="options">
    <!-- <label for="instrument-select">Instrument</label>
    <select name="instruments" id="instrument-select">
      <option value="piano">Piano</option>
      <option value="casio">Casio</option>
      <option value="amsynth">AMSynth</option>
      <option value="fmsynth">FMSynth</option>
    </select> -->
    <button id="play">Play</button>
  </div>
  <pt-keyboard></pt-keyboard>
`

customElements.define('pt-app',
  /**
   * Element representing a pt-app.
   */
  class extends HTMLElement {
    #synth
    /**
     * Constructor for pt-app.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.button = this.shadowRoot.querySelector('#play')

      this.editor = this.shadowRoot.querySelector('pt-editor')
      this.keyboard = this.shadowRoot.querySelector('pt-keyboard')
      this.roll = this.shadowRoot.querySelector('pt-piano-roll')
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      // This makes it possible to get keypresses on entire app.
      this.setAttribute('tabindex', 0)

      this.ws = new WebSocket('ws://localhost:8080')

      /**
       * Make the message get parsed as JSON. Kind of like a middleware.
       *
       * @param {Event} event Event to be handled.
       */
      this.ws.onmessage = async function (event) {
        event.message = event.data.text().then(JSON.parse)
      }

      this.editor.ws = this.ws
      this.keyboard.ws = this.ws
      this.roll.ws = this.ws

      // Make the keyboard instrument be the same as the editors current instrument.
      this.keyboard.instrument = this.editor.instrument

      // This bugs out once in a while, but decreases latency.
      // Tone.setContext(new Tone.Context({ latencyHint: 'balanced' }))

      this.button.addEventListener('click', async () => {
        await Tone.start()
        Tone.Transport.setLoopPoints('0:0:0', '0:0:64')
        Tone.Transport.loop = true
        Tone.Transport.start()
      })
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)
