/**
 * The instrument selection web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host {
    display: flex;
    flex-direction: column;
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
  </style>
  <button>+</button>
`

customElements.define('pt-instruments',
  /**
   * Element representing pt-instruments.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-instruments.
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
      console.log('adding instrument')
      const instrument = document.createElement('pt-instrument')
      instrument.addEventListener('instrument-change', event => console.log(event.detail.instrument))
      this.shadowRoot.insertBefore(instrument, this.button)
    }
  }
)
