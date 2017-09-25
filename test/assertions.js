var FirebaseDOWN = require('../')

module.exports = function (app, test) {
  test('Creating a new instance with invalid arguments', function (t) {
    t.throws(FirebaseDOWN.bind(null, {}), 'throws if you don\'t pass an instance of firebase.app.App')
    t.throws(FirebaseDOWN.bind(null, app, 'invalid&'), 'throws if you pass invalid chars in location')
    t.throws(FirebaseDOWN.bind(null, app, []), 'throws if not a string or reference')
    t.doesNotThrow(FirebaseDOWN.bind(null, app, app.database().ref('test')), 'accepts a valid ref')
    t.doesNotThrow(FirebaseDOWN.bind(null, app, '/child/key'), 'accepts a valid ref')
    t.end()
  })
}
