/**
 * The keyboard note component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      width: 2.5rem;
      background-color: #FFFFFF;
      outline: 1px solid black;
    }
  </style>
`

customElements.define('pt-keyboard-note',
  /**
   * Element representing a pt-keyboard-note.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-keyboard-note.
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
      this.addEventListener('pointerdown', event => {
        event.preventDefault()
        this.#playNote()
      })
      this.addEventListener('pointerenter', event => {
        if (event.buttons === 1) {
          this.#playNote()
        }
      })
      // this.addEventListener('pointerup', event => this.#stopNote())
      // this.addEventListener('pointerleave', event => this.#stopNote())
    }

    /**
     * Returns element attributes to observe.
     *
     * @returns {string[]} An array of attributes to observe.
     */
    static get observedAttributes () {
      return ['note']
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
      }
    }

    /**
     * Handles note being pressed.
     */
    #playNote () {
      this.addEventListener('pointerup', event => this.#stopNote())
      this.addEventListener('pointerleave', event => this.#stopNote())
      this.dispatchEvent(new CustomEvent('note-play', { detail: { note: this.note }, bubbles: true }))
      this.classList.add('playing')
    }

    /**
     * Handles note being released.
     */
    #stopNote () {
      this.removeEventListener('pointerup', event => this.#stopNote())
      this.removeEventListener('pointerleave', event => this.#stopNote())
      this.dispatchEvent(new CustomEvent('note-stop', { detail: { note: this.note }, bubbles: true }))
      this.classList.remove('playing')
    }
  }
)
