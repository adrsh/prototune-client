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
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 5rem;
    border-bottom: 1px solid gray;
  }
  #instrument-select {
    width: 80%;
    height: 2rem;
    font-size: 1.2rem;
    border: 1px solid #f0f0f0;
  }
  </style>
  <select name="instruments" id="instrument-select">
    <option value="piano">Piano</option>
    <option value="casio">Casio</option>
    <option value="amsynth">AMSynth</option>
    <option value="fmsynth">FMSynth</option>
  </select>
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

      this.selector = this.shadowRoot.querySelector('#instrument-select')

      this.selector.addEventListener('change', event => this.setAttribute('instrument', event.target.value))

      this.addEventListener('click', () => this.dispatchEvent(new CustomEvent('instrument-select')))
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
      this.roll.remove()
    }

    /**
     * Returns element attributes to observe.
     *
     * @returns {string[]} An array of attributes to observe.
     */
    static get observedAttributes () {
      return ['instrument', 'uuid']
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'instrument') {
        this.#setInstrument(newValue)
        this.roll.instrument = this.instrument
        // Enkel lösning på problemet, men känns lite fel...
        this.roll.querySelectorAll('pt-piano-roll-note').forEach(element => (element.instrument = this.instrument))
        this.selector.querySelectorAll('option[selected]').forEach(element => element.toggleAttribute('selected'))
        this.selector.querySelector(`option[value="${newValue}"]`).toggleAttribute('selected')
      } else if (name === 'uuid') {
        this.uuid = newValue
      }
    }

    /**
     * Changes instrument.
     *
     * @param {string} instrument Instrument to be played.
     */
    #setInstrument (instrument) {
      if (this.instrument) {
        // this.instrument.dispose()
      }
      if (instrument === 'casio') {
        this.instrument = new Tone.Sampler({
          urls: {
            A3: 'A1.mp3',
            'A#3': 'As1.mp3',
            B3: 'B1.mp3',
            'G#3': 'Gs1.mp3',
            A4: 'A2.mp3',
            C4: 'C2.mp3',
            'C#4': 'Cs2.mp3',
            D4: 'D2.mp3',
            'D#4': 'Ds2.mp3',
            E4: 'E2.mp3',
            F4: 'F2.mp3',
            'F#4': 'Fs2.mp3',
            G4: 'G2.mp3'
          },
          release: 1,
          baseUrl: 'https://tonejs.github.io/audio/casio/'
        }).toDestination()
      } else if (instrument === 'piano') {
        this.instrument = new Tone.Sampler({
          urls: {
            A0: 'A0.mp3',
            C1: 'C1.mp3',
            'D#1': 'Ds1.mp3',
            'F#1': 'Fs1.mp3',
            A1: 'A1.mp3',
            C2: 'C2.mp3',
            'D#2': 'Ds2.mp3',
            'F#2': 'Fs2.mp3',
            A2: 'A2.mp3',
            C3: 'C3.mp3',
            'D#3': 'Ds3.mp3',
            'F#3': 'Fs3.mp3',
            A3: 'A3.mp3',
            C4: 'C4.mp3',
            'D#4': 'Ds4.mp3',
            'F#4': 'Fs4.mp3',
            A4: 'A4.mp3',
            C5: 'C5.mp3',
            'D#5': 'Ds5.mp3',
            'F#5': 'Fs5.mp3',
            A5: 'A5.mp3',
            C6: 'C6.mp3',
            'D#6': 'Ds6.mp3',
            'F#6': 'Fs6.mp3',
            A6: 'A6.mp3',
            C7: 'C7.mp3',
            'D#7': 'Ds7.mp3',
            'F#7': 'Fs7.mp3',
            A7: 'A7.mp3',
            C8: 'C8.mp3'
          },
          release: 1,
          baseUrl: 'https://tonejs.github.io/audio/salamander/'
        }).toDestination()
      } else if (instrument === 'amsynth') {
        this.instrument = new Tone.PolySynth(Tone.AMSynth).toDestination()
      } else if (instrument === 'fmsynth') {
        this.instrument = new Tone.PolySynth(Tone.FMSynth).toDestination()
      }
    }
  }
)
