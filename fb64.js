var d64 = require('d64')
var assign = require('object-assign')

var validKeyChars = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'
  .split('').sort().join('')

var validKeyCharsMap = validKeyChars.split('').reduce(function (acc, cur) {
  acc[cur] = true
  return acc
}, {})

var validLocationCharsMap = assign({'/': true}, validKeyCharsMap)

// This creates an `encode` and `decode` function that uses a modified version
// of https://github.com/dominictarr/d64/ which uses characters which are valid
// Firebase keys https://stackoverflow.com/questions/41142571/firebase-push-key-allowed-characters
module.exports = d64(validKeyChars)
module.exports.isValidKey = isValidKey
module.exports.isValidLocation = isValidLocation

// Validates whether a string is a valid fireBase key
function isValidKey (str) {
  var i = str.length
  while (i--) {
    if (!validKeyCharsMap[str.charAt(i)]) return false
  }
  return true
}

function isValidLocation (str) {
  var i = str.length
  while (i--) {
    if (!validLocationCharsMap[str.charAt(i)]) return false
  }
  return true
}
