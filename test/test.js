var test = require('tape')
var testCommon = require('./testCommon')
var firebase = require('firebase')

require('dotenv').load()

var FirebaseDOWN = require('../')

var config = {
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: process.env.FIREBASE_DATABASE_URL
}

var firebaseApp

if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(config)
} else {
  firebaseApp = firebase.app()
}

function leveldown (location) {
  return new FirebaseDOWN(firebaseApp, location)
}

var testBuffer = new Buffer('foo')

/** * compatibility with basic LevelDOWN API ***/

require('abstract-leveldown/abstract/open-test').args(leveldown, test, testCommon)
require('abstract-leveldown/abstract/open-test').open(leveldown, test, testCommon)

require('abstract-leveldown/abstract/del-test').all(leveldown, test, testCommon)
require('abstract-leveldown/abstract/get-test').all(leveldown, test, testCommon)
require('abstract-leveldown/abstract/put-test').all(leveldown, test, testCommon)
require('abstract-leveldown/abstract/put-get-del-test').all(leveldown, test, testCommon, testBuffer)

require('abstract-leveldown/abstract/batch-test').all(leveldown, test, testCommon)
require('abstract-leveldown/abstract/chained-batch-test').all(leveldown, test, testCommon)

require('abstract-leveldown/abstract/close-test').close(leveldown, test, testCommon)

// Firebase does not support snapshots for read operations, so we skip the snapshot
var testIterator = require('abstract-leveldown/abstract/iterator-test')
testIterator.setUp(leveldown, test, testCommon)
testIterator.args(test)
testIterator.sequence(test)
testIterator.iterator(leveldown, test, testCommon, testCommon.collectEntries)
testIterator.tearDown(test, testCommon)

require('abstract-leveldown/abstract/ranges-test').all(leveldown, test, testCommon)

test('delete firebase app instance', function (t) {
  t.plan(1)
  firebaseApp.delete()
    .then(t.error)
    .catch(t.error)
})
