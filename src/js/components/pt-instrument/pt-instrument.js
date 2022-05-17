/**
 * The instrument web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import '../pt-knob'
import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-bottom: 1px solid gray;
  }
  #top {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 2.5rem;
  }
  #instrument-select {
    width: 60%;
    height: 1.5rem;
    font-size: 0.75rem;
    border: 0px solid #f0f0f0;
    background-color: unset;
  }
  #instrument-select:hover {
    outline: 1px solid #202020;
    border-radius: 0.1rem;
  }
  #options {
    display: flex;
    gap: 0.25rem;
    justify-content: flex-end;
    width: 100%;
    padding-right: 0.5rem;
  }
  #option-button {
    height: 1rem;
    width: 1rem;
    border: 0px;
    background-image: url("../img/caret-down-fill.svg");
    background-color: unset;
    float: right;
    padding: 0;
    opacity: 60%;
  }
  #option-button:hover {
    cursor: pointer;
    opacity: 100%;
  }
  #settings {
    display: flex;
    flex-direction: row;
    gap: 0.3rem;
    padding: 0.5rem;
  }
  #settings > button {
    width: 1rem;
    height: 0.4rem;
    border: 1px solid black;
    cursor: pointer;
    padding: 0;
  }
  .muted {
    background-color: #F23818;
  }
  .solo {
    background-color: #21FF67;
  }
  [hidden] {
    display: none !important;
  }
  #effects > div {
    display: flex;
    align-items: center;
    height: 4rem;
    width: 4rem;
    justify-content: space-evenly;
    flex-direction: column;
  }
  #effects > div > pt-knob {
    width: 1.75rem;
    height: 1.75rem;
  }
  #effects > div > span {
    font-size: 0.6rem;
    font-family: sans-serif;
  }
  #sub-menu {
    display: flex;
    flex-direction: column;
  }
  #effects {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 4rem;
  }
  #delete {
    display: flex;
    justify-content: left;
  }
  #delete-button {
    border: 0;
    background-color: unset;
    cursor: pointer;
    font-size: 0.6rem;
    font-family: sans-serif;
    padding: 0;
    margin: 0.5rem;
  }
  #delete-button:hover {
    color: red;
  }
  .flip {
    transform: rotate(180deg);
  }
  </style>
  <div id="top">
    <div id="settings">
      <button id="mute-button" title="Mute">
      <button id="solo-button" title="Solo">
    </div>
    <select name="instruments" id="instrument-select">
      <option value="piano">Piano</option>
      <option value="casio">Casio</option>
      <option value="808">808</option>
      <option value="909">909</option>
      <option value="cr78">CR-78</option>
      <option value="room">Room</option>
      <option value="synth">Synth</option>
      <option value="pulse">Pulse</option>
      <option value="square">Square</option>
      <option value="sine">Sine</option>
      <option value="amsynth">AMSynth</option>
      <option value="fmsynth">FMSynth</option>
    </select>
    <div id="options">
      <button id="option-button">
    </div>
  </div>
  <div id="sub-menu" hidden>
    <div id="effects">
      <div id="reverb" title="Reverb">
        <pt-knob id="reverb-changer" min="0" max="1" value="0" step="0.05"></pt-knob>
        <span>REVERB</span>
      </div>
      <div id="delay" title="Delay">
        <pt-knob id="delay-changer" min="0" max="1" value="0" step="0.05"></pt-knob>
        <span>DELAY</span>
      </div>
      <div id="volume" title="Volume">
        <pt-knob id="volume-changer" min="-60" max="0" value="-5"></pt-knob>
        <span>VOLUME</span>
      </div>
    </div>
    <div id="delete">
      <button id="delete-button">DELETE</button>
    </div>
  </div>
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

      this.selector.addEventListener('change', event => {
        this.setAttribute('instrument', event.target.value)
        this.dispatchEvent(new CustomEvent('instrument-change'))
      })

      this.addEventListener('click', () => this.dispatchEvent(new CustomEvent('instrument-select')))

      this.optionButton = this.shadowRoot.querySelector('#option-button')
      this.subMenu = this.shadowRoot.querySelector('#sub-menu')
      this.optionButton.addEventListener('click', event => {
        event.stopPropagation()
        this.subMenu.toggleAttribute('hidden')
        this.optionButton.classList.toggle('flip')
      })

      this.deleteButton = this.shadowRoot.querySelector('#delete-button')
      this.deleteButton.addEventListener('click', event => {
        event.stopPropagation()
        this.remove()
      })

      this.channel = new Tone.Channel({ channelCount: 2, volume: -6 }).toDestination()

      this.muteButton = this.shadowRoot.querySelector('#mute-button')
      this.muteButton.addEventListener('click', event => {
        event.stopPropagation()
        if (this.instrument) {
          if (this.channel.mute) {
            this.muteButton.classList.remove('muted')
            this.channel.mute = false
          } else {
            this.muteButton.classList.add('muted')
            this.channel.mute = true
          }
        }
      })

      this.soloButton = this.shadowRoot.querySelector('#solo-button')
      this.soloButton.addEventListener('click', event => {
        event.stopPropagation()
        if (this.instrument) {
          if (this.channel.solo) {
            this.soloButton.classList.remove('solo')
            this.channel.solo = false
          } else {
            this.soloButton.classList.add('solo')
            this.channel.solo = true
          }
        }
      })

      this.volumeChanger = this.shadowRoot.querySelector('#volume-changer')
      this.reverbChanger = this.shadowRoot.querySelector('#reverb-changer')
      this.delayChanger = this.shadowRoot.querySelector('#delay-changer')

      this.reverb = new Tone.Reverb(2)
      this.reverb.wet.value = 0

      this.delay = new Tone.FeedbackDelay('4n')
      this.delay.wet.value = 0
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      this.volumeChanger.addEventListener('input', async () => {
        this.channel.volume.rampTo(this.volumeChanger.value, 0)
      })
      this.volumeChanger.addEventListener('change', async () => {
        this.setAttribute('volume', this.volumeChanger.getAttribute('value'))
      })
      this.reverbChanger.addEventListener('input', async () => {
        this.reverb.wet.rampTo(this.reverbChanger.value, 0)
      })
      this.reverbChanger.addEventListener('change', async () => {
        this.setAttribute('reverb', this.reverbChanger.getAttribute('value'))
      })
      this.delayChanger.addEventListener('input', async () => {
        this.delay.wet.rampTo(this.delayChanger.value, 0)
      })
      this.delayChanger.addEventListener('change', async () => {
        this.setAttribute('delay', this.delayChanger.getAttribute('value'))
      })
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
      return ['instrument', 'uuid', 'volume', 'reverb', 'delay']
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
      } else if (name === 'volume') {
        this.volumeChanger.setAttribute('value', newValue)
      } else if (name === 'reverb') {
        this.reverbChanger.setAttribute('value', newValue)
      } else if (name === 'delay') {
        this.delayChanger.setAttribute('value', newValue)
      }
    }

    /**
     * Changes instrument.
     *
     * @param {string} instrument Instrument to be played.
     */
    #setInstrument (instrument) {
      if (this.instrument) {
        this.instrument.dispose()
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
        })
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
        })
      } else if (instrument === 'amsynth') {
        this.instrument = new Tone.AMSynth()
      } else if (instrument === 'fmsynth') {
        this.instrument = new Tone.FMSynth()
      } else if (instrument === 'synth') {
        this.instrument = new Tone.Synth({ release: 1 })
      } else if (instrument === '808') {
        this.instrument = new Tone.Sampler({
          urls: {
            C1: 'BassDrum.ogg',
            'C#1': 'SideStick.ogg',
            D1: 'AcousticSnare.ogg',
            'D#1': 'Clap.ogg',
            E1: 'ElectricSnare.ogg',
            F1: 'LowTom.ogg',
            'F#1': 'ClosedHiHat.ogg',
            G1: 'HighTom.ogg',
            'G#1': 'ClosedHiHat.ogg',
            A1: 'MidTom.ogg',
            'A#1': 'OpenHiHat.ogg'
          },
          release: 2,
          baseUrl: '../samples/808/'
        })
      } else if (instrument === '909') {
        this.instrument = new Tone.Sampler({
          urls: {
            C1: 'BassDrum.ogg',
            'C#1': 'SideStick.ogg',
            D1: 'AcousticSnare.ogg',
            'D#1': 'Clap.ogg',
            E1: 'ElectricSnare.ogg',
            'F#1': 'ClosedHiHat.ogg',
            'G#1': 'ClosedHiHat.ogg',
            'A#1': 'OpenHiHat.ogg'
          },
          release: 2,
          baseUrl: '../samples/909/'
        })
      } else if (instrument === 'cr78') {
        this.instrument = new Tone.Sampler({
          urls: {
            C1: 'BassDrum.ogg',
            'C#1': 'SideStick.ogg',
            D1: 'AcousticSnare.ogg',
            'D#1': 'Clap.ogg',
            E1: 'ElectricSnare.ogg',
            F1: 'LowTom.ogg',
            'F#1': 'ClosedHiHat.ogg',
            G1: 'HighTom.ogg',
            'G#1': 'ClosedHiHat.ogg',
            A1: 'LowTom.ogg',
            'A#1': 'OpenHiHat.ogg'
          },
          release: 2,
          baseUrl: '../samples/cr78/'
        })
      } else if (instrument === 'room') {
        this.instrument = new Tone.Sampler({
          urls: {
            C1: 'BassDrum.ogg',
            D1: 'AcousticSnare.ogg',
            E1: 'ElectricSnare.ogg',
            F1: 'LowTom.ogg',
            'F#1': 'ClosedHiHat.ogg',
            G1: 'HighTom.ogg',
            'G#1': 'ClosedHiHat.ogg',
            A1: 'LowTom.ogg',
            'A#1': 'OpenHiHat.ogg'
          },
          release: 2,
          baseUrl: '../samples/room/'
        })
      } else if (instrument === 'square') {
        this.instrument = new Tone.Synth({
          portamento: 0.05,
          volume: -6,
          oscillator: {
            type: 'square'
          },
          envelope: {
            attack: 0.025,
            attackCurve: 'exponential',
            decay: 0.3,
            decayCurve: 'exponential',
            sustain: 0.2,
            release: 1.5,
            releaseCurve: 'exponential'
          }
        })
      } else if (instrument === 'sine') {
        this.instrument = new Tone.Synth({
          portamento: 0.05,
          volume: -6,
          oscillator: {
            type: 'sine'
          },
          envelope: {
            attack: 0.025,
            attackCurve: 'exponential',
            decay: 0.3,
            decayCurve: 'exponential',
            sustain: 0.2,
            release: 1.5,
            releaseCurve: 'exponential'
          }
        })
      } else if (instrument === 'pulse') {
        this.instrument = new Tone.Synth({
          portamento: 0.05,
          volume: -6,
          oscillator: {
            type: 'pulse',
            width: 0
          },
          envelope: {
            attack: 0.025,
            attackCurve: 'exponential',
            decay: 0.3,
            decayCurve: 'exponential',
            sustain: 0.2,
            release: 1.5,
            releaseCurve: 'exponential'
          }
        })
      }
      this.instrument.chain(this.reverb, this.delay, this.channel, Tone.Destination)
    }
  }
)
