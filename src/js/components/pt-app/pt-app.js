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
      grid-template-areas:  "instruments piano-roll"
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
  <pt-editor></pt-editor>
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

      this.editor = this.shadowRoot.querySelector('pt-editor')
      this.keyboard = this.shadowRoot.querySelector('pt-keyboard')
      this.roll = this.shadowRoot.querySelector('pt-piano-roll')
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      // This makes it possible to get keypresses on entire app.
      this.setAttribute('tabindex', 0)

      this.ws = new WebSocket('ws://localhost:8080')

      /**
       * Make the message get parsed as JSON.
       *
       * @param {Event} event Event to be handled.
       */
      this.ws.onmessage = async function (event) {
        event.message = event.data.text().then(JSON.parse)
      }

      this.editor.ws = this.ws
      this.keyboard.ws = this.ws

      // Make the keyboard instrument be the same as the editors current instrument.
      this.keyboard.instrument = this.editor.instrument

      this.roll.addEventListener('note-create', event => {
        this.#sendMessage(event.detail)
      })

      this.roll.addEventListener('note-remove', event => {
        this.#sendMessage(event.detail)
      })

      this.roll.addEventListener('note-update', event => {
        this.#sendMessage(event.detail)
      })

      this.#initMidi().then(console.log('MIDI device connected.'))

      // This bugs out once in a while, but decreases latency.
      Tone.setContext(new Tone.Context({ latencyHint: 'balanced' }))

      this.button.addEventListener('click', async () => {
        await Tone.start()
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
      const message = await JSON.parse(await data.text())
      if (message.action === 'play') {
        this.#playMidiNote(message.note)
      } else if (message.action === 'stop') {
        this.#stopMidiNote(message.note)
      } else if (message.action === 'note-update') {
        this.roll.dispatchEvent(new CustomEvent('update', { detail: message }))
      } else if (message.action === 'note-create') {
        this.roll.dispatchEvent(new CustomEvent('add', { detail: message }))
      } else if (message.action === 'note-remove') {
        this.roll.dispatchEvent(new CustomEvent('remove', { detail: message }))
      } else if (message.action === 'note-import') {
        this.roll.dispatchEvent(new CustomEvent('import', { detail: message }))
      }
    }

    /**
     * Sends data to Websocket server.
     *
     * @param {object} data Data to be sent.
     */
    #sendMessage (data) {
      if (this.ws.readyState === this.ws.OPEN) {
        this.ws.send(JSON.stringify(data))
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
      this.instrument.triggerAttack(Tone.Midi(note), Tone.now(), velocity)
    }

    /**
     * Releases a note that is being played.
     *
     * @param {string} note Note to be released, ex. 'C4'.
     */
    #stopNote (note) {
      this.instrument.triggerRelease(Tone.Midi(note), Tone.now())
    }

  }
)
