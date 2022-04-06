/**
 * The keyboard web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import './components/pt-keyboard-note'
import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      justify-content: space-evenly;
      align-items: center;
    }
    #keyboard {
      display: flex;
      flex-direction: row;
    }
    .octave {
      position: relative;
      height: 12rem;
    }
    .white-notes {
      display: flex;
      position: relative;
      height: 100%;
    }
    .black-notes {
      display: flex;
      position: absolute;
      top: 0px;
      height: 55%;
      width: 100%;
      justify-content: center;
    }
    .black-notes > pt-keyboard-note {
      background-color: #101010;
      outline: 1px solid white;
    }
    .black-notes > pt-keyboard-note:hover {
      background-color: #202020;
    }
    .black-notes > .playing {
      background-color: #404040 !important;
    }
    .white-notes > pt-keyboard-note:hover {
      background-color: #F0F0F0;
    }
    .white-notes > .playing {
      background-color: #e0e0e0 !important;
    }
    .invisible {
      visibility: hidden;
    }
    #options {
      display: flex;
      flex-direction: column;
    }
  </style>
  <!-- <div id="options">
    <label for="instrument-select">Instrument</label>
    <select name="instruments" id="instrument-select">
      <option value="piano">Piano</option>
      <option value="casio">Casio</option>
      <option value="amsynth">AMSynth</option>
      <option value="fmsynth">FMSynth</option>
    </select>
  </div> -->
  <div id="keyboard">
  <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="C1"></pt-keyboard-note>
        <pt-keyboard-note note="D1"></pt-keyboard-note>
        <pt-keyboard-note note="E1"></pt-keyboard-note>
        <pt-keyboard-note note="F1"></pt-keyboard-note>
        <pt-keyboard-note note="G1"></pt-keyboard-note>
        <pt-keyboard-note note="A1"></pt-keyboard-note>
        <pt-keyboard-note note="B1"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="C#1"></pt-keyboard-note>
        <pt-keyboard-note note="D#1"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="F#1"></pt-keyboard-note>
        <pt-keyboard-note note="G#1"></pt-keyboard-note>
        <pt-keyboard-note note="A#1"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="C2"></pt-keyboard-note>
        <pt-keyboard-note note="D2"></pt-keyboard-note>
        <pt-keyboard-note note="E2"></pt-keyboard-note>
        <pt-keyboard-note note="F2"></pt-keyboard-note>
        <pt-keyboard-note note="G2"></pt-keyboard-note>
        <pt-keyboard-note note="A2"></pt-keyboard-note>
        <pt-keyboard-note note="B2"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="C#2"></pt-keyboard-note>
        <pt-keyboard-note note="D#2"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="F#2"></pt-keyboard-note>
        <pt-keyboard-note note="G#2"></pt-keyboard-note>
        <pt-keyboard-note note="A#2"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="C3"></pt-keyboard-note>
        <pt-keyboard-note note="D3"></pt-keyboard-note>
        <pt-keyboard-note note="E3"></pt-keyboard-note>
        <pt-keyboard-note note="F3"></pt-keyboard-note>
        <pt-keyboard-note note="G3"></pt-keyboard-note>
        <pt-keyboard-note note="A3"></pt-keyboard-note>
        <pt-keyboard-note note="B3"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="C#3"></pt-keyboard-note>
        <pt-keyboard-note note="D#3"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="F#3"></pt-keyboard-note>
        <pt-keyboard-note note="G#3"></pt-keyboard-note>
        <pt-keyboard-note note="A#3"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="C4"></pt-keyboard-note>
        <pt-keyboard-note note="D4"></pt-keyboard-note>
        <pt-keyboard-note note="E4"></pt-keyboard-note>
        <pt-keyboard-note note="F4"></pt-keyboard-note>
        <pt-keyboard-note note="G4"></pt-keyboard-note>
        <pt-keyboard-note note="A4"></pt-keyboard-note>
        <pt-keyboard-note note="B4"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="C#4"></pt-keyboard-note>
        <pt-keyboard-note note="D#4"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="F#4"></pt-keyboard-note>
        <pt-keyboard-note note="G#4"></pt-keyboard-note>
        <pt-keyboard-note note="A#4"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="C5"></pt-keyboard-note>
        <pt-keyboard-note note="D5"></pt-keyboard-note>
        <pt-keyboard-note note="E5"></pt-keyboard-note>
        <pt-keyboard-note note="F5"></pt-keyboard-note>
        <pt-keyboard-note note="G5"></pt-keyboard-note>
        <pt-keyboard-note note="A5"></pt-keyboard-note>
        <pt-keyboard-note note="B5"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="C#5"></pt-keyboard-note>
        <pt-keyboard-note note="D#5"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="F#5"></pt-keyboard-note>
        <pt-keyboard-note note="G#5"></pt-keyboard-note>
        <pt-keyboard-note note="A#5"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="C6"></pt-keyboard-note>
        <pt-keyboard-note note="D6"></pt-keyboard-note>
        <pt-keyboard-note note="E6"></pt-keyboard-note>
        <pt-keyboard-note note="F6"></pt-keyboard-note>
        <pt-keyboard-note note="G6"></pt-keyboard-note>
        <pt-keyboard-note note="A6"></pt-keyboard-note>
        <pt-keyboard-note note="B6"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="C#6"></pt-keyboard-note>
        <pt-keyboard-note note="D#6"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="F#6"></pt-keyboard-note>
        <pt-keyboard-note note="G#6"></pt-keyboard-note>
        <pt-keyboard-note note="A#6"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="C7"></pt-keyboard-note>
      </div>
    </div>
  </div>
`

customElements.define('pt-keyboard',
  /**
   * Element representing a pt-keyboard.
   */
  class extends HTMLElement {
    #synth
    /**
     * Constructor for pt-keyboard.
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
      this.setAttribute('tabindex', 0)
      this.addEventListener('keydown', event => {
        if (!event.repeat) {
          this.#keyDown(event)
        }
      })
      this.addEventListener('keyup', event => this.#keyUp(event))

      this.keyboard = this.shadowRoot.querySelector('#keyboard')
      this.keyboard.addEventListener('note-play', event => this.#playNote(event.detail.note))
      this.keyboard.addEventListener('note-stop', event => this.#stopNote(event.detail.note))

      this.addEventListener('msg-play', event => this.#playNote(event.detail.note))
      this.addEventListener('msg-stop', event => this.#stopNote(event.detail.note))

      // this.instrumentSelect = this.shadowRoot.querySelector('#instrument-select')
      // this.instrumentSelect.addEventListener('change', event => this.#setInstrument(event.target.value))

      this.#setInstrument('piano')

      this.#start()
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
      this.#synth.dispose()
    }

    /**
     * Starts Tone and initializes instrument and tries to request MIDI access.
     */
    async #start () {
      await Tone.start()

      // Lower latency for better interaction.
      // Tone.setContext(new Tone.Context({ latencyHint: 'interactive' }))

      // this.#setInstrument('piano')

      this.midi = await navigator.requestMIDIAccess({ sysex: true })
      this.midi.inputs.forEach(entry => (entry.onmidimessage = this.#onMIDIMessage.bind(this)))
    }

    /**
     * Handles MIDIMessageEvent and plays the note that was pressed.
     *
     * @param {MIDIMessageEvent} event Event from a MIDI device.
     */
    #onMIDIMessage (event) {
      // 0 means note up and anything else is the velocity
      if (event.data[2] === 0) {
        this.#stopNote(Tone.Midi(event.data[1]))
      } else {
        this.#playNote(Tone.Midi(event.data[1]), (event.data[2] / 128).toFixed(3))
      }
    }

    /**
     * Plays a note using Tone.
     *
     * @param {string} note Note to be played, ex. 'C4'.
     * @param {number} velocity Velocity as a number between 0 and 1.
     */
    #playNote (note, velocity = 0.5) {
      this.#synth.triggerAttack(note, Tone.now(), velocity)
    }

    /**
     * Releases a note that is being played.
     *
     * @param {string} note Note to be released, ex. 'C4'.
     */
    #stopNote (note) {
      this.#synth.triggerRelease(note, Tone.now())
    }

    /**
     * Plays a note using the keyboard.
     *
     * @param {KeyboardEvent} event Event fired by keydown
     */
    #keyDown (event) {
      const note = this.#getNoteFromKey(event.code)
      if (note) {
        this.#playNote(note)
        const target = this.shadowRoot.querySelector(`pt-keyboard-note[note="${note}"]`)
        target.classList.add('playing')
      }
    }

    /**
     * Releases a note that was played using the keyboard.
     *
     * @param {KeyboardEvent} event Event fired by keyup
     */
    #keyUp (event) {
      const note = this.#getNoteFromKey(event.code)
      if (note) {
        this.#stopNote(note)
        const target = this.shadowRoot.querySelector(`pt-keyboard-note[note="${note}"]`)
        target.classList.remove('playing')
      }
    }

    /**
     * Changes instrument.
     *
     * @param {string} instrument Instrument to be played.
     */
    #setInstrument (instrument) {
      if (this.#synth) {
        this.#synth.dispose()
      }
      if (instrument === 'casio') {
        this.#synth = new Tone.Sampler({
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
        this.#synth = new Tone.Sampler({
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
        this.#synth = new Tone.PolySynth(Tone.AMSynth).toDestination()
      } else if (instrument === 'fmsynth') {
        this.#synth = new Tone.PolySynth(Tone.FMSynth).toDestination()
      }
    }

    /**
     * Returns which note that is mapped to which key on the keyboard.
     *
     * @param {string} key Key that was pressed on the keyboard.
     * @returns {string} Note that should be played.
     */
    #getNoteFromKey (key) {
      switch (key) {
        case 'KeyZ':
          return 'C3'
        case 'KeyX':
          return 'D3'
        case 'KeyC':
          return 'E3'
        case 'KeyV':
          return 'F3'
        case 'KeyB':
          return 'G3'
        case 'KeyN':
          return 'A3'
        case 'KeyM':
          return 'B3'
        case 'Comma':
          return 'C4'
        case 'Period':
          return 'D4'
        case 'Slash':
          return 'E4'
        case 'KeyL':
          return 'C#4'
        case 'Semicolon':
          return 'D#4'

        case 'KeyS':
          return 'C#3'
        case 'KeyD':
          return 'D#3'
        case 'KeyG':
          return 'F#3'
        case 'KeyH':
          return 'G#3'
        case 'KeyJ':
          return 'A#3'

        case 'KeyQ':
          return 'C4'
        case 'KeyW':
          return 'D4'
        case 'KeyE':
          return 'E4'
        case 'KeyR':
          return 'F4'
        case 'KeyT':
          return 'G4'
        case 'KeyY':
          return 'A4'
        case 'KeyU':
          return 'B4'
        case 'KeyI':
          return 'C5'
        case 'KeyO':
          return 'D5'
        case 'KeyP':
          return 'E5'

        case 'Digit2':
          return 'C#4'
        case 'Digit3':
          return 'D#4'
        case 'Digit5':
          return 'F#4'
        case 'Digit6':
          return 'G#4'
        case 'Digit7':
          return 'A#4'
        case 'Digit9':
          return 'C#5'
        case 'Digit0':
          return 'D#5'

        default:
          return ''
      }
    }
  }
)
