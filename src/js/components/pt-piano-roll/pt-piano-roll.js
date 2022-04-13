/**
 * The piano-roll web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import * as Tone from 'tone'
import './components/pt-piano-roll-note'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      overflow-y: scroll;
    }
    #grid {
      background-size: 1rem 1rem;
      background-image:
        linear-gradient(to right, grey 1px, transparent 1px),
        linear-gradient(to bottom, grey 1px, transparent 1px);
      width: 64rem;
      height: 88rem;
      position: relative;
      outline: 1px grey solid;
    }
    #grid > div {
      position: relative;
      background-color: #404040;
      height: 1rem;
      width: 1rem;
    }
    #grid > div:hover {
      background-color: #d0d0d0;
    }
    .selected {
      background-color: #404040;
    }
  </style>
  <div id="grid">
  </div>
`

customElements.define('pt-piano-roll',
  /**
   * Element representing a pt-piano-roll.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-piano-roll.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.button = this.shadowRoot.querySelector('#play')
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      const synth = new Tone.PolySynth(Tone.Synth).toDestination()
      const grid = this.shadowRoot.querySelector('#grid')
      grid.addEventListener('mousedown', event => {
        if (event.button === 0) {
          // console.log(Math.trunc(event.offsetX / 16), Math.trunc(event.offsetY / 16))
          const note = document.createElement('pt-piano-roll-note')
          // Borde vara okej att göra så här? Frågan är om den är samma om man ändrar här...
          note.synth = synth
          note.setAttribute('note', 108 - Math.trunc(event.offsetY / 16))
          note.setAttribute('x', Math.trunc(event.offsetX / 16))
          note.setAttribute('y', Math.trunc(event.offsetY / 16))
          note.setAttribute('length', 1)
          grid.append(note)
        }
      })
      grid.addEventListener('contextmenu', event => event.preventDefault())
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)
