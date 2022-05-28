/**
 * The pt-editor web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import '../pt-piano-roll'
import '../pt-instrument'
import '../pt-time-line'
import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host {
    display: grid;
    grid-template-rows: minmax(8rem, 40rem);
    grid-template-columns: minmax(16rem, 24rem) minmax(48rem, auto);
    grid-template-areas:  "instruments editor";
  }
  #roll {
    grid-area: piano-roll;
    position: relative;
    display: flex;
    flex-direction: row;
    overflow-x: hidden;
  }
  button {
    height: 4rem;
    font-size: 3rem;
    background-color: #ffffff;
    border: 0px;
    user-select: none;
  }
  button:hover {
    background-color: #eee;
    cursor: pointer;
  }
  #list {
    display: flex;
    flex-direction: column;
    grid-area: instruments;
    border-right: 1px solid gray;
    overflow-y: scroll;
  }
  .selected {
    background-color: #f8f8f8;
  }
  #editor {
    grid-area: editor;
    display: grid;
    grid-template-rows: 1rem 88rem;
    grid-template-columns: 3rem auto;
    grid-template-areas:  "blocker time-line" "note-bar piano-roll";
    overflow-y: scroll;
  }
  #blocker {
    grid-area: blocker;
    position: sticky;
    top: 0px;
    width: 100%;
    background-color: #ededed;
    border-bottom: 1px solid gray;
    z-index: 2;
    box-sizing: border-box;
  }
  pt-time-line {
    grid-area: time-line;
    position: sticky;
    top: 0px;
    z-index: 2;
  }
  pt-instrument {
    background-color: #ffffff;
  }
  pt-piano-roll {
  }
  #note-bar {
    grid-area: note-bar;
    position: sticky;
    height: 88rem;
    width: 3rem;
    left: 0px;
    top: 0px;
    z-index: 1;
    background-image:
        repeating-linear-gradient(
          transparent 0 0.9375rem,
          #e8e8e8 0.9375rem 1rem
        ),
        repeating-linear-gradient(
          white 0rem 1rem,
          white 1rem 2rem,
          #e0e0e0 2rem 3rem,
          white 3rem 4rem,
          #e0e0e0 4rem 5rem,
          white 5rem 6rem,
          #e0e0e0 6rem 7rem,
          white 7rem 8rem,
          white 8rem 9rem,
          #e0e0e0 9rem 10rem,
          white 10rem 11rem,
          #e0e0e0 11rem 12rem
        );
    display: flex;
    flex-direction: column;
    border-right: 1px solid black;
    user-select: none;
  }
  #note-bar > span {
    height: 100%;
    width: 100%;
    font-family: sans-serif;
    font-size: 0.6rem;
    display: flex;
    justify-content: flex-end;
    padding-right: 0.2rem;
    box-sizing: border-box;
  }
  </style>
  <div id="list">
    <button title="Add a new instrument">+</button>
  </div>
  <div id="editor">
    <div id="blocker"></div>
    <pt-time-line></pt-time-line>
    <div id="note-bar">
    </div>
    <div id="roll">
    </div>
</div>
`

customElements.define('pt-editor',
  /**
   * Element representing pt-editor.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-editor.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.list = this.shadowRoot.querySelector('#list')
      this.rollHolder = this.shadowRoot.querySelector('#roll')
      this.button = this.shadowRoot.querySelector('button')

      this.ws = window.ws

      this.ws.addEventListener('message', async event => {
        const message = await event.message
        this.#handleMessage(message)
      })

      this.config = {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['instrument', 'volume', 'reverb', 'delay']
      }

      // Try to get a session, and one is recieved if there is an id associated with the client on the server.
      this.#sendMessage({ action: 'session-get' })

      this.observer = new MutationObserver(records => this.#handleMutations(records))
      this.observer.observe(this.list, this.config)
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      this.button.addEventListener('click', event => {
        event.preventDefault()
        this.#newInstrument()
      })

      // Create divs with note names
      this.noteBar = this.shadowRoot.querySelector('#note-bar')
      for (let i = 108; i >= 21; i--) {
        const div = document.createElement('span')
        div.textContent = Tone.Frequency(i, 'midi').toNote()
        this.noteBar.append(div)
      }
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
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
          target.uuid = mutation.target.uuid
          // Make sure that values gets sent as numbers and not strings
          if (mutation.attributeName === 'instrument') {
            target.props = {
              [mutation.attributeName]: mutation.target.getAttribute(mutation.attributeName)
            }
          } else {
            target.props = {
              [mutation.attributeName]: parseFloat(mutation.target.getAttribute(mutation.attributeName))
            }
          }
        } else if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
              this.#sendMessage({
                action: 'instrument-create',
                uuid: node.uuid,
                props: {
                  roll: node.roll.uuid,
                  instrument: node.getAttribute('instrument'),
                  volume: parseFloat(node.getAttribute('volume')),
                  reverb: parseFloat(node.getAttribute('reverb')),
                  delay: parseFloat(node.getAttribute('delay'))
                }
              })
            }
          } else if (mutation.removedNodes.length > 0) {
            for (const node of mutation.removedNodes) {
              this.#sendMessage({ action: 'instrument-remove', uuid: node.uuid })
            }
          }
        }
      }
      if (Object.keys(target).length > 0) {
        this.#sendMessage({ action: 'instrument-update', ...target })
      }
    }

    /**
     * Handles messages from Websocket server.
     *
     * @param {object} message Message to be handled.
     */
    #handleMessage (message) {
      if (message.action === 'editor-import') {
        this.#importSession(message)
      } else if (message.action === 'instrument-create') {
        this.#addInstrument(message)
      } else if (message.action === 'instrument-update') {
        this.#updateInstrument(message)
      } else if (message.action === 'instrument-remove') {
        this.#removeInstrument(message)
      }
    }

    /**
     * Adds an instrument created by someone else in Websocket session.
     *
     * @param {object} message Message with instrument data.
     */
    #addInstrument (message) {
      this.observer.disconnect()
      const instrument = document.createElement('pt-instrument')
      const roll = document.createElement('pt-piano-roll')

      instrument.roll = roll

      instrument.setAttribute('uuid', message.uuid)
      instrument.setAttribute('instrument', message.props.instrument)
      instrument.setAttribute('volume', message.props.volume)
      instrument.setAttribute('reverb', message.props.reverb)
      instrument.setAttribute('delay', message.props.delay)

      roll.setAttribute('uuid', message.props.roll)

      instrument.addEventListener('instrument-select', event => {
        this.instrument = event.target.instrument
        this.dispatchEvent(new CustomEvent('instrument-change'))
        this.rollHolder.querySelectorAll('pt-piano-roll').forEach(element => element.toggleAttribute('hidden', true))
        event.target.roll.toggleAttribute('hidden')
      })

      instrument.addEventListener('instrument-change', event => {
        this.instrument = event.target.instrument
        this.dispatchEvent(new CustomEvent('instrument-change'))
      })

      instrument.addEventListener('instrument-select', event => {
        this.list.querySelectorAll('pt-instrument').forEach(element => element.classList.remove('selected'))
        event.target.classList.add('selected')
      })

      this.list.insertBefore(instrument, this.button)

      roll.toggleAttribute('hidden', true)

      this.rollHolder.appendChild(roll)

      this.observer.observe(this.list, this.config)
    }

    /**
     * Update an instrument updated by someone else in Websocket session.
     *
     * @param {object} message Message with instrument data.
     */
    #updateInstrument (message) {
      this.observer.disconnect()
      const existingInstrument = this.list.querySelector(`pt-instrument[uuid="${message.uuid}"]`)
      if (existingInstrument) {
        for (const [key, value] of Object.entries(message.props)) {
          existingInstrument.setAttribute(key, value)
        }
      }
      this.observer.observe(this.list, this.config)
    }

    /**
     * Remove an instrument removed by someone else in Websocket session.
     *
     * @param {object} message Message with instrument data.
     */
    #removeInstrument (message) {
      this.observer.disconnect()
      const existingInstrument = this.list.querySelector(`pt-instrument[uuid="${message.uuid}"]`)
      if (existingInstrument) {
        existingInstrument.roll.remove()
        existingInstrument.remove()
      }
      this.observer.observe(this.list, this.config)
    }

    /**
     * Imports session data.
     *
     * @param {object} message Message with data to import.
     */
    #importSession (message) {
      this.observer.disconnect()
      for (const [uuid, props] of Object.entries(message.instruments)) {
        const instrument = document.createElement('pt-instrument')
        const roll = document.createElement('pt-piano-roll')
        instrument.setAttribute('uuid', uuid)
        instrument.roll = roll
        instrument.setAttribute('instrument', props.instrument)
        instrument.setAttribute('volume', props.volume)
        instrument.setAttribute('reverb', props.reverb)
        instrument.setAttribute('delay', props.delay)

        roll.setAttribute('uuid', props.roll)
        roll.toggleAttribute('hidden', true)

        instrument.addEventListener('instrument-select', event => {
          this.instrument = event.target.instrument
          this.dispatchEvent(new CustomEvent('instrument-change'))
          this.rollHolder.querySelectorAll('pt-piano-roll').forEach(element => element.toggleAttribute('hidden', true))
          event.target.roll.toggleAttribute('hidden')
        })

        instrument.addEventListener('instrument-change', event => {
          this.instrument = event.target.instrument
          this.dispatchEvent(new CustomEvent('instrument-change'))
        })

        instrument.addEventListener('instrument-select', event => {
          this.list.querySelectorAll('pt-instrument').forEach(element => element.classList.remove('selected'))
          event.target.classList.add('selected')
        })

        for (const [uuid, attributes] of Object.entries(message.rolls[props.roll])) {
          const note = document.createElement('pt-piano-roll-note')
          note.instrument = roll.instrument
          note.setAttribute('uuid', uuid)
          note.setAttribute('note', 108 - attributes.y)
          note.setAttribute('x', attributes.x)
          note.setAttribute('y', attributes.y)
          note.setAttribute('length', attributes.length)
          note.setAttribute('slot', 'grid')
          roll.append(note)
        }

        this.list.insertBefore(instrument, this.button)

        this.rollHolder.appendChild(roll)
      }
      this.observer.observe(this.list, this.config)
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
     * Add a new instrument to the list.
     */
    #newInstrument () {
      const instrument = document.createElement('pt-instrument')
      const roll = document.createElement('pt-piano-roll')

      instrument.roll = roll

      instrument.setAttribute('instrument', 'piano')
      instrument.setAttribute('volume', '-6')
      instrument.setAttribute('reverb', '0')
      instrument.setAttribute('delay', '0')

      instrument.setAttribute('uuid', crypto.randomUUID())
      roll.setAttribute('uuid', crypto.randomUUID())

      instrument.addEventListener('instrument-select', event => {
        this.instrument = event.target.instrument
        this.dispatchEvent(new CustomEvent('instrument-change'))
        this.rollHolder.querySelectorAll('pt-piano-roll').forEach(element => element.toggleAttribute('hidden', true))
        event.target.roll.toggleAttribute('hidden')
      })

      instrument.addEventListener('instrument-select', event => {
        this.list.querySelectorAll('pt-instrument').forEach(element => element.classList.remove('selected'))
        event.target.classList.add('selected')
      })

      instrument.addEventListener('instrument-change', event => {
        this.instrument = event.target.instrument
        this.dispatchEvent(new CustomEvent('instrument-change'))
      })

      this.list.insertBefore(instrument, this.button)

      roll.toggleAttribute('hidden', true)

      this.rollHolder.appendChild(roll)
    }
  }
)
