/**
 * The pt-knob web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host {
    position: relative;
    height: 5rem;
    width: 5rem;
    background-color: #88ff88;
    border-radius: 50%;
    cursor: ns-resize;
   }
  #line {
    position: absolute;
    top: 50%;
    left: 47%;
    height: 45%;
    width: 6%;
    background-color: #000;
    transform: rotate(45deg);
    transform-origin: center top;
  }
  </style>
  <div id="line"></div>
`

customElements.define('pt-knob',
  /**
   * Element representing a pt-knob.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-knob.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.line = this.shadowRoot.querySelector('#line')
      this.angle = 45
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      /**
       * Handle pointer down event.
       *
       * @param {PointerEvent} event Pointer event.
       */
      this.onPointerDown = event => {
        event.preventDefault()
        if (event.buttons === 1) {
          this.#startRotating(event)
        }
      }

      /**
       * Handles rotation and is here to be able to remove the event listener.
       *
       * @param {PointerEvent} event Pointer event.
       * @returns {void}
       */
      this.onRotate = event => this.#rotate(event)

      /**
      * Handles stopping rotation and is here to be able to remove the event listener.
      *
      * @param {PointerEvent} event Pointer event.
      * @returns {void}
      */
      this.onStopRotate = event => this.#stopRotate(event)

      this.addEventListener('pointerdown', this.onPointerDown)
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
      return ['min', 'max', 'value', 'step']
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'min') {
        this.min = parseInt(newValue)
      } else if (name === 'max') {
        this.max = parseInt(newValue)
      } else if (name === 'value') {
        const value = parseFloat(this.value)
        if (value >= this.min && value <= this.max) {
          this.value = value
        }
      } else if (name === 'step') {
        this.step = parseFloat(newValue)
      }
    }

    /**
     * Start rotating.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #startRotating (event) {
      document.addEventListener('pointermove', this.onRotate)
      document.addEventListener('pointerup', this.onStopRotate)
      document.addEventListener('pointerleave', this.onStopRotate)
    }

    /**
     * Stop rotating and remove event listeners.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #stopRotate (event) {
      document.removeEventListener('pointermove', this.onRotate)
      document.removeEventListener('pointerup', this.onStopRotate)
      document.removeEventListener('pointerleave', this.onStopRotate)
    }

    /**
     * Rotate the line.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #rotate (event) {
      console.log(event.movementY)
      this.angle += event.movementY
      if (this.angle < 45) {
        this.angle = 45
      } else if (this.angle > 315) {
        this.angle = 315
      }
      this.line.style.transform = `rotate(${this.angle}deg)`
    }
  }
)
