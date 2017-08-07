var util = require('util')
var AbstractIterator = require('abstract-leveldown').AbstractIterator
var ltgt = require('ltgt')

var fb64 = require('./fb64')

var DEFAULTS = {
  keyAsBuffer: true,
  valueAsBuffer: true
}

module.exports = Iterator

function Iterator (db, options) {
  if (!options) options = {}
  this.options = Object.assign({}, DEFAULTS, options)
  // For leveldown tests, empty buffers and nulls for bounds should be treated as undefined
  ltgt.toLtgt(this.options, this.options, function (value) {
    if (Buffer.isBuffer(value) && value.length === 0) return
    if (value === null) return
    return value
  })
  AbstractIterator.call(this, db)
  var lower = ltgt.lowerBound(options)
  this._lower = lower && fb64.encode(Buffer.from(lower, options.encoding))
  var upper = ltgt.upperBound(options)
  this._upper = upper && fb64.encode(Buffer.from(upper, options.encoding))
  this._count = 0
  this._done = false
  this._started = false
  this._buffer = []
  this.callback = null
}

util.inherits(Iterator, AbstractIterator)

Iterator.prototype.createQuery = function () {
  var self = this
  var limit = self.options.limit
  if (limit === 0) {
    this._done = true
    return
  }
  var query = self.db.orderByKey()
  if (self._lower) {
    query = query.startAt(self._lower)
  }
  if (self._upper) {
    query = query.endAt(self._upper)
  }

  if (typeof limit === 'number' && limit >= 0) {
    if (this.options.reverse) {
      query = query.limitToLast(limit)
    } else {
      query = query.limitToFirst(limit)
    }
  }

  query.on('child_added', self.onChild, self.onError, self)
  query.once('value', self.onComplete, self.onError, self)
  this.query = query
}

Iterator.prototype.onChild = function (snapshot) {
  var key = fb64.decode(snapshot.key)
  if (!ltgt.contains(this.options, key.toString())) return
  if (!this.options.keyAsBuffer) {
    key = key.toString()
  }
  var value = snapshot.val()
  if (this.options.valueAsBuffer) {
    value = Buffer.from(value)
  }
  if (this.callback && !this.options.reverse) {
    this.callback(null, key, value)
    this.callback = null
  } else {
    this._buffer.push({key: key, value: value})
  }
}

Iterator.prototype.onComplete = function () {
  this._done = true
  this.query.off('child_added', this.onChild, this)
  this.query.off('value', this.onComplete, this)
  this._processCallback()
}

Iterator.prototype.onError = function (err) {
  this._error = err
  this.onComplete()
}

Iterator.prototype.getItem = function () {
  return this.options.reverse ? this._buffer.pop() : this._buffer.shift()
}

Iterator.prototype._processCallback = function () {
  if (!this.callback) return
  var callback = this.callback
  this.callback = null
  var item = this.getItem()
  if (this._error) {
    callback(this._error)
  } else if (item) {
    callback(null, item.key, item.value)
  } else {
    callback()
  }
}

Iterator.prototype._next = function (callback) {
  if (!callback) return new Error('next() requires a callback argument')
  if (!this._started) {
    this.createQuery()
    this._started = true
  }
  var self = this
  this.callback = callback
  if (this._done || (this._buffer.length && !this.options.reverse)) {
    return process.nextTick(function () {
      self._processCallback()
    })
  }
}
