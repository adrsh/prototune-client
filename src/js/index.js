/**
 * The main script file of the application.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import './components/pt-keyboard'

const ws = new WebSocket('ws://192.168.3.8:8080')

ws.addEventListener('message', event => handleMessage(event.data))

const keyboard = document.querySelector('pt-keyboard')
keyboard.addEventListener('note-play', event => sendMessage({ note: event.detail.note, action: 'play' }))
keyboard.addEventListener('note-stop', event => sendMessage({ note: event.detail.note, action: 'stop' }))

/**
 * Handles messages from Websocket server
 *
 * @param {Blob} data Data to be handled.
 */
async function handleMessage (data) {
  const message = JSON.parse(await data.text())
  if (message.action === 'play') {
    keyboard.dispatchEvent(new CustomEvent('msg-play', { detail: { note: message.note } }))
  } else if (message.action === 'stop') {
    keyboard.dispatchEvent(new CustomEvent('msg-stop', { detail: { note: message.note } }))
  }
  console.log(message)
}

/**
 * Sends data to Websocket server.
 * @param {Object} data Data to be sent.
 */
function sendMessage (data) {
  ws.send(JSON.stringify(data))
}
