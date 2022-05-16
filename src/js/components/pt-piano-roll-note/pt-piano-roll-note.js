/**
 * The pt-piano-roll-note web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      position: absolute;
      background-color: #202020;
      opacity: 50%;
      height: 1rem;
      width: 1rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      border-right: 0.2rem #808080 solid;
      box-sizing: border-box;
      cursor: grab;
    }
    #resizer {
      position: absolute;
      height: 1rem;
      width: 0.2rem;
      right: -0.2rem;
    }
    #resizer:hover {
      cursor: e-resize;
    }
  </style>
  <div id="resizer"></div>
`

customElements.define('pt-piano-roll-note',
  /**
   * Element representing a pt-piano-roll-note.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-piano-roll-note.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.resizer = this.shadowRoot.querySelector('#resizer')
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      this.style.top = `${this.y}rem`
      this.style.left = `${this.x}rem`

      if (!this.transport) {
        this.#updateTransport()
      }

      // Remove itself if right mouse button is clicked.
      this.addEventListener('pointerdown', event => {
        // Stops grid underneath from getting triggered by the click.
        event.stopImmediatePropagation()
        if (event.button === 2) {
          this.remove()
        } else if (event.button === 0) {
          this.#startMoving(event)
        }
      })

      // Remove if right click is held while hovered.
      this.addEventListener('pointerenter', event => {
        event.stopPropagation()
        if (event.buttons === 2) {
          this.remove()
        }
      })

      this.addEventListener('contextmenu', event => event.preventDefault())
      this.addEventListener('dragstart', event => event.preventDefault())

      this.resizer.addEventListener('pointerdown', event => this.#startResizing(event))

      /**
       * Handles moving and is here to be able to remove the event listener.
       *
       * @param {PointerEvent} event Pointer event.
       * @returns {void}
       */
      this.onMoving = event => this.#moving(event)

      /**
       * Handles stopping moving and is here to be able to remove the event listener.
       *
       * @param {PointerEvent} event Pointer event.
       * @returns {void}
       */
      this.onStopMoving = event => this.#stopMoving(event)

      /**
       * Handles resizing and is here to be able to remove the event listener.
       *
       * @param {PointerEvent} event Pointer event.
       * @returns {void}
       */
      this.onResize = event => this.#resize(event)

      /**
       * Handles stopping resizing and is here to be able to remove the event listener.
       *
       * @param {PointerEvent} event Pointer event.
       * @returns {void}
       */
      this.onStopResizing = event => this.#stopResizing(event)
    }

    /**
     * Enables moving.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #startMoving (event) {
      if (event.button === 0) {
        document.addEventListener('pointermove', this.onMoving)
        document.addEventListener('pointerup', this.onStopMoving)
        document.addEventListener('pointerleave', this.onStopMoving)
        this.movementX = 0
        this.movementY = 0
        this.positionX = this.x
        this.positionY = this.y
        this.oldX = this.x
        this.oldY = this.y
        this.style.cursor = 'grabbing'
      }
    }

    /**
     * Moving note block using pointer data.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #moving (event) {
      // Accumulates the total movement.
      this.movementX += event.movementX
      this.movementY += event.movementY

      const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
      // Calculate the new position.
      this.positionX = Math.round(this.movementX / fontSize) + this.oldX
      this.positionY = Math.round(this.movementY / fontSize) + this.oldY

      // Check limits
      if (this.positionX < 0) {
        this.positionX = 0
      } else if (this.positionX > 63) {
        this.positionX = 63
      }

      if (this.positionY < 0) {
        this.positionY = 0
      } else if (this.positionY > 87) {
        this.positionY = 87
      }

      // Set x and y if the position has changed.
      if (this.x !== this.positionX) {
        this.setAttribute('x', this.positionX)
      }
      if (this.y !== this.positionY) {
        this.setAttribute('y', this.positionY)
        this.setAttribute('note', 108 - this.y)
      }
    }

    /**
     * Handles when note block is not being moved anymore.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #stopMoving (event) {
      document.removeEventListener('pointermove', this.onMoving)
      document.removeEventListener('pointerup', this.onStopMoving)
      document.removeEventListener('pointerleave', this.onStopMoving)

      this.style.cursor = 'grab'

      console.log(this.positionX, this.positionY)

      // TODO: Don't need to make a new transport and all that if nothing has changed.
      if (this.x !== this.positionX) {
        this.setAttribute('x', this.positionX)
      }
      if (this.y !== this.positionY) {
        this.setAttribute('y', this.positionY)
        this.setAttribute('note', 108 - this.y)
      }
    }

    /**
     * Starts listening to pointermove and increases resizer hitbox.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #startResizing (event) {
      event.stopPropagation()
      if (event.button === 0) {
        document.addEventListener('pointerup', this.onStopResizing)
        document.addEventListener('pointerleave', this.onStopResizing)
        document.addEventListener('pointermove', this.onResize)
        this.startWidth = this.offsetWidth
      }
    }

    /**
     * Stops resizing the note block and removes the pointermove listener.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #stopResizing (event) {
      document.removeEventListener('pointerup', this.onStopResizing)
      document.removeEventListener('pointerleave', this.onStopResizing)
      document.removeEventListener('pointermove', this.onResize)
    }

    /**
     * Resizing the note block using pointer movement.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #resize (event) {
      this.startWidth += event.movementX
      const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
      if (this.startWidth > fontSize) {
        this.setAttribute('length', Math.round((this.startWidth) / fontSize))
        this.style.width = `${Math.round((this.startWidth) / fontSize)}rem`
      }
    }

    /**
     * Updates the transport.
     */
    #updateTransport () {
      Tone.Transport.clear(this.transport)
      this.transport = Tone.Transport.schedule((time) => {
        this.instrument.triggerAttackRelease(Tone.Midi(this.note), `0:0:${this.length}`, time)
      }, `0:0:${this.x}`)
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
      Tone.Transport.clear(this.transport)
    }

    /**
     * Returns element attributes to observe.
     *
     * @returns {string[]} An array of attributes to observe.
     */
    static get observedAttributes () {
      return ['note', 'x', 'y', 'length', 'uuid']
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'note') {
        this.note = parseInt(newValue)
      } else if (name === 'x') {
        this.x = parseInt(newValue)
        this.style.left = `${this.x}rem`
        this.#updateTransport()
      } else if (name === 'y') {
        this.y = parseInt(newValue)
        this.style.top = `${this.y}rem`
        this.setAttribute('note', 108 - this.y)
        this.#updateTransport()
      } else if (name === 'length') {
        this.length = parseInt(newValue)
        this.style.width = `${this.length}rem`
        this.#updateTransport()
      } else if (name === 'uuid') {
        this.uuid = newValue
      }
    }
  }
)
