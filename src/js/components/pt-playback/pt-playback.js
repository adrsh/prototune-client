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
      justify-content: center;
      align-items: center;
    }
    #options > button {
      height: 2.5rem;
      width: 2.5rem;
      background-color: unset;
      border: 0px;
      padding: 0;
      opacity: 75%;
    }
    #options > button:hover {
      opacity: 100%;
    }
    #options > button:active {
      transform: scale(0.95);
    }
    #options > button > img {
      height: 2.5rem;
      width: 2.5rem;
    }
  </style>
  <div id="options">
    <button id="play"><img src="../img/play-circle.svg" alt="Play"></button>
    <button id="pause"><img src="../img/pause-circle.svg" alt="Pause"></button>
    <button id="stop"><img src="../img/stop-circle.svg" alt="Stop"></button>
  </div>
  <div id="volume">
    <input id="volume-slider" type="range" max="0" min="-40" value="-5"></input>
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
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)
