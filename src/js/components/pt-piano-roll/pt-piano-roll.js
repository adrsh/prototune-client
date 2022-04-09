/**
 * The piano-roll web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    #grid {
      background-size: 1rem 1rem;
      background-image:
        linear-gradient(to right, grey 1px, transparent 1px),
        linear-gradient(to bottom, grey 1px, transparent 1px);
      display: grid;
      grid-template-columns: repeat(64, 1rem);
      width: 64rem;
    }
    #grid > div {
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
  <button id="play">Play</button>
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
      /* Tone.Transport.schedule((time) => synth.triggerAttack('C3', time), '0:0:0')
      Tone.Transport.schedule((time) => synth.triggerRelease('C3', time), '0:1:0')
      Tone.Transport.schedule((time) => synth.triggerAttack('C3', time), '0:1:0')
      Tone.Transport.schedule((time) => synth.triggerRelease('C3', time), '0:2:0')
      Tone.Transport.schedule((time) => synth.triggerAttack('C3', time), '0:2:0')
      Tone.Transport.schedule((time) => synth.triggerRelease('C3', time), '0:2:1')
      Tone.Transport.schedule((time) => synth.triggerAttack('C3', time), '0:3:0')
      Tone.Transport.schedule((time) => synth.triggerRelease('C3', time), '0:3:1') */
      const grid = this.shadowRoot.querySelector('#grid')
      for (let i = 0; i < 64; i++) {
        const div = document.createElement('div')
        div.id = i
        div.addEventListener('click', event => {
          event.target.classList.toggle('selected')
          Tone.Transport.schedule((time) => synth.triggerAttack('C4', time), `0:0:${event.target.id}`)
          Tone.Transport.schedule((time) => synth.triggerRelease('C4', time), `0:0:${parseInt(event.target.id) + 1}`)
        })
        grid.appendChild(div)
      }
      this.button.addEventListener('click', () => {
        Tone.start()
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
