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
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }
    #playback {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      align-items: center;
    }
    #volume-and-download {
      display: flex;
      gap: 0.75rem;
      justify-content: space-around;
      align-items: center;
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
      justify-content: center;
      gap: 0.5rem;
    }
    #tempo > label, #download-settings > label {
      font-family: sans-serif;
      font-size: 0.7rem;
    }
    #tempo > input[type="number"], #loop-count {
      width: 3rem;
      border: 1px solid black;
      padding: 0.2rem;
      font-size: 0.7rem;
    }
    #loop-count {
      width: 2rem;
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
    #download-settings {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    #keyboard-settings {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    #keyboard-toggle {
      height: 1.75rem;
      width: 1.75rem;
      background-image: url("../img/arrow-down-short.svg");
      transition: transform 0.25s;
    }
    .flip {
      transform: rotate(180deg);
    }
  </style>
  <div id="tempo">
    <label for="tempo-changer">BPM</label>
    <input id="tempo-changer" type="number" min="30" max="300" value="120">
  </div>
  <div id="playback">
    <button id="play" title="Play">
    <button id="pause" title="Pause" hidden>
    <button id="stop" title="Stop">
  </div>
  <div id="volume-and-download">
      <input id="volume-slider" type="range" max="0" min="-40" value="-5">
    <div id="download-settings">
      <label for="loop-count">LOOPS</label>
      <input id="loop-count" type="number" min="1" value="1" title="How many loops to record">
      <button id="download" title="Start recording and download">
    </div>
    <div id="keyboard-settings">
      <button id="keyboard-toggle" title="Toggle keyboard">
    </div>
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
      this.loopCount = this.shadowRoot.querySelector('#loop-count')

      this.volumeSlider = this.shadowRoot.querySelector('#volume-slider')
      this.tempoChanger = this.shadowRoot.querySelector('#tempo-changer')

      this.keyboardToggleButton = this.shadowRoot.querySelector('#keyboard-toggle')

      Tone.getDestination().volume.rampTo(parseInt(this.volumeSlider.value), 0.1)
      Tone.getTransport().bpm.rampTo(parseInt(this.tempoChanger.value), 0.1)
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      Tone.getTransport().setLoopPoints('0:0:0', '0:0:64')
      Tone.getTransport().loop = true

      this.playButton.addEventListener('click', async () => {
        await Tone.start()
        Tone.getTransport().setLoopPoints('0:0:0', '0:0:64')
        Tone.getTransport().loop = true
        Tone.getTransport().start()
        this.pauseButton.removeAttribute('hidden')
        this.playButton.replaceWith(this.pauseButton)
      })

      this.pauseButton.addEventListener('click', async () => {
        Tone.getTransport().pause()
        this.pauseButton.replaceWith(this.playButton)
      })

      document.addEventListener('keydown', event => {
        if (event.code === 'Space') {
          if (Tone.getTransport().state !== 'started') {
            Tone.getTransport().start()
            this.pauseButton.removeAttribute('hidden')
            this.playButton.replaceWith(this.pauseButton)
          } else {
            Tone.getTransport().stop()
            this.pauseButton.replaceWith(this.playButton)
          }
        }
      })

      this.stopButton.addEventListener('click', async () => {
        Tone.getTransport().stop()
        this.pauseButton.replaceWith(this.playButton)
      })

      const recorder = new Tone.Recorder()
      Tone.getDestination().connect(recorder)
      this.downloadButton.addEventListener('click', async () => {
        // Reset transport position
        Tone.getTransport().position = '0:0:0'
        // Keep check of loops and when to stop the loop and finish recording
        let loop = 1
        if (parseInt(this.loopCount.value) === loop) {
          Tone.getTransport().loop = false
        } else {
          Tone.getTransport().loop = true
        }
        this.looper = Tone.getTransport().on('loop', () => {
          loop++
          if (parseInt(this.loopCount.value) === loop) {
            Tone.getTransport().loop = false
          }
        })
        recorder.start()
        Tone.getTransport().start(Tone.now())
        // Stop the transport a little after the loop has ended.
        Tone.getTransport().stop(Tone.now() + Tone.TransportTime(`${(parseInt(this.loopCount.value) * 4) + 1}:0:0`))
        Tone.getTransport().once('stop', async event => {
          const recording = await recorder.stop()
          // https://tonejs.github.io/docs/14.7.77/Recorder
          const url = URL.createObjectURL(recording)
          const anchor = document.createElement('a')
          anchor.download = 'recording.ogg'
          anchor.href = url
          anchor.click()
          Tone.getTransport().clear(this.looper)
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
          Tone.getTransport().bpm.rampTo(parseInt(this.tempoChanger.value), 0.1)
        }
      })

      this.keyboardToggleButton.addEventListener('click', async () => {
        this.dispatchEvent(new CustomEvent('keyboard-toggle'))
        this.keyboardToggleButton.classList.toggle('flip')
      })
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)
