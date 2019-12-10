const check = require('check-types')

class JsonotronError extends Error {
  constructor (message) {
    check.assert.string(message)
    super(message)
    this.name = this.constructor.name
  }
}

module.exports = JsonotronError
