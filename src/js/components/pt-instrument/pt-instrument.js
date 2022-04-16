/**
 * The instrument web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host {
    width: 100%;
    height: 6rem;
    border-bottom: 1px solid gray;
  }
  </style>
`

customElements.define('pt-instrument',
  /**
   * Element representing pt-instrument.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-instrument.
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
      this.instrument = new Tone.Oscillator()
      this.dispatchEvent(new CustomEvent('instrument-change', { detail: { instrument: this.instrument } }))
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)
