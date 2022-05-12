/**
 * The keyboard note component module.
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
      width: 2.5rem;
      background-color: #FFFFFF;
      outline: 1px solid black;
      align-items: flex-end;
      justify-content: center;
      color: #808080;
    }
    #note {
      font-family: sans-serif;
      font-size: 0.6rem;
      user-select: none;
      padding: 0.5rem;
    }
  </style>
  <div id="note">C4</div>
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
      /**
       * Plays note on pointer down.
       *
       * @param {PointerEvent} event Pointer event.
       */
      this.onPointerDown = event => {
        event.preventDefault()
        if (event.buttons === 1 || event.pointerType === 'touch') {
          this.#playNote()
        }
      }

      /**
       * Plays note on pointer enter.
       *
       * @param {PointerEvent} event Pointer event.
       */
      this.onPointerEnter = event => {
        event.preventDefault()
        if (event.buttons === 1 || event.pointerType === 'touch') {
          this.#playNote()
        }
      }

      /**
       * Stops note from playing.
       *
       * @param {PointerEvent} event Pointer event.
       */
      this.onNoteStop = event => {
        event.preventDefault()
        this.#stopNote()
      }

      this.addEventListener('pointerdown', this.onPointerDown)
      this.addEventListener('pointerenter', this.onPointerEnter)

      const noteName = this.shadowRoot.querySelector('#note')

      noteName.textContent = Tone.Frequency(this.note, 'midi').toNote()
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
      this.addEventListener('pointerup', this.onNoteStop)
      this.addEventListener('pointerleave', this.onNoteStop)
      this.dispatchEvent(new CustomEvent('note-play', { detail: { note: this.note }, composed: true }))
      this.classList.add('playing')
    }

    /**
     * Handles note being released.
     */
    #stopNote () {
      this.removeEventListener('pointerup', this.onNoteStop)
      this.removeEventListener('pointerleave', this.onNoteStop)
      this.dispatchEvent(new CustomEvent('note-stop', { detail: { note: this.note }, composed: true }))
      this.classList.remove('playing')
    }
  }
)
