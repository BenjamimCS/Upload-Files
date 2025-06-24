import { percentEncode, formatSize } from '../utils'
import Icons from './Icons'

/**
* Returns an HTML file entry. It can be string or `Element` object
* (see `string` paramater)
*
* @param {object} metadata - The file's metadata. The keys are:
* @param {string} metadata.id - valid HTML attribute value for the global `id` attribute
* @param {string} metadata.name - file name
* @param {string} metadata.size - file size
* @param {boolean} metadata.uploaded - whether the file is upload
*
* @param {object} additionalData - object holding icon stylization
* the keys are the same as Icons.create's `data` parameter
*
* @param {boolean} [string=false] - whether return `String` or `Element`
*
* @returns {Element|String}
*/
function FileEntry(metadata, additionalData, string = false) {
  const div = document.createElement('div')
  const svg = Icons.create(additionalData, 'arrow')
  const fixData = {
    id: `id='${metadata.id ?? ''}'`,
    name: metadata.name,
    size: metadata.size || 0,
    uploaded: metadata.uploaded || false,
  }

  div.innerHTML =
  `<li ${fixData.id}>`+
    `<a href='/download?filename=${percentEncode(fixData.name)}'`+
      `class='flex w-[100%] p-1 overflow-hidden active:bg-gray-800 `+
             `hover:bg-gray-700 rounded-md cursor-pointer'>`+
      `<div class='w-[100%] grow-1 shrink-1 flex overflow-hidden'>`+
        `<section class='shrink-0 flex items-center mr-1'>`+
          `${Icons.create({
            height: '20px',
            width:  '20px',
            color: '#36c8f6'
          }, 'file')}`+
        `</section>`+
        `<section class='basis-[content] shrink-1 max-w-[74%]'>`+
          `<p class='truncate cursor-text text-nowrap break-keep'>`+
            `${fixData.name}</p>`+
        `</section>`+
        `<section class='grow-1 shrink-0 ml-1'> <!-- -->`+
          `<p class='text-right'>${formatSize(fixData.size)}</p>`+
        `</section>`+
      `</div>`+
      `<div class='grow-0 shrink-0 flex items-center pl-1 arrow'>`+
        `${svg}`+
        `<!--<svg fill="${fixData.uploaded ? '#3cde3e' : 'red'}" width="25px" height="25px"`+
             `viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">`+
          `<path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z"/>`+
        `</svg> -->`+
      `</div>`+
    `</a>`+
  `</li>`

  const liEl = div.firstElementChild
  liEl.children[0].addEventListener('dragstart', event => event.preventDefault())

  return string
    ? div.innerHTML
    : liEl
}

export default FileEntry
