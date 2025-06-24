/**
* Fix some characters that aren't encoded by `encodeURIComponent`
* @param {String} targetStr - String to be percent-encoded
* @returns {String}
*/
export function percentEncode(targetStr) {
  const PATTERN = /[!*()']/g
  let percentEncoded = encodeURIComponent(targetStr)
  let matches = percentEncoded.match(PATTERN)

  if (!matches) return percentEncoded

  for (let match of matches) {
    let hexChar = match.charCodeAt(0).toString(16).toUpperCase()
    percentEncoded = percentEncoded.replace(match, '%' + hexChar)
  }

  return percentEncoded
}

/** Format size of bytes in *K* and *M*. Future multiples will be added if
 * necessary
 * @param {Number} size - the size in bytes
 * @param {Number} [base=2] - the base on which the multiples are based
 */
export function formatSize(size, base = 2) {
  const i = base == 2 ? 'i' : ''
  return size < base ** 10
    ? `${size} B`
    : size < base ** 20
    ? `${(size/base**10).toFixed(2)} K${i}B`
    : `${(size/base**20).toFixed(2)} M${i}B`
}

