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
    <label for="instrument-select">Instrument</label>
    <select name="instruments" id="instrument-select">
      <option value="piano">Piano</option>
      <option value="casio">Casio</option>
      <option value="amsynth">AMSynth</option>
      <option value="fmsynth">FMSynth</option>
    </select>
    <button id="play">play</button>
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

      this.keyboard.addEventListener('note-play', event => this.#playNote(event.detail.note))
      this.keyboard.addEventListener('note-stop', event => this.#stopNote(event.detail.note))

      this.#setInstrument('piano')

      // This bugs out once in a while, but decreases latency.
      Tone.setContext(new Tone.Context({ latencyHint: 'interactive' }))

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
        this.keyboard.dispatchEvent(new CustomEvent('msg-play', { detail: { note: message.note } }))
      } else if (message.action === 'stop') {
        this.keyboard.dispatchEvent(new CustomEvent('msg-stop', { detail: { note: message.note } }))
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
