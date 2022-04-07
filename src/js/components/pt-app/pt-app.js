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
      grid-template-rows: 32rem 16rem;
      grid-template-areas: "." "keyboard";
    }
    pt-keyboard {
      grid-area: keyboard;
    }
  </style>
  <!-- <div id="options">
    <label for="instrument-select">Instrument</label>
    <select name="instruments" id="instrument-select">
      <option value="piano">Piano</option>
      <option value="casio">Casio</option>
      <option value="amsynth">AMSynth</option>
      <option value="fmsynth">FMSynth</option>
    </select>
  </div> -->
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
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      this.ws = new WebSocket('ws://localhost:8080')

      // Add listeners for message handling only if the connection is open.
      this.ws.addEventListener('open', () => {
        this.ws.addEventListener('message', event => this.#handleMessage(event.data))

        this.keyboard = this.shadowRoot.querySelector('pt-keyboard')
        this.keyboard.addEventListener('note-play', event => this.#sendMessage({ note: event.detail.note, action: 'play' }))
        this.keyboard.addEventListener('note-stop', event => this.#sendMessage({ note: event.detail.note, action: 'stop' }))
      })
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }

    /**
     * Handles messages from Websocket server
     *
     * @param {Blob} data Data to be handled.
     */
    async #handleMessage (data) {
      const message = JSON.parse(await data.text())
      if (message.action === 'play') {
        this.keyboard.dispatchEvent(new CustomEvent('msg-play', { detail: { note: message.note } }))
      } else if (message.action === 'stop') {
        this.keyboard.dispatchEvent(new CustomEvent('msg-stop', { detail: { note: message.note } }))
      }
    }

    /**
     * Sends data to Websocket server.
     * @param {Object} data Data to be sent.
     */
    #sendMessage (data) {
      this.ws.send(JSON.stringify(data))
    }
  }
)
