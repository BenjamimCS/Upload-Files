import BaseElement from "./BaseElement"
import Icons from "./Icons"
/**
 * @class
 * @extends BaseElemen
 *
 * Generates a login field
 *
 * @param {Element} sibling - Add to the end of
 */
function Login (sibling) {
  const iconPreset = {width: '15px', height: '15px'}
  const icons = {
    eye: Icons.create(iconPreset, 'eye'),
    eyeBlind: Icons.create(iconPreset, 'eyeBlind')
  }
  const template =
  `<div id="passfield-holder" class="mt-5 flex">`+
    `<div class="flex items-center border border-slate-500 border-solid">`+
      `<label for="loginButton">`+
        `<input type="password" id="passfield" name="password"`+
          `class="text-white outline-none border-box ml-1" `+
          `focus required>`+
      `</label>`+
      `<button id="passview-toggleholder" type="button"`+
           `class="mx-1 p-1 hover:bg-gray-800 active:bg-gray-900 `+
           `cursor-pointer rounded-md">`+
        icons.eye+
      `</button>`+
    `</div>`+
    `<input type="submit" value="Log in" id="loginButton"`+
      `class="text-white cursor-pointer bg-gray-800 py-1 rounded-r-lg `+
             `border-t-1 border-r-1 border-b-1 border-gray-800 px-2">`+
  `</div>`

  BaseElement.call(this, template, 'beforeend', sibling)
  const passField       = this.Element.querySelector('input#passfield')
  const passViewToggler = this.Element.querySelector('button#passview-toggleholder')
  const loginBtn        = this.Element.querySelector('input#loginButton')

  passViewToggler.addEventListener('click', (event) => {
    if (passField.type == 'password') {
      passField.type = 'text'
      event.currentTarget.innerHTML = icons.eyeBlind
    } else {
      passField.type = 'password'
      event.currentTarget.innerHTML = icons.eye
    }

    passField.focus()
  })
  passField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      loginBtn.click()
    }
  })

  /**
  * Give focus for the input field
  *
  * @method */
  this.focus = (function() {
    passField.focus()
  }).bind(this)

  /**
  * Whether the input field is empty or not
  * @method
  */
  this.isEmpty = (function() {
    return !Boolean(passField.value)
  }).bind(this)

  /**
  * Get the value of the input field
  * @method
  */
  this.getValue = (function() {
    return passField.value
  }).bind(this)

  /** Set the vaule of the input field
  * @method setValue
  * @param {String} value - the new input value
  * @return
  */
  this.setValue = (function(value) {
    passField.value = value
  }).bind(this)
}

Login.prototype = Object.create(BaseElement.prototype)
Login.prototype.constructor = Login

export default Login
