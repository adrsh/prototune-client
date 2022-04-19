/**
 * The piano-roll web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import * as Tone from 'tone'
import './components/pt-piano-roll-note'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      overflow-y: scroll;
      outline: 1px grey solid;
    }
    #grid {
      position: relative;
      width: 64rem;
      height: 88rem;
      background-image:
        repeating-linear-gradient(
          90deg,
          transparent 0.03125rem 3.96875rem,
          #b0b0b0 3.96875rem 4.03125rem
        ),
        repeating-linear-gradient(
          transparent 0.03125rem 0.96875rem,
          #e0e0e0 0.96875rem 1.03125rem
        ),
        repeating-linear-gradient(
          90deg,
          transparent 0.03125rem 0.96875rem,
          #e0e0e0 0.96875rem 1.03125rem
        ),
        repeating-linear-gradient(
          transparent 0rem 1rem,
          transparent 1rem 2rem,
          #f0f0f0 2rem 3rem,
          transparent 3rem 4rem,
          #f0f0f0 4rem 5rem,
          transparent 5rem 6rem,
          #f0f0f0 6rem 7rem,
          transparent 7rem 8rem,
          transparent 8rem 9rem,
          #f0f0f0 9rem 10rem,
          transparent 10rem 11rem,
          #f0f0f0 11rem 12rem
        );
    }
  </style>
  <div id="grid">
  </div>
`

customElements.define('pt-piano-roll',
  /**
   * Element representing a pt-piano-roll.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-piano-roll.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.grid = this.shadowRoot.querySelector('#grid')
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      this.synth = new Tone.PolySynth(Tone.Synth).toDestination()
      this.synth.volume.value = -6

      this.grid.addEventListener('pointerdown', event => {
        if (event.button === 0) {
          this.#createNote(event)
        }
      })

      this.addEventListener('import', event => this.#import(event.detail.notes))

      this.grid.addEventListener('contextmenu', event => event.preventDefault())

      this.addEventListener('note-move', event => {
        this.dispatchEvent(new CustomEvent('update', { detail: { notes: this.#toObject() } }))
      })

      this.addEventListener('note-remove', event => {
        event.detail.remove()
        this.dispatchEvent(new CustomEvent('update', { detail: { notes: this.#toObject() } }))
      })

      this.addEventListener('note-resize', event => {
        this.dispatchEvent(new CustomEvent('update', { detail: { notes: this.#toObject() } }))
      })

      this.scrollTo(0, 512)
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }

    /**
     * Imports a list of notes to piano roll note elements.
     *
     * @param {list} list List of notes.
     */
    #import (list) {
      while (this.grid.hasChildNodes()) {
        this.grid.removeChild(this.grid.lastChild)
      }
      for (const note of list) {
        const newNote = document.createElement('pt-piano-roll-note')
        newNote.synth = this.synth
        newNote.setAttribute('note', 108 - note.y)
        newNote.setAttribute('x', note.x)
        newNote.setAttribute('y', note.y)
        newNote.setAttribute('length', note.length)
        this.grid.append(newNote)
      }
    }

    /**
     * Creates a new note on the user click and appends it to the grid.
     *
     * @param {PointerEvent} event Pointer event.
     */
    #createNote (event) {
      const x = Math.trunc(event.offsetX / 16)
      const y = Math.trunc(event.offsetY / 16)
      const note = document.createElement('pt-piano-roll-note')
      note.synth = this.synth
      note.setAttribute('note', 108 - y)
      note.setAttribute('x', x)
      note.setAttribute('y', y)
      note.setAttribute('length', 1)
      this.grid.append(note)

      const now = Tone.now()
      this.synth.triggerAttackRelease(Tone.Midi(108 - y), '16n', now)

      this.dispatchEvent(new CustomEvent('update', { detail: { notes: this.#toObject() } }))
    }

    /**
     * Converts piano roll to JSON format.
     *
     * @returns {list} List of note objects.
     */
    #toObject () {
      const notes = this.grid.querySelectorAll('pt-piano-roll-note')
      const list = []
      for (const note of notes) {
        const obj = {
          x: note.x,
          y: note.y,
          length: note.length
        }
        list.push(obj)
      }
      return list
    }
  }
)
