import BaseElement from "./BaseElement"
/**
 * @class AlertBox
 * @extends BaseElement
 *
 * Create an alert box
 *
 * @param {String} message - The alert message
 * @param {Element} sibling - The element the alert box will be placed after
 * @param {String} [type='alert'] - The type of alert
 * * alert
 * * error
 */
function AlertBox (message, sibling, type='alert') {
  const alertType = type.toLowerCase()
  const presets = {
    error: {
      /* THIS ICON IS PROTECTED BY MIT LICENSE
      ** AVAILABLE AT: <https://www.svgrepo.com/svg/505861/cross-small>
      */
      icon:
      `<svg class="bg-red-600 rounded-full" width="20px" height="20px" `+
           `viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> `+
        `<path class="stroke-gray-900" d="M16 8L8 16M8.00001 8L16 16" `+
              `stroke="#000000" stroke-width="2" stroke-linecap="round" `+
              `stroke-linejoin="round"/>`+
      `</svg>`,
      //`<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'`+
      // `class='bg-red-600 rounded-full' width='20px' height='20px'>`+
      //   `<path class='stroke-gray-900'"`+
      //     `d='M16 8L8 16M8.00001 8L16 16' stroke='#000000' stroke-width='2'`+
      //     `stroke-linecap='round' stroke-linejoin='round'/>`+
      //`</svg>`,
      color: {
        bg: {
          normal: '#330505',
          glow: '#5e1313',
        },
      },
    },
  }
  if (!(alertType in presets)) throw Error('No alert of name ' + alertType)
  const template =
  `<figure class="flex items-center mt-5 px-2 py-1 border-r-2 border-red-600 `+
                 `bg-[${presets[alertType].color.bg.normal}] transition-[background]">`+
    `<section class='flex items-center'>`+
      `${presets[alertType].icon}`+
    `</section>`+
    `<figcaption class="mx-2 text-white">`+
      `<em>${message}</em>`+
    `</figcaption>`+
  `</figure>`

  BaseElement.call(this, template, 'afterend', sibling)

  /**
   * @method
   * Blink the element, make a glow effect
   */
  this.focus = (function() {
    if (!this.visible) return
    this.Element.classList.replace(`bg-[${presets[alertType].color.bg.normal}]`,
                                    `bg-[${presets[alertType].color.bg.glow}]`)
    setTimeout(() => {
      this.Element.classList.replace(`bg-[${presets[alertType].color.bg.glow}]`,
                                      `bg-[${presets[alertType].color.bg.normal}]`)
    }, 100)
    
  }).bind(this)
}

AlertBox.prototype = Object.create(BaseElement.prototype)
AlertBox.prototype.constructor = AlertBox

export default AlertBox
