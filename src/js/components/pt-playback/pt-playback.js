/**
 * The pt-playback web component module.
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
      justify-content: space-evenly;
      align-items: center;
    }
    #buttons {
      display: flex;
      gap: 0.75rem;
    }
    #buttons > button {
      height: 2.5rem;
      width: 2.5rem;
      background-color: unset;
      border: 0px;
      padding: 0;
      opacity: 75%;
    }
    #buttons > button:hover {
      opacity: 100%;
    }
    #buttons > button:active {
      transform: scale(0.95);
    }
    #buttons > button > img {
      height: 2.5rem;
      width: 2.5rem;
    }
    #tempo > label {
      font-family: sans-serif;
      font-size: 0.8rem;
    }
    #tempo > input[type="number"] {
      width: 3rem;
    }
  </style>
  <div id="tempo">
    <label for="tempo-changer">BPM</label>
    <input id="tempo-changer" type="number" min="30" max="300" value="120">
  </div>
  <div id="buttons">
    <button id="play"><img src="../img/play-fill.svg" alt="Play"></button>
    <button id="pause"><img src="../img/pause-fill.svg" alt="Pause"></button>
    <button id="stop"><img src="../img/stop-fill.svg" alt="Stop"></button>
  </div>
  <div id="volume">
    <input id="volume-slider" type="range" max="0" min="-40" value="-5">
  </div>
`

customElements.define('pt-playback',
  /**
   * Element representing pt-playback.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-playback.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.playButton = this.shadowRoot.querySelector('#play')
      this.pauseButton = this.shadowRoot.querySelector('#pause')
      this.stopButton = this.shadowRoot.querySelector('#stop')

      this.volumeSlider = this.shadowRoot.querySelector('#volume-slider')
      this.tempoChanger = this.shadowRoot.querySelector('#tempo-changer')

      Tone.getDestination().volume.rampTo(parseInt(this.volumeSlider.value), 0.1)
      Tone.Transport.bpm.rampTo(parseInt(this.tempoChanger.value), 0.1)
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      this.playButton.addEventListener('click', async () => {
        await Tone.start()
        Tone.Transport.setLoopPoints('0:0:0', '0:0:64')
        Tone.Transport.loop = true
        Tone.Transport.start()
      })

      this.pauseButton.addEventListener('click', async () => {
        Tone.Transport.pause()
      })

      this.stopButton.addEventListener('click', async () => {
        Tone.Transport.stop()
      })

      this.volumeSlider.addEventListener('input', async () => {
        if (parseInt(this.volumeSlider.value) === -40) {
          Tone.getDestination().volume.rampTo(-Infinity, 0)
        } else {
          Tone.getDestination().volume.rampTo(parseInt(this.volumeSlider.value), 0)
        }
      })

      this.tempoChanger.addEventListener('input', async () => {
        if (parseInt(this.tempoChanger.value) >= 30 && parseInt(this.tempoChanger.value) <= 300) {
          Tone.Transport.bpm.rampTo(parseInt(this.tempoChanger.value), 0.1)
        }
      })
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)
