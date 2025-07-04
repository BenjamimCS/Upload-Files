/** @class BaseElement
 * Create a `Element` from a HTML string.
 * 
 * Additionally it also handle some boring operations like:
 * * adding to the DOM Tree;
 * * toggling the element presence in the DOM (remove and add it [again])
 *
 * @param {string} template - HTML template
 * @param {string} position - The same from `Element.insertAdjacentElement`, see [MDN | Element.insertAdjacentElement](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement)
 * @param {Element} sibling - Sibling DOM `Element` used as a reference to insert
 * right after/before it, depends on `position` argument.
 */
function BaseElement(template, position, sibling) {
  if (typeof template != 'string')
    throw TypeError('Argument template must be of type string got '+ typeof template)
  if (!(sibling instanceof Element))
    throw TypeError('Argument sibling must be of type Element')
  let div = document.createElement('div')
  div.innerHTML += template

  /** 
   * The DOM element itself
   * @inheritdoc
   * @property Element
   */
  this.Element = div.firstElementChild
  div = null
  /** Whether is in the DOM or not
   * @inheritdoc
   * @property
   */
  this.visible = false
  /** The parent element of `this.sibling`
   * @inheritdoc
   * @property
   */
  this.parent = sibling.parentElement
  /** The element that will be before the `element`,
   * @inheritdoc
   * @property
   */
  this.sibling = sibling
  /** Add the element on the dom tree. If already added it returns `true`
   * @inheritdoc
   * @method
   * @returns {true|false}
   */
  this.show = function() {
    if (this.visible) return this.visible
    this.sibling.insertAdjacentElement(position, this.Element)
    this.visible = true
  }
  /** Remove the element from the DOM. If already removed it returns `false`
   * @inheritdoc
   * @method
   */
  this.hide = function(){
    if (!this.visible) return this.visible
    this.Element.remove()
    this.visible = false
  }
  /**
   * Toggle the presence in the DOM
   * @inheritdoc
   */
  this.toggle = function() {
    this.visible
      ? this.Element.remove()
      : this.after.insertAdjacentElement(position, this.Element)

    this.visible != this.visible
  }
}

export default BaseElement
