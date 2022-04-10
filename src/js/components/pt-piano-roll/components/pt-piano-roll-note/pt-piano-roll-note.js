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

      this.addEventListener('contextmenu', event => event.preventDefault())
      this.resizer.addEventListener('pointerdown', event => this.#startResizing(event))
      this.resizer.addEventListener('pointerup', event => this.#stopResizing(event))
      this.resizer.addEventListener('pointerleave', event => this.#stopResizing(event))

      /**
       * Handles resizing and is here to be able to remove the event listener.
       *
       * @param {PointerEvent} event Pointer event.
       * @returns {void}
       */
      this.onResize = event => this.#resize(event)
    }

    /**
     * Starts listening to pointermove and increases resizer hitbox.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #startResizing (event) {
      if (event.button === 0) {
        this.startWidth = this.offsetWidth
        document.addEventListener('pointermove', this.onResize)
        this.resizer.style.transform = 'scale(50, 10)'
      }
    }

    /**
     * Stops resizing the note block and removes the pointermove listener.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #stopResizing (event) {
      document.removeEventListener('pointermove', this.onResize)
      this.resizer.style.transform = 'scale(1)'
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
