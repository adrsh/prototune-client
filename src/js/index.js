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
import './components/pt-instrument'

// window.ws = new WebSocket('wss://cscloud7-168.lnu.se/websocket/')
window.ws = new WebSocket('ws://localhost:8080')

/**
 * Make the message blob text get parsed from JSON. Kind of like a middleware.
 *
 * @param {MessageEvent} event Event to be handled.
 */
window.ws.onmessage = async function (event) {
  event.message = event.data.text().then(JSON.parse)
}

const app = document.createElement('pt-app')
document.body.append(app)
