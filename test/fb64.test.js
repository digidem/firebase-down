var test = require('tap').test
var fb64 = require('../fb64')

test('fb64', function (t) {
  t.ok(fb64.isValidKey('my_key-0'))
  t.false(fb64.isValidKey('my_key-0&'))
  t.false(fb64.isValidKey('/my_key-0&'))
  t.ok(fb64.isValidLocation('/child/node/ok'))
  t.false(fb64.isValidLocation('/&child/node/ok'))
  t.end()
})
