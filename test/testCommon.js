var firebase = require('firebase')
var randomBytes = require('randombytes')

var fb64 = require('../fb64')

var dbidx = 0
// Avoid clashes when tests are running simultaneously against
// the same Firebase instance
var dbPrefix = fb64.encode(randomBytes(8)) + '_firebase_down_test_db_'

var location = function () {
  return dbPrefix + dbidx++
}

var lastLocation = function () {
  return dbPrefix + dbidx
}

var cleanup = function (callback) {
  var app = firebase.app()
  var updates = {}
  for (var i = 0; i <= dbidx; i++) {
    updates[dbPrefix + i] = null
  }
  app.database().ref().update(updates, callback)
}

var setUp = function (t) {
  cleanup(function (err) {
    t.error(err, 'cleanup returned without an error')
    t.end()
  })
}

var tearDown = function (t) {
  setUp(t) // same cleanup!
}

var collectEntries = function (iterator, callback) {
  var data = []
  var next = function () {
    iterator.next(function (err, key, value) {
      if (err) return callback(err)
      if (!arguments.length) {
        return iterator.end(function (err) {
          callback(err, data)
        })
      }
      data.push({ key: key, value: value })
      setTimeout(next, 0)
    })
  }
  next()
}

module.exports = {
  location: location,
  cleanup: cleanup,
  lastLocation: lastLocation,
  setUp: setUp,
  tearDown: tearDown,
  collectEntries: collectEntries
}
