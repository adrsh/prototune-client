/**
 * The pt-editor web component module.
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
    grid-template-rows: 40rem;
    grid-template-columns: minmax(16rem, 24rem) minmax(48rem, auto);
    grid-template-areas:  "instruments piano-roll";
    border-bottom: 1px solid gray;
  }
  #roll {
    overflow-y: scroll;
    grid-area: piano-roll;
    border-bottom: 1px solid gray;
  }
  button {
    height: 4rem;
    font-size: 3rem;
    background-color: #f8f8f8;
    border: 0px;
  }
  button:hover {
    color: gray;
    cursor: pointer;
  }
  #list {
    display: flex;
    flex-direction: column;
    grid-area: instruments;
    border-right: 1px solid gray;
  }
  </style>
  <div id="list">
    <button>+</button>
  </div>
  <div id="roll">
  </div>
`

customElements.define('pt-editor',
  /**
   * Element representing pt-editor.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-editor.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.list = this.shadowRoot.querySelector('#list')
      this.rollHolder = this.shadowRoot.querySelector('#roll')
      this.button = this.shadowRoot.querySelector('button')
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      this.button.addEventListener('click', event => {
        event.preventDefault()
        this.#newInstrument()
      })
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }

    /**
     * Add a new instrument to the list.
     */
    #newInstrument () {
      const instrument = document.createElement('pt-instrument')
      const roll = document.createElement('pt-piano-roll')

      // Add Websocket to piano roll
      roll.ws = this.ws
      instrument.ws = this.ws

      instrument.roll = roll
      roll.instrument = instrument.instrument

      instrument.addEventListener('instrument-select', event => {
        this.instrument = event.target.instrument
        this.roll = event.target.roll
        this.rollHolder.replaceChildren(event.target.roll)
        console.log(this.instrument)
      })
      this.list.insertBefore(instrument, this.button)

      this.rollHolder.replaceChildren(roll)
    }
  }
)
