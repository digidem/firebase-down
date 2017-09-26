var FirebaseDOWN = require('../')

module.exports = function (app, test) {
  test('Creating a new instance with invalid arguments', function (t) {
    t.throws(FirebaseDOWN.bind(null, {}), 'throws if you don\'t pass an instance of firebase.app.App')
    t.throws(FirebaseDOWN(app).bind(null, 'invalid&'), 'throws if you pass invalid chars in location')
    t.throws(FirebaseDOWN(app).bind(null, []), 'throws if not a string or reference')
    t.doesNotThrow(FirebaseDOWN(app).bind(null, '/child/key'), 'accepts a valid ref')
    t.end()
  })
}
