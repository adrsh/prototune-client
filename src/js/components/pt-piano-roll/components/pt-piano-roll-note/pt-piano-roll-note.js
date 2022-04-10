/**
 * The pt-piano-roll-note web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      position: absolute;
      background-color: #404040;
      height: 1rem;
      width: 1rem;
    }
  </style>
`

customElements.define('pt-piano-roll-note',
  /**
   * Element representing a pt-piano-roll-note.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-piano-roll-note.
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
      this.style.top = `${this.y}rem`
      this.style.left = `${this.x}rem`
      Tone.Transport.schedule((time) => this.synth.triggerAttack(Tone.Midi(this.note), time), `0:0:${this.x}`)
      // Eftersom det just nu loopas varje 64 så triggas releasen vid 0 om den skulle gjorts vid 64
      Tone.Transport.schedule((time) => this.synth.triggerRelease(Tone.Midi(this.note), time), `0:0:${(parseInt(this.x) + 1) % 64}`)
      this.addEventListener('click', event => {
        // Stops grid underneath from getting triggered by the click.
        event.stopPropagation()
      })
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }

    /**
     * Returns element attributes to observe.
     *
     * @returns {string[]} An array of attributes to observe.
     */
    static get observedAttributes () {
      return ['note', 'x', 'y']
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'note') {
        this.note = newValue
        // this.setAttribute('y', )
      } else if (name === 'x') {
        this.x = newValue
        this.style.left = `${this.x}rem`
      } else if (name === 'y') {
        this.y = newValue
        this.style.top = `${this.y}rem`
      }
    }
  }
)
