/**
 * The pt-editor web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

 import * as Tone from 'tone'

const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host {
    display: grid;
    grid-template-rows: 40rem;
    grid-template-columns: minmax(16rem, 24rem) minmax(48rem, auto);
    grid-template-areas:  "instruments piano-roll";
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
  </style>
  <div id="list">
    <button>+</button>
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

      this.ws.addEventListener('open', () => {
        this.ws.addEventListener('message', async event => {
          const message = await event.message
          this.#handleMessage(message)
        })
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
       if (message.action === 'instrument-add') {
         console.log('add instrument')
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
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
      this.button.addEventListener('click', event => {
        event.preventDefault()
        this.#newInstrument()
      })
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }

    /**
     * Add a new instrument to the list.
     */
    #newInstrument () {
      const instrument = document.createElement('pt-instrument')
      const roll = document.createElement('pt-piano-roll')

      instrument.roll = roll

      instrument.setAttribute('instrument', 'casio')

      instrument.uuid = crypto.randomUUID()
      roll.uuid = crypto.randomUUID()

      instrument.addEventListener('instrument-select', event => {
        this.instrument = event.target.instrument
        this.roll = event.target.roll
        this.rollHolder.replaceChildren(event.target.roll)
      })

      this.list.insertBefore(instrument, this.button)

      this.rollHolder.replaceChildren(roll)
    }
  }
)
