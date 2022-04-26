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
    height: 1.5rem;
    width: 64rem;
    background-color: #e8e8e8;
    border-bottom: 1px solid gray;
    box-sizing: border-box;
    background-image:
        repeating-linear-gradient(
          90deg,
          transparent 0.03125rem 3.96875rem,
          #a0a0a0 3.96875rem 4.03125rem
        ),
        repeating-linear-gradient(
          90deg,
          transparent 0.03125rem 0.96875rem,
          #d8d8d8 0.96875rem 1.03125rem
        );
  }
  #time-line {
    position: relative;
    height: 1.5rem;
    width: 1px;
    border-left: 1px solid black;
  }
  </style>
  <div id="time-line"></div>
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
      Tone.Transport.scheduleRepeat((time) => {
        Tone.Draw.schedule(() => {
          this.line.style.left = `${this.tick++}rem`
        }, time)
      }, '0:0:1')
      // Tone.Transport.on('start', event => console.log('start'))
      Tone.Transport.on('stop', event => {
        if (Tone.Transport.state !== 'started') {
          this.line.style.left = 0
          this.tick = 0
        }
      })
      Tone.Transport.on('loop', event => {
        this.line.style.left = 0
        this.tick = 0
      })

      this.addEventListener('click', event => {
        this.tick = Math.floor(parseInt(event.offsetX) / 16)
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
