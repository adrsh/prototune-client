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
  }
  pt-piano-roll {
    grid-area: piano-roll;
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
  }
  </style>
  <div id="list">
    <button>+</button>
  </div>
  <pt-piano-roll></pt-piano-roll>
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

      this.button = this.shadowRoot.querySelector('button')
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      this.button.addEventListener('click', event => {
        event.preventDefault()
        this.#addInstrument()
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
    #addInstrument () {
      const instrument = document.createElement('pt-instrument')
      instrument.addEventListener('instrument-change', event => {
        this.instrument = event.detail.instrument
        console.log(this.instrument)
      })
      this.shadowRoot.insertBefore(instrument, this.button)
    }
  }
)
