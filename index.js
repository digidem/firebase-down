var inherits = require('inherits')
var assert = require('assert')
var firebase = require('firebase')
var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN

var Iterator = require('./iterator')
var fb64 = require('./fb64')

function toFirebaseKey (key, encoding) {
  return fb64.encode(Buffer.from(key, encoding))
}

module.exports = FirebaseDOWN

function FirebaseDOWN (firebaseApp, location) {
  if (!(this instanceof FirebaseDOWN)) return new FirebaseDOWN(firebaseApp, location)
  location = location || 'FirebaseDOWN'
  assert(firebaseApp instanceof firebase.app.App, 'must pass an instance of firebase.app.App https://firebase.google.com/docs/reference/js/firebase.app.App')
  assert(typeof location !== 'string' || fb64.isValidLocation(location), 'location has invalid characters. Must be one `/-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz`')
  if (location instanceof firebase.database.Reference) {
    AbstractLevelDOWN.call(this, location.toString())
    this.ref = location
  } else if (typeof location === 'string') {
    AbstractLevelDOWN.call(this, location)
    this.ref = firebaseApp.database().ref(location)
  } else {
    throw new Error('location must be a string or a firebase.database.Reference https://firebase.google.com/docs/reference/js/firebase.database.Reference')
  }
}

inherits(FirebaseDOWN, AbstractLevelDOWN)

FirebaseDOWN.prototype.iterator = function (options) {
  if (typeof options !== 'object') options = {}
  return new Iterator(this.ref, options)
}

FirebaseDOWN.prototype._put = function (key, value, options, callback) {
  if (typeof value === 'undefined' || value === null) value = ''
  if (Buffer.isBuffer(value) && value.length === 0) value = ''
  var firebaseKey = toFirebaseKey(key, options.encoding)
  this.ref.child(firebaseKey).set(value, callback)
}

FirebaseDOWN.prototype._get = function (key, options, callback) {
  var firebaseKey = toFirebaseKey(key, options.encoding)
  this.ref.child(firebaseKey).once('value', onSuccess, callback)

  function onSuccess (snapshot) {
    var value = snapshot.val()
    if (value == null) {
      return callback(new Error('NotFound'))
    }
    // by default return buffers, unless explicitly told not to
    var asBuffer = true
    if (options.asBuffer === false) asBuffer = false
    if (options.raw) asBuffer = false
    if (asBuffer) {
      value = Buffer.from(value)
    }
    return callback(null, value, key)
  }
}

FirebaseDOWN.prototype._del = function (key, options, callback) {
  var firebaseKey = toFirebaseKey(key, options.encoding)
  this.ref.child(firebaseKey).set(null, callback)
}

FirebaseDOWN.prototype._batch = function (array, options, callback) {
  var i = -1
  var key
  var value
  var operation = {}

  if (array.length === 0) return setTimeout(callback, 0)

  for (i = 0; i < array.length; i++) {
    key = toFirebaseKey(array[i].key, options.encoding)

    if (array[i].type === 'put') {
      value = Buffer.isBuffer(array[i].value) ? array[i].value : String(array[i].value)
    } else {
      value = null
    }

    operation[key] = value
  }

  this.ref.update(operation, callback)
}
