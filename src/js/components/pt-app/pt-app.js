/**
 * The pt-app web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: grid;
      grid-template-rows: 40rem 2rem 16rem;
      grid-template-columns: minmax(16rem, 24rem) minmax(48rem, auto);
      grid-template-areas:  ". piano-roll"
                            "options options"
                            "keyboard keyboard";
    }
    pt-keyboard {
      grid-area: keyboard;
      overflow-x: scroll;
    }
    pt-piano-roll {
      grid-area: piano-roll;
    }
    #options {
      grid-area: options;
    }
  </style>
  <pt-piano-roll></pt-piano-roll>
  <div id="options">
    <!-- <label for="instrument-select">Instrument</label>
    <select name="instruments" id="instrument-select">
      <option value="piano">Piano</option>
      <option value="casio">Casio</option>
      <option value="amsynth">AMSynth</option>
      <option value="fmsynth">FMSynth</option>
    </select> -->
    <button id="play">Play</button>
  </div>
  <pt-keyboard></pt-keyboard>
`

customElements.define('pt-app',
  /**
   * Element representing a pt-app.
   */
  class extends HTMLElement {
    #synth
    /**
     * Constructor for pt-app.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.button = this.shadowRoot.querySelector('#play')

      this.roll = this.shadowRoot.querySelector('pt-piano-roll')
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      // This makes it possible to get keypresses on entire app.
      this.setAttribute('tabindex', 0)

      this.keyboard = this.shadowRoot.querySelector('pt-keyboard')

      this.ws = new WebSocket('ws://localhost:8080')

      // Add listeners for message handling only if the connection is open. The question is if it can get opened multiple times... Maybe check for close and remove listeners.
      this.ws.addEventListener('open', () => {
        this.ws.addEventListener('message', event => this.#handleMessage(event.data))

        this.keyboard.addEventListener('note-play', event => this.#sendMessage({ note: event.detail.note, action: 'play' }))
        this.keyboard.addEventListener('note-stop', event => this.#sendMessage({ note: event.detail.note, action: 'stop' }))
      })

      this.roll.addEventListener('update', event => {
        this.#sendMessage(event.detail)
      })

      this.keyboard.addEventListener('note-play', event => this.#playNote(event.detail.note))
      this.keyboard.addEventListener('note-stop', event => this.#stopNote(event.detail.note))

      this.#initMidi().then(console.log('MIDI device connected.'))

      this.#setInstrument('piano')

      // This bugs out once in a while, but decreases latency.
      Tone.setContext(new Tone.Context({ latencyHint: 'balanced' }))

      // Handle key presses.
      this.addEventListener('keydown', event => {
        if (!event.repeat) {
          this.#keyDown(event)
        }
      })
      this.addEventListener('keyup', event => this.#keyUp(event))

      this.button.addEventListener('click', () => {
        Tone.start()
        Tone.Transport.setLoopPoints('0:0:0', '0:0:64')
        Tone.Transport.loop = true
        Tone.Transport.start()
      })
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }

    /**
     * Handles messages from Websocket server.
     *
     * @param {Blob} data Data to be handled.
     */
    async #handleMessage (data) {
      const message = JSON.parse(await data.text())
      if (message.action === 'play') {
        this.#playMidiNote(message.note)
      } else if (message.action === 'stop') {
        this.#stopMidiNote(message.note)
      } else {
        this.roll.dispatchEvent(new CustomEvent('import', { detail: message }))
      }
    }

    /**
     * Sends data to Websocket server.
     *
     * @param {object} data Data to be sent.
     */
    #sendMessage (data) {
      this.ws.send(JSON.stringify(data))
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
        // This works but feels wrong for some reason.
        const target = this.keyboard.shadowRoot.querySelector(`pt-keyboard-note[note="${note}"]`)
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
        const target = this.keyboard.shadowRoot.querySelector(`pt-keyboard-note[note="${note}"]`)
        target.classList.remove('playing')
      }
    }

    /**
     * Plays a note using the keyboard.
     *
     * @param {number} note Note to be played
     * @param {number} velocity Velocity as a number between 0 and 1.
     */
    #playMidiNote (note, velocity = 0.5) {
      this.#playNote(note, velocity)
      const target = this.keyboard.shadowRoot.querySelector(`pt-keyboard-note[note="${note}"]`)
      target.classList.add('playing')
    }

    /**
     * Releases a note that was played using the keyboard.
     *
     * @param {number} note Note to be released.
     */
    #stopMidiNote (note) {
      this.#stopNote(note)
      const target = this.keyboard.shadowRoot.querySelector(`pt-keyboard-note[note="${note}"]`)
      target.classList.remove('playing')
    }

    /**
     * Initializes MIDI functionality.
     */
    async #initMidi () {
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
        this.#stopMidiNote(event.data[1])
      } else {
        this.#playMidiNote(event.data[1], (event.data[2] / 128).toFixed(3))
      }
    }

    /**
     * Plays a note using Tone.
     *
     * @param {string} note Note to be played, ex. 'C4'.
     * @param {number} velocity Velocity as a number between 0 and 1.
     */
    #playNote (note, velocity = 0.5) {
      this.#synth.triggerAttack(Tone.Midi(note), Tone.now(), velocity)
    }

    /**
     * Releases a note that is being played.
     *
     * @param {string} note Note to be released, ex. 'C4'.
     */
    #stopNote (note) {
      this.#synth.triggerRelease(Tone.Midi(note), Tone.now())
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
          return '48'
        case 'KeyX':
          return '50'
        case 'KeyC':
          return '52'
        case 'KeyV':
          return '53'
        case 'KeyB':
          return '55'
        case 'KeyN':
          return '57'
        case 'KeyM':
          return '59'
        case 'Comma':
          return '60'
        case 'Period':
          return '62'
        case 'Slash':
          return '64'
        case 'KeyL':
          return '61'
        case 'Semicolon':
          return '63'

        case 'KeyS':
          return '49'
        case 'KeyD':
          return '51'
        case 'KeyG':
          return '54'
        case 'KeyH':
          return '56'
        case 'KeyJ':
          return '58'

        case 'KeyQ':
          return '60'
        case 'KeyW':
          return '62'
        case 'KeyE':
          return '64'
        case 'KeyR':
          return '65'
        case 'KeyT':
          return '67'
        case 'KeyY':
          return '69'
        case 'KeyU':
          return '71'
        case 'KeyI':
          return '72'
        case 'KeyO':
          return '74'
        case 'KeyP':
          return '76'

        case 'Digit2':
          return '61'
        case 'Digit3':
          return '63'
        case 'Digit5':
          return '66'
        case 'Digit6':
          return '68'
        case 'Digit7':
          return '70'
        case 'Digit9':
          return '73'
        case 'Digit0':
          return '75'

        default:
          return ''
      }
    }
  }
)
