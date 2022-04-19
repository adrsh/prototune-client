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
      outline: 1px grey solid;
    }
    #grid {
      position: relative;
      width: 64rem;
      height: 88rem;
      background-image:
        repeating-linear-gradient(
          90deg,
          transparent 0.03125rem 3.96875rem,
          #b0b0b0 3.96875rem 4.03125rem
        ),
        repeating-linear-gradient(
          transparent 0.03125rem 0.96875rem,
          #e0e0e0 0.96875rem 1.03125rem
        ),
        repeating-linear-gradient(
          90deg,
          transparent 0.03125rem 0.96875rem,
          #e0e0e0 0.96875rem 1.03125rem
        ),
        repeating-linear-gradient(
          transparent 0rem 1rem,
          transparent 1rem 2rem,
          #f0f0f0 2rem 3rem,
          transparent 3rem 4rem,
          #f0f0f0 4rem 5rem,
          transparent 5rem 6rem,
          #f0f0f0 6rem 7rem,
          transparent 7rem 8rem,
          transparent 8rem 9rem,
          #f0f0f0 9rem 10rem,
          transparent 10rem 11rem,
          #f0f0f0 11rem 12rem
        );
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
      synth.volume.value = -6
      const grid = this.shadowRoot.querySelector('#grid')
      grid.addEventListener('pointerdown', event => {
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
      this.scrollTo(0, 512)
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)
