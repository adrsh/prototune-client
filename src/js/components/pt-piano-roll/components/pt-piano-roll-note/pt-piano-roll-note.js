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
      background-color: #404040;
      height: 1rem;
      width: 1rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      border-right: 0.2rem #808080 solid;
      box-sizing: border-box;
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
      this.attack = Tone.Transport.schedule((time) => this.synth.triggerAttack(Tone.Midi(this.note), time), `0:0:${this.x}`)
      // Eftersom det just nu loopas varje 64 så triggas releasen vid 0 om den skulle gjorts vid 64
      this.release = Tone.Transport.schedule((time) => this.synth.triggerRelease(Tone.Midi(this.note), time), `0:0:${(parseInt(this.x) + 1) % 64}`)
      this.addEventListener('mousedown', event => {
        // Stops grid underneath from getting triggered by the click.
        event.stopPropagation()
        if (event.button === 2) {
          this.remove()
        }
      })

      this.addEventListener('pointerdown', event => this.#startMoving(event))
      /* this.addEventListener('pointerup', event => {
        if (event.button === 0) {
          this.#stopMoving()
        }
      }) */

      this.addEventListener('contextmenu', event => event.preventDefault())

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
      this.onStopResizing = event => this.#stopResizing()
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
      }
    }

    /**
     * Moving note block using pointer data.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #moving (event) {
      this.movementX += event.movementX
      this.movementY += event.movementY

      // Maybe fix this for better readability
      if (Math.round(this.movementX / 16) + parseInt(this.x) >= 0) {
        this.style.left = Math.round(this.movementX / 16) + parseInt(this.x) + 'rem'
      }

      if (Math.round(this.movementY / 16) + parseInt(this.y) >= 0) {
        this.style.top = Math.round(this.movementY / 16) + parseInt(this.y) + 'rem'
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

      this.setAttribute('x', Math.round(this.movementX / 16) + parseInt(this.x))
      this.setAttribute('y', Math.round(this.movementY / 16) + parseInt(this.y))
    }

    /**
     * Starts listening to pointermove and increases resizer hitbox.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #startResizing (event) {
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
      this.length = Math.round((this.startWidth) / 16)
      // TODO: Fix bug with note that spans all 64 and does not release after loop. But this problem does not exist if there is no loop.
      Tone.Transport.clear(this.release)
      this.release = Tone.Transport.schedule((time) => this.synth.triggerRelease(Tone.Midi(this.note), time), `0:0:${(parseInt(this.x) + this.length)}`)
    }

    /**
     * Resizing the note block using pointer movement.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #resize (event) {
      this.startWidth += event.movementX
      if (this.startWidth > 16) {
        this.style.width = `${Math.round((this.startWidth) / 16)}rem`
      }
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
      Tone.Transport.clear(this.attack)
      Tone.Transport.clear(this.release)
    }

    /**
     * Returns element attributes to observe.
     *
     * @returns {string[]} An array of attributes to observe.
     */
    static get observedAttributes () {
      return ['note', 'x', 'y']
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
        this.note = newValue
        // this.setAttribute('y', )
      } else if (name === 'x') {
        this.x = newValue
        this.style.left = `${this.x}rem`
      } else if (name === 'y') {
        this.y = newValue
        this.style.top = `${this.y}rem`
      }
    }
  }
)
