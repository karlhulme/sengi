import check from 'check-types'

export class JsonotronError extends Error {
  constructor (message) {
    check.assert.string(message)
    super(message)
    this.name = this.constructor.name
  }
}
