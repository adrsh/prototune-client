/**
 * The pt-time-line web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host {
    position: relative;
    height: 1.25rem;
    width: 64rem;
    background-color: #ededed;
    border-bottom: 1px solid gray;
    box-sizing: border-box;
    background-image:
        repeating-linear-gradient(
          90deg,
          transparent 0 3.9375rem,
          #a0a0a0 3.9375rem 4rem
        ),
        repeating-linear-gradient(
          90deg,
          transparent 0 0.9375rem,
          #d8d8d8 0.9375rem 1rem
        );
  }
  #time-line {
    position: relative;
    height: 1.25rem;
    width: 1px;
  }
  #arrow {
    height: 0;
    width: 0;
    border-left: 0.3rem solid transparent;
    border-right: 0.3rem solid transparent;
    border-top: 0.6rem solid #404040;
    position: absolute;
    bottom: 0px;
    left: -0.3rem;
  }
  </style>
  <div id="time-line">
    <div id="arrow"></div>
  </div>
`

customElements.define('pt-time-line',
  /**
   * Element representing pt-instrument.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-instrument.
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
      this.line = this.shadowRoot.querySelector('#time-line')
      this.tick = 0

      Tone.Transport.on('start', event => {
        // Only create a new schedule if no exist
        if (!this.draw) {
          this.draw = Tone.Transport.scheduleRepeat((time) => {
            Tone.Draw.schedule(() => {
              this.line.style.left = `${this.tick}rem`
            }, time)
            this.tick++
          }, '0:0:1')
        }
      })

      Tone.Transport.on('stop', event => {
        // Checks if the stop was triggered by position change
        if (Tone.Transport.state !== 'started') {
          Tone.Transport.clear(this.draw)
          delete this.draw
          this.line.style.left = 0
          this.tick = 0
        }
      })

      Tone.Transport.on('loopEnd', event => {
        this.line.style.left = 0
        this.tick = 0
      })

      this.addEventListener('click', event => {
        const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
        this.tick = Math.floor(parseInt(event.offsetX) / fontSize)
        this.line.style.left = `${this.tick}rem`
        Tone.Transport.position = `0:0:${this.tick}`
      })
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }

    /**
     * Returns element attributes to observe.
     *
     * @returns {string[]} An array of attributes to observe.
     */
    static get observedAttributes () {
      return []
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
    }
  }
)
