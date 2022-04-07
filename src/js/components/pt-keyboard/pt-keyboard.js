/**
 * The keyboard web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import './components/pt-keyboard-note'

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
  </style>
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
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }

    /**
     * Starts Tone and initializes instrument and tries to request MIDI access.
     */
    async #start () {
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
        // this.#stopNote(Tone.Midi(event.data[1]))
      } else {
        // this.#playNote(Tone.Midi(event.data[1]), (event.data[2] / 128).toFixed(3))
      }
    }
  }
)
