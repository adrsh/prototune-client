/**
 * The piano-roll web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import * as Tone from 'tone'
import '../pt-piano-roll-note'

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
      if (!this.instrument) {
        this.instrument = new Tone.PolySynth(Tone.Synth).toDestination()
        this.instrument.volume.value = -6
      }

      this.grid.addEventListener('pointerdown', event => {
        if (event.button === 0) {
          this.#createNote(event)
        }
      })

      this.ws.addEventListener('open', () => {
        this.ws.addEventListener('message', async event => {
          const message = await event.message
          this.#handleMessage(message)
        })
      })

      this.grid.addEventListener('contextmenu', event => event.preventDefault())

      this.scrollTo(0, 512)

      this.config = {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['x', 'y', 'length']
      }

      this.observer = new MutationObserver(records => this.#handleMutations(records))
      this.observer.observe(this.grid, this.config)
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }

    /**
     * Handles messages from Websocket server.
     *
     * @param {object} message Message to be handled.
     */
    #handleMessage (message) {
      console.log(message.action)
      if (message.action === 'note-update') {
        this.#updateNote(message.changes)
      } else if (message.action === 'note-create') {
        this.#addNote(message.note)
      } else if (message.action === 'note-remove') {
        this.#removeNote(message.note)
      } else if (message.action === 'note-import') {
        this.#importNotes(message.notes)
      }
    }

    /**
     * Sends data to Websocket server.
     *
     * @param {object} data Data to be sent.
     */
    #sendMessage (data) {
      if (this.ws.readyState === this.ws.OPEN) {
        this.ws.send(JSON.stringify(data))
      }
    }

    /**
     * Handles mutation records and sends appropriate messages.
     *
     * @param {MutationRecord[]} mutationRecords Mutation records.
     */
    #handleMutations (mutationRecords) {
      const target = {}
      for (const mutation of mutationRecords) {
        // Checking if multiple attributes were changed at the same time, and combining them.
        if (mutation.type === 'attributes') {
          Object.assign(target, {
            uuid: mutation.target.uuid,
            [mutation.attributeName]: mutation.target[mutation.attributeName]
          })
        } else if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0) {
            // I think only one note can be created/added at one point, but just in case.
            for (const node of mutation.addedNodes) {
              this.#sendMessage({
                action: 'note-create',
                note: {
                  uuid: node.uuid,
                  x: node.x,
                  y: node.y,
                  length: node.length
                }
              })
            }
          } else if (mutation.removedNodes.length > 0) {
            for (const node of mutation.removedNodes) {
              this.#sendMessage({ action: 'note-remove', note: { uuid: node.uuid } })
            }
          }
        }
      }
      if (Object.keys(target).length > 0) {
        this.#sendMessage({ action: 'note-update', changes: target })
      }
    }

    /**
     * Imports notes from websocket server.
     *
     * @param {object} notes Object with notes and attributes.
     */
    #importNotes (notes) {
      this.observer.disconnect()
      for (const [uuid, attributes] of Object.entries(notes)) {
        const note = document.createElement('pt-piano-roll-note')
        note.instrument = this.instrument
        note.setAttribute('uuid', uuid)
        note.setAttribute('note', 108 - attributes.y)
        note.setAttribute('x', attributes.x)
        note.setAttribute('y', attributes.y)
        note.setAttribute('length', attributes.length)
        this.grid.append(note)
      }
      this.observer.observe(this.grid, this.config)
    }

    /**
     * Creates a note from Websocket data.
     *
     * @param {object} note Note to be created.
     */
    #addNote (note) {
      this.observer.disconnect()
      const newNote = document.createElement('pt-piano-roll-note')
      newNote.instrument = this.instrument
      newNote.setAttribute('uuid', note.uuid)
      newNote.setAttribute('x', note.x)
      newNote.setAttribute('y', note.y)
      newNote.setAttribute('length', note.length)
      this.grid.append(newNote)
      this.observer.observe(this.grid, this.config)
    }

    /**
     * Creates a note from Websocket data.
     *
     * @param {object} note Note to be created.
     */
    #removeNote (note) {
      this.observer.disconnect()
      const existingNote = this.shadowRoot.querySelector(`pt-piano-roll-note[uuid="${note.uuid}"]`)
      if (existingNote) {
        existingNote.remove()
      }
      this.observer.observe(this.grid, this.config)
    }

    /**
     * Updates an existing note.
     *
     * @param {object} note Note with changes.
     */
    #updateNote (note) {
      this.observer.disconnect()
      const existingNote = this.shadowRoot.querySelector(`pt-piano-roll-note[uuid="${note.uuid}"]`)
      if (existingNote) {
        for (const [key, value] of Object.entries(note)) {
          existingNote.setAttribute(key, value)
        }
      }
      this.observer.observe(this.grid, this.config)
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
      note.instrument = this.instrument
      note.setAttribute('note', 108 - y)
      note.setAttribute('x', x)
      note.setAttribute('y', y)
      note.setAttribute('length', 1)

      note.setAttribute('uuid', crypto.randomUUID())

      this.grid.append(note)

      const now = Tone.now()
      this.instrument.triggerAttackRelease(Tone.Midi(108 - y), '16n', now)
    }
  }
)
