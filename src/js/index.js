/**
 * The main script file of the application.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import './components/pt-keyboard'

const keyboard = document.createElement('pt-keyboard')
const body = document.querySelector('body')
body.appendChild(keyboard)
