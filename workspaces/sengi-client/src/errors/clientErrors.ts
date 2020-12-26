export class SengiClientError extends Error {
  constructor (message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiClientGatewayError extends SengiClientError {
  constructor () {
    super('The service is not currently available.')
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiClientInvalidInputError extends SengiClientError {
  constructor (message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiClientRequiredVersionNotAvailableError extends SengiClientError {
  constructor () {
    super(`The required version of the document is not available.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiClientUnexpectedError extends SengiClientError {
  constructor (message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiClientUnrecognisedPathError extends SengiClientError {
  constructor (readonly url: string) {
    super(`The path component of the url '${url}' was not recognised.  Check the spelling of the doc type plural name.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.url = url
  }
}
