/**
 * The main script file of the application.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import './components/pt-app'
import isUUID from 'validator/es/lib/isUUID'

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

/**
 * Sends a ping to the Websocket server.
 */
function ping () {
  if (window.ws.readyState === window.ws.OPEN) {
    window.ws.send(JSON.stringify({ action: 'ping' }))
  }
}

// Send a ping message to Websocket server to keep the connection alive.
setInterval(ping, 45000)

// Start the app if the user was authenticated
window.ws.addEventListener('message', async event => {
  const message = await event.message
  if (message.action === 'session-authenticated') {
    const app = document.createElement('pt-app')
    document.body.replaceChildren(app)
  } else if (message.message === 'authentication-failed') {
    sessionPassword.setCustomValidity('Wrong password.')
    sessionPassword.reportValidity()
  }
})

// Add id to the url with the newly created session and add it to the browser history
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

if (isUUID(id)) {
  sessionJoin.toggleAttribute('hidden', false)
} else {
  sessionJoin.toggleAttribute('hidden', true)
}

// Only try to authenticate if the id is valid
submitButton.addEventListener('click', event => {
  if (window.ws.readyState === window.ws.OPEN) {
    if (isUUID(id)) {
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

const playAloneButton = document.querySelector('#play-alone-button')

playAloneButton.addEventListener('click', () => {
  window.ws.close()
  window.history.pushState('Prototune', '', '?')
  const app = document.createElement('pt-app')
  document.body.replaceChildren(app)
})
