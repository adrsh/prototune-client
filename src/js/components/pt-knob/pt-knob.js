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
    height: 100%;
    width: 100%;
  }
  #knob {
    height: 100%;
    width: 100%;
    display: flex;
    position: relative;
    border-radius: 50%;
    cursor: ns-resize;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border: 0.2rem solid #bbb;
  }
  #line {
    position: absolute;
    top: 50%;
    left: 45%;
    height: 50%;
    width: 10%;
    background-color: #000;
    transform: rotate(180deg);
    transform-origin: center top;
  }
  #value-text {
    font-size: 0.6rem;
    font-family: sans-serif;
    user-select: none;
    position: absolute;
    top: -1rem;
  }
  </style>
  <div id="knob">
    <div id="line"></div>
    <div id="value-text" hidden></div>
  </div>
  
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
      this.angle = 0
      this.step = 1

      this.valueText = this.shadowRoot.querySelector('#value-text')
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

      this.addEventListener('pointerleave', (event) => {
        if (!this.rotating) {
          this.valueText.toggleAttribute('hidden', true)
        }
      })

      this.addEventListener('pointerenter', (event) => {
        this.valueText.toggleAttribute('hidden', false)
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
        this.min = parseFloat(newValue)
        this.delta = Math.abs(this.max - this.min)
      } else if (name === 'max') {
        this.max = parseFloat(newValue)
        this.delta = Math.abs(this.max - this.min)
      } else if (name === 'value') {
        if (oldValue !== newValue) {
          const value = parseFloat(newValue)
          if (value >= this.min && value <= this.max) {
            this.value = value
            if (!this.rotating) {
              this.angle = (((value - this.min) / (this.max - this.min)) * 270) + 45
            }
            this.line.style.transform = `rotate(${this.angle}deg)`
            this.setAttribute('title', this.value.toPrecision(2))
            this.valueText.textContent = this.value
            this.dispatchEvent(new CustomEvent('input'))
          }
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
      this.rotating = true
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
      this.rotating = false
      this.setAttribute('value', this.value.toPrecision(2))
      this.valueText.toggleAttribute('hidden', true)
      this.dispatchEvent(new CustomEvent('change'))
    }

    /**
     * Rotate the line.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #rotate (event) {
      this.prevAngle = this.angle
      this.angle -= event.movementY
      if (this.angle < 45) {
        this.angle = 45
      } else if (this.angle > 315) {
        this.angle = 315
      }
      if (this.angle !== this.prevAngle) {
        /*
        * Calculate which percentage the angle is between 0 and 270, and calculate how much that corresponds between the min and max values, integer divide it by the amount of steps, and then multiply it by the steps to get a corresponding step amount.
        * not actual correct angles are being used right now.
        */
        this.value = this.min + Math.floor((((this.angle - 45) / 270) * this.delta) / this.step) * this.step
        this.setAttribute('value', this.value.toPrecision(2))
        console.log(this.angle, this.value)
      }
    }
  }
)
