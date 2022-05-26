/**
 * The keyboard web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import '../pt-keyboard-note/'
import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
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
      border-radius: 0 0 0.3rem 0.3rem;
    }
    .black-notes > pt-keyboard-note:hover {
      background-color: #202020;
    }
    .black-notes > .playing {
      background-color: #303030 !important;
    }
    .white-notes > pt-keyboard-note:hover {
      background-color: #F0F0F0;
    }
    .white-notes > .playing {
      background-color: #e0e0e0 !important;
    }
    .black-notes > pt-keyboard-note {
      color: #606060;
    }
    .invisible {
      visibility: hidden;
    }
    label {
      font-family: sans-serif;
      font-size: 0.7rem;
    }
    #solo {
      position: fixed;
      width: 100%;
      height: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
  <div id="keyboard">
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="21"></pt-keyboard-note>
        <pt-keyboard-note note="23"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="22"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="24"></pt-keyboard-note>
        <pt-keyboard-note note="26"></pt-keyboard-note>
        <pt-keyboard-note note="28"></pt-keyboard-note>
        <pt-keyboard-note note="29"></pt-keyboard-note>
        <pt-keyboard-note note="31"></pt-keyboard-note>
        <pt-keyboard-note note="33"></pt-keyboard-note>
        <pt-keyboard-note note="35"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="25"></pt-keyboard-note>
        <pt-keyboard-note note="27"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="30"></pt-keyboard-note>
        <pt-keyboard-note note="32"></pt-keyboard-note>
        <pt-keyboard-note note="34"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="36"></pt-keyboard-note>
        <pt-keyboard-note note="38"></pt-keyboard-note>
        <pt-keyboard-note note="40"></pt-keyboard-note>
        <pt-keyboard-note note="41"></pt-keyboard-note>
        <pt-keyboard-note note="43"></pt-keyboard-note>
        <pt-keyboard-note note="45"></pt-keyboard-note>
        <pt-keyboard-note note="47"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="37"></pt-keyboard-note>
        <pt-keyboard-note note="39"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="42"></pt-keyboard-note>
        <pt-keyboard-note note="44"></pt-keyboard-note>
        <pt-keyboard-note note="46"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="48"></pt-keyboard-note>
        <pt-keyboard-note note="50"></pt-keyboard-note>
        <pt-keyboard-note note="52"></pt-keyboard-note>
        <pt-keyboard-note note="53"></pt-keyboard-note>
        <pt-keyboard-note note="55"></pt-keyboard-note>
        <pt-keyboard-note note="57"></pt-keyboard-note>
        <pt-keyboard-note note="59"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="49"></pt-keyboard-note>
        <pt-keyboard-note note="51"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="54"></pt-keyboard-note>
        <pt-keyboard-note note="56"></pt-keyboard-note>
        <pt-keyboard-note note="58"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="60"></pt-keyboard-note>
        <pt-keyboard-note note="62"></pt-keyboard-note>
        <pt-keyboard-note note="64"></pt-keyboard-note>
        <pt-keyboard-note note="65"></pt-keyboard-note>
        <pt-keyboard-note note="67"></pt-keyboard-note>
        <pt-keyboard-note note="69"></pt-keyboard-note>
        <pt-keyboard-note note="71"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="61"></pt-keyboard-note>
        <pt-keyboard-note note="63"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="66"></pt-keyboard-note>
        <pt-keyboard-note note="68"></pt-keyboard-note>
        <pt-keyboard-note note="70"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="72"></pt-keyboard-note>
        <pt-keyboard-note note="74"></pt-keyboard-note>
        <pt-keyboard-note note="76"></pt-keyboard-note>
        <pt-keyboard-note note="77"></pt-keyboard-note>
        <pt-keyboard-note note="79"></pt-keyboard-note>
        <pt-keyboard-note note="81"></pt-keyboard-note>
        <pt-keyboard-note note="83"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="73"></pt-keyboard-note>
        <pt-keyboard-note note="75"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="78"></pt-keyboard-note>
        <pt-keyboard-note note="80"></pt-keyboard-note>
        <pt-keyboard-note note="82"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="84"></pt-keyboard-note>
        <pt-keyboard-note note="86"></pt-keyboard-note>
        <pt-keyboard-note note="88"></pt-keyboard-note>
        <pt-keyboard-note note="89"></pt-keyboard-note>
        <pt-keyboard-note note="91"></pt-keyboard-note>
        <pt-keyboard-note note="93"></pt-keyboard-note>
        <pt-keyboard-note note="95"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="85"></pt-keyboard-note>
        <pt-keyboard-note note="87"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="90"></pt-keyboard-note>
        <pt-keyboard-note note="92"></pt-keyboard-note>
        <pt-keyboard-note note="94"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="96"></pt-keyboard-note>
        <pt-keyboard-note note="98"></pt-keyboard-note>
        <pt-keyboard-note note="100"></pt-keyboard-note>
        <pt-keyboard-note note="101"></pt-keyboard-note>
        <pt-keyboard-note note="103"></pt-keyboard-note>
        <pt-keyboard-note note="105"></pt-keyboard-note>
        <pt-keyboard-note note="107"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="97"></pt-keyboard-note>
        <pt-keyboard-note note="99"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="102"></pt-keyboard-note>
        <pt-keyboard-note note="104"></pt-keyboard-note>
        <pt-keyboard-note note="106"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="108"></pt-keyboard-note>
      </div>
    </div>
  </div>
  <div id="solo">
    <input type="checkbox" id="play-solo">
    <label for="play-solo">Solo</label>
  </div>
`

customElements.define('pt-keyboard',
  /**
   * Element representing a pt-keyboard.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-keyboard.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.ws = window.ws

      this.ws.addEventListener('message', async event => {
        const message = await event.message
        if (!this.solo) {
          if (message.action === 'keyboard-play') {
            this.#playNote(message['keyboard-note'])
          } else if (message.action === 'keyboard-stop') {
            this.#stopNote(message['keyboard-note'])
          }
        }
      })
      this.addEventListener('note-play', event => this.#sendMessage({ 'keyboard-note': parseInt(event.detail.note), action: 'keyboard-play' }))
      this.addEventListener('note-stop', event => this.#sendMessage({ 'keyboard-note': parseInt(event.detail.note), action: 'keyboard-stop' }))

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
        baseUrl: '../samples/piano/'
      }).toDestination()
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      this.addEventListener('note-play', event => this.#playNote(event.detail.note))
      this.addEventListener('note-stop', event => this.#stopNote(event.detail.note))

      document.addEventListener('keydown', event => {
        if (!event.repeat) {
          this.#keyDown(event)
        }
      })
      document.addEventListener('keyup', event => this.#keyUp(event))

      const playSoloCheckbox = this.shadowRoot.querySelector('#play-solo')
      playSoloCheckbox.addEventListener('change', event => {
        this.solo = playSoloCheckbox.checked
      })

      this.#initMidi().then()

      // Make scrollbar get centered
      this.scrollLeft = (this.scrollWidth - this.clientWidth) / 2
    }

    /**
     * Plays a note using the keyboard.
     *
     * @param {KeyboardEvent} event Event fired by keydown
     */
    async #keyDown (event) {
      const note = this.#getNoteFromKey(event.code)
      if (note) {
        this.#playNote(note)
        this.#sendMessage({ 'keyboard-note': parseInt(note), action: 'keyboard-play' })
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
        this.#sendMessage({ 'keyboard-note': parseInt(note), action: 'keyboard-stop' })
      }
    }

    /**
     * Sends data to Websocket server.
     *
     * @param {object} data Data to be sent.
     */
    #sendMessage (data) {
      if (this.ws.readyState === this.ws.OPEN && !this.solo) {
        this.ws.send(JSON.stringify(data))
      }
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }

    /**
     * Plays a note using Tone.
     *
     * @param {string} note Note to be played, ex. 'C4'.
     * @param {number} velocity Velocity as a number between 0 and 1.
     */
    #playNote (note, velocity = 0.5) {
      this.instrument.triggerAttack(Tone.Midi(note), Tone.now(), velocity)
      const target = this.shadowRoot.querySelector(`pt-keyboard-note[note="${note}"]`)
      target.classList.add('playing')
    }

    /**
     * Releases a note that is being played.
     *
     * @param {string} note Note to be released, ex. 'C4'.
     */
    #stopNote (note) {
      if (this.instrument.name === 'Sampler') {
        this.instrument.triggerRelease(Tone.Midi(note), Tone.now())
      } else if (this.instrument.name === 'Synth') {
        this.instrument.triggerRelease()
      } else {
        this.instrument.triggerRelease(Tone.Midi(note), Tone.now())
      }
      const target = this.shadowRoot.querySelector(`pt-keyboard-note[note="${note}"]`)
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
        this.#stopNote(event.data[1])
        this.#sendMessage({ 'keyboard-note': parseInt(event.data[1]), action: 'keyboard-stop' })
      } else {
        this.#playNote(event.data[1], (event.data[2] / 128).toFixed(3))
        this.#sendMessage({ 'keyboard-note': parseInt(event.data[1]), action: 'keyboard-play' })
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
