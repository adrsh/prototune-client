/**
 * The pt-editor web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import * as Tone from 'tone'

// import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host {
    display: grid;
    grid-template-rows: 1.5rem 38.5rem;
    grid-template-columns: minmax(16rem, 24rem) minmax(48rem, auto);
    grid-template-areas:  "instruments time-bar"
                          "instruments piano-roll";
    border-bottom: 1px solid gray;
  }
  #roll {
    overflow-y: scroll;
    grid-area: piano-roll;
    border-bottom: 1px solid gray;
  }
  button {
    height: 4rem;
    font-size: 3rem;
    background-color: #f8f8f8;
    border: 0px;
  }
  button:hover {
    color: gray;
    cursor: pointer;
  }
  #list {
    display: flex;
    flex-direction: column;
    grid-area: instruments;
    border-right: 1px solid gray;
  }
  #time-bar {
    grid-area: time-bar;
    position:relative;
    height: 1.5rem;
    width: 64rem;
    background-color: #e8e8e8;
    border-bottom: 1px solid gray;
    box-sizing: border-box;
    background-image:
        repeating-linear-gradient(
          90deg,
          transparent 0.03125rem 3.96875rem,
          #a0a0a0 3.96875rem 4.03125rem
        ),
        repeating-linear-gradient(
          90deg,
          transparent 0.03125rem 0.96875rem,
          #d8d8d8 0.96875rem 1.03125rem
        );
  }
  #time-line {
    position: relative;
    height: 1.5rem;
    width: 1px;
    border-left: 1px solid black;
  }
  </style>
  <div id="list">
    <button>+</button>
  </div>
  <div id="time-bar">
    <div id="time-line"></div>
  </div>
  <div id="roll">
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
        attributeFilter: ['instrument']
      }

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
      this.line = this.shadowRoot.querySelector('#time-line')
      this.tick = 0
      Tone.Transport.scheduleRepeat((time) => {
        Tone.Draw.schedule(() => {
          this.line.style.left = `${this.tick++}rem`
        }, time)
      }, '0:0:1')
      // Tone.Transport.on('start', event => console.log('start'))
      Tone.Transport.on('stop', event => {
        this.line.style.left = 0
        this.tick = 0
      })
      Tone.Transport.on('loop', event => {
        this.line.style.left = 0
        this.tick = 0
      })
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
          target.props = {
            [mutation.attributeName]: mutation.target.getAttribute(mutation.attributeName)
          }
        } else if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
              this.#sendMessage({
                action: 'instrument-create',
                uuid: node.uuid,
                props: {
                  roll: node.roll.uuid,
                  instrument: node.getAttribute('instrument')
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

      this.list.insertBefore(instrument, this.button)
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
      console.log(message)
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

        roll.setAttribute('uuid', props.roll)
        roll.toggleAttribute('hidden')

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

      instrument.setAttribute('uuid', crypto.randomUUID())
      roll.setAttribute('uuid', crypto.randomUUID())

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

      this.list.insertBefore(instrument, this.button)

      this.rollHolder.appendChild(roll)
    }
  }
)
