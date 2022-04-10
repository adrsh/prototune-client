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
      grid.addEventListener('click', event => {
        // console.log(Math.trunc(event.offsetX / 16), Math.trunc(event.offsetY / 16))
        const note = document.createElement('pt-piano-roll-note')
        note.synth = synth
        note.setAttribute('note', 108 - Math.trunc(event.offsetY / 16))
        note.setAttribute('x', Math.trunc(event.offsetX / 16))
        note.setAttribute('y', Math.trunc(event.offsetY / 16))
        grid.append(note)
      })
      /* grid.addEventListener('click', event => {
        console.log(Math.trunc(event.offsetX / 16), Math.trunc(event.offsetY / 16))
        const div = document.createElement('div')
        div.style.top = `${Math.trunc(event.offsetY / 16)}rem`
        div.style.left = `${Math.trunc(event.offsetX / 16)}rem`
        Tone.Transport.schedule((time) => synth.triggerAttack(Tone.Midi(60 - Math.trunc(event.offsetY / 16)), time), `0:0:${Math.trunc(event.offsetX / 16)}`)
        // Eftersom det just nu loopas varje 64 så triggas releasen vid 0 om den skulle gjorts vid 64
        Tone.Transport.schedule((time) => synth.triggerRelease(Tone.Midi(60 - Math.trunc(event.offsetY / 16)), time), `0:0:${(Math.trunc(event.offsetX / 16) + 1) % 64}`)
        grid.append(div)
      }) */
      /* for (let i = 0; i < 64; i++) {
        const div = document.createElement('div')
        div.id = i
        div.addEventListener('click', event => {
          event.target.toggleAttribute('selected')
          event.target.classList.toggle('selected')
          Tone.Transport.schedule((time) => synth.triggerAttack('C4', time), `0:0:${event.target.id}`)
          // Eftersom det just nu loopas varje 64 så triggas releasen vid 0 om den skulle gjorts vid 64
          Tone.Transport.schedule((time) => synth.triggerRelease('C4', time), `0:0:${(parseInt(event.target.id) + 1) % 64}`)
        })
        grid.appendChild(div)
      } */
      /* this.button.addEventListener('click', () => {
        Tone.start()
        Tone.Transport.setLoopPoints(0, '0:0:64')
        Tone.Transport.loop = true
        Tone.Transport.start()
      }) */
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)
