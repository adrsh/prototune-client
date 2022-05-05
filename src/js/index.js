/**
 * The main script file of the application.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import './components/pt-app'
import './components/pt-keyboard'
import './components/pt-piano-roll'
import './components/pt-editor'
import './components/pt-time-line'
import './components/pt-instrument'
import './components/pt-playback'

// window.ws = new WebSocket('wss://cscloud7-168.lnu.se/websocket/')
window.ws = new WebSocket('ws://localhost:8080')

/**
 * Make the message blob text get parsed from JSON. Kind of like a middleware.
 *
 * @param {MessageEvent} event Event to be handled.
 */
window.ws.onmessage = async function (event) {
  try {
    event.message = JSON.parse(event.data)
  } catch (e) {
    console.log('Something went wrong when parsing: ' + event.data)
  }
}

window.ws.addEventListener('message', async event => {
  const message = await event.message
  if (message.action === 'session-authenticated') {
    const app = document.createElement('pt-app')
    document.body.replaceChildren(app)
  }
})

window.ws.addEventListener('message', async event => {
  const message = await event.message
  if (message['session-id']) {
    window.history.pushState('Prototune', '', `?${message['session-id']}`)
    const app = document.createElement('pt-app')
    document.body.replaceChildren(app)
  }
})

const url = new URL(window.location)
const id = url.search.substring(1, 37)

const sessionPassword = document.querySelector('#session-password')
const submitButton = document.querySelector('#submit-button')
const sessionJoin = document.querySelector('#session-join')

if (id.length === 36) {
  sessionJoin.toggleAttribute('hidden', false)
} else {
  sessionJoin.toggleAttribute('hidden', true)
}

submitButton.addEventListener('click', event => {
  if (window.ws.readyState === window.ws.OPEN) {
    if (id.length === 36) {
      window.ws.send(JSON.stringify({
        action: 'session-auth',
        id,
        password: sessionPassword.value
      }))
    }
  }
})

const sessionCreateButton = document.querySelector('#session-create')
const sessionCreatePassword = document.querySelector('#session-create-password')

sessionCreateButton.addEventListener('click', event => {
  if (window.ws.readyState === window.ws.OPEN) {
    window.ws.send(JSON.stringify({
      action: 'session-create',
      password: sessionCreatePassword.value
    }))
  }
})

const playOfflineButton = document.querySelector('#play-offline-button')

playOfflineButton.addEventListener('click', () => {
  const app = document.createElement('pt-app')
  document.body.replaceChildren(app)
})
