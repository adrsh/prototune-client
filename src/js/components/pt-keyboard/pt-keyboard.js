/**
 * The keyboard web component module.
 *
 * @author Adrian Shosholli <as227cw@student.lnu.se>
 * @version 1.0.0
 */

import './components/pt-keyboard-note'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    #keyboard {
      display: flex;
      flex-direction: row;
    }
    .octave {
      position: relative;
      height: 12rem;
    }
    .white-notes {
      display: flex;
      position: relative;
      height: 100%;
    }
    .black-notes {
      display: flex;
      position: absolute;
      top: 0px;
      height: 55%;
      width: 100%;
      justify-content: center;
    }
    .black-notes > pt-keyboard-note {
      background-color: #101010;
      outline: 1px solid white;
    }
    .black-notes > pt-keyboard-note:hover {
      background-color: #202020;
    }
    .black-notes > .playing {
      background-color: #404040 !important;
    }
    .white-notes > pt-keyboard-note:hover {
      background-color: #F0F0F0;
    }
    .white-notes > .playing {
      background-color: #e0e0e0 !important;
    }
    .invisible {
      visibility: hidden;
    }
  </style>
  <div id="keyboard">
  <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="21"></pt-keyboard-note>
        <pt-keyboard-note note="23"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="22"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="24"></pt-keyboard-note>
        <pt-keyboard-note note="26"></pt-keyboard-note>
        <pt-keyboard-note note="28"></pt-keyboard-note>
        <pt-keyboard-note note="29"></pt-keyboard-note>
        <pt-keyboard-note note="31"></pt-keyboard-note>
        <pt-keyboard-note note="33"></pt-keyboard-note>
        <pt-keyboard-note note="35"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="25"></pt-keyboard-note>
        <pt-keyboard-note note="27"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="30"></pt-keyboard-note>
        <pt-keyboard-note note="32"></pt-keyboard-note>
        <pt-keyboard-note note="34"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="36"></pt-keyboard-note>
        <pt-keyboard-note note="38"></pt-keyboard-note>
        <pt-keyboard-note note="40"></pt-keyboard-note>
        <pt-keyboard-note note="41"></pt-keyboard-note>
        <pt-keyboard-note note="43"></pt-keyboard-note>
        <pt-keyboard-note note="45"></pt-keyboard-note>
        <pt-keyboard-note note="47"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="37"></pt-keyboard-note>
        <pt-keyboard-note note="39"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="42"></pt-keyboard-note>
        <pt-keyboard-note note="44"></pt-keyboard-note>
        <pt-keyboard-note note="46"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="48"></pt-keyboard-note>
        <pt-keyboard-note note="50"></pt-keyboard-note>
        <pt-keyboard-note note="52"></pt-keyboard-note>
        <pt-keyboard-note note="53"></pt-keyboard-note>
        <pt-keyboard-note note="55"></pt-keyboard-note>
        <pt-keyboard-note note="57"></pt-keyboard-note>
        <pt-keyboard-note note="59"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="49"></pt-keyboard-note>
        <pt-keyboard-note note="51"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="54"></pt-keyboard-note>
        <pt-keyboard-note note="56"></pt-keyboard-note>
        <pt-keyboard-note note="58"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="60"></pt-keyboard-note>
        <pt-keyboard-note note="62"></pt-keyboard-note>
        <pt-keyboard-note note="64"></pt-keyboard-note>
        <pt-keyboard-note note="65"></pt-keyboard-note>
        <pt-keyboard-note note="67"></pt-keyboard-note>
        <pt-keyboard-note note="69"></pt-keyboard-note>
        <pt-keyboard-note note="71"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="61"></pt-keyboard-note>
        <pt-keyboard-note note="63"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="66"></pt-keyboard-note>
        <pt-keyboard-note note="68"></pt-keyboard-note>
        <pt-keyboard-note note="70"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="72"></pt-keyboard-note>
        <pt-keyboard-note note="74"></pt-keyboard-note>
        <pt-keyboard-note note="76"></pt-keyboard-note>
        <pt-keyboard-note note="77"></pt-keyboard-note>
        <pt-keyboard-note note="79"></pt-keyboard-note>
        <pt-keyboard-note note="81"></pt-keyboard-note>
        <pt-keyboard-note note="83"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="73"></pt-keyboard-note>
        <pt-keyboard-note note="75"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="78"></pt-keyboard-note>
        <pt-keyboard-note note="80"></pt-keyboard-note>
        <pt-keyboard-note note="82"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="84"></pt-keyboard-note>
        <pt-keyboard-note note="86"></pt-keyboard-note>
        <pt-keyboard-note note="88"></pt-keyboard-note>
        <pt-keyboard-note note="89"></pt-keyboard-note>
        <pt-keyboard-note note="91"></pt-keyboard-note>
        <pt-keyboard-note note="93"></pt-keyboard-note>
        <pt-keyboard-note note="95"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="85"></pt-keyboard-note>
        <pt-keyboard-note note="87"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="90"></pt-keyboard-note>
        <pt-keyboard-note note="92"></pt-keyboard-note>
        <pt-keyboard-note note="94"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="96"></pt-keyboard-note>
        <pt-keyboard-note note="98"></pt-keyboard-note>
        <pt-keyboard-note note="100"></pt-keyboard-note>
        <pt-keyboard-note note="101"></pt-keyboard-note>
        <pt-keyboard-note note="103"></pt-keyboard-note>
        <pt-keyboard-note note="105"></pt-keyboard-note>
        <pt-keyboard-note note="107"></pt-keyboard-note>
      </div>
      <div class="black-notes">
        <pt-keyboard-note note="97"></pt-keyboard-note>
        <pt-keyboard-note note="99"></pt-keyboard-note>
        <pt-keyboard-note class="invisible"></pt-keyboard-note>
        <pt-keyboard-note note="102"></pt-keyboard-note>
        <pt-keyboard-note note="104"></pt-keyboard-note>
        <pt-keyboard-note note="106"></pt-keyboard-note>
      </div>
    </div>
    <div class="octave">
      <div class="white-notes">
        <pt-keyboard-note note="108"></pt-keyboard-note>
      </div>
    </div>
  </div>
`

customElements.define('pt-keyboard',
  /**
   * Element representing a pt-keyboard.
   */
  class extends HTMLElement {
    /**
     * Constructor for pt-keyboard.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    /**
     * Called after the element is inserted to the DOM.
     */
    connectedCallback () {
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)
