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
    button {
      height: 2.5rem;
      width: 2.5rem;
      background-color: unset;
      background-size: contain;
      border: 0px;
      padding: 0;
      opacity: 75%;
    }
    button:hover {
      opacity: 100%;
    }
    button:active {
      transform: scale(0.95);
    }
    #tempo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    #tempo > label {
      font-family: sans-serif;
      font-size: 0.7rem;
    }
    #tempo > input[type="number"] {
      width: 3rem;
      border: 1px solid black;
      padding: 0.2rem;
      font-size: 0.7rem;
    }
    #play {
      background-image: url("../img/play-fill.svg")
    }
    #pause {
      background-image: url("../img/pause-fill.svg")
    }
    #stop {
      background-image: url("../img/stop-fill.svg")
    }
    #download {
      height: 1.75rem;
      width: 1.75rem;
      background-image: url("../img/download.svg")
    }
  </style>
  <div id="tempo">
    <label for="tempo-changer">BPM</label>
    <input id="tempo-changer" type="number" min="30" max="300" value="120">
  </div>
  <div id="buttons">
    <button id="play" title="Play">
    <button id="pause" title="Pause" hidden>
    <button id="stop" title="Stop">
  </div>
  <div id="buttons">
    <input id="volume-slider" type="range" max="0" min="-40" value="-5">
    <button id="download">
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

      this.downloadButton = this.shadowRoot.querySelector('#download')

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
        this.pauseButton.removeAttribute('hidden')
        this.playButton.replaceWith(this.pauseButton)
      })

      this.pauseButton.addEventListener('click', async () => {
        Tone.Transport.pause()
        this.pauseButton.replaceWith(this.playButton)
      })

      this.stopButton.addEventListener('click', async () => {
        Tone.Transport.stop()
        this.pauseButton.replaceWith(this.playButton)
      })

      const recorder = new Tone.Recorder()
      Tone.Destination.connect(recorder)
      this.downloadButton.addEventListener('click', async () => {
        // Prevent looping for just recording one loop.
        Tone.Transport.loop = false
        // Reset transport position
        Tone.Transport.position = 0
        recorder.start()
        Tone.Transport.start()
        // Stop the transport a little after the loop has ended.
        Tone.Transport.stop(Tone.now() + Tone.TransportTime('5:0:0'))
        Tone.Transport.on('stop', async event => {
          const recording = await recorder.stop()
          // https://tonejs.github.io/docs/14.7.77/Recorder
          const url = URL.createObjectURL(recording)
          const anchor = document.createElement('a')
          anchor.download = 'recording.ogg'
          anchor.href = url
          anchor.click()
        })
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
