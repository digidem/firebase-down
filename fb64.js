var d64 = require('d64')

var CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'
  .split('').sort().join('')

// This creates an `encode` and `decode` function that uses a modified version
// of https://github.com/dominictarr/d64/ which uses characters which are valid
// Firebase keys https://stackoverflow.com/questions/41142571/firebase-push-key-allowed-characters
module.exports = d64(CHARS)
