export class SengiExpressError extends Error {
  constructor (message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiExpressRequestError extends SengiExpressError {
  constructor (message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiExpressDocIdNotFoundError extends SengiExpressRequestError {
  constructor (readonly id: string) {
    super(`Document with id (${id}) not found.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.id = id
  }
}

export class SengiExpressInvalidRequestIdError extends SengiExpressRequestError {
  constructor (readonly requestId: string) {
    super(`The value of X-REQUEST-ID (${requestId}) is not valid.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.requestId = requestId
  }
}

export class SengiExpressInvalidReqVersionError extends SengiExpressRequestError {
  constructor () {
    super('The value of the IF-MATCH header is not valid.  It should be a string or left undefined.')
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiExpressMalformedFilterNameError extends SengiExpressRequestError {
  constructor () {
    super('The filterName value in the query string cannot be parsed into a string.')
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiExpressMalformedFilterParamsError extends SengiExpressRequestError {
  constructor () {
    super('The filterParams value in the query string cannot be parsed into a JSON object.')
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiExpressMalformedQueryNameError extends SengiExpressRequestError {
  constructor () {
    super('The queryName value in the query string cannot be parsed into a string.')
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiExpressMalformedQueryParamsError extends SengiExpressRequestError {
  constructor () {
    super('The queryParams value in the query string cannot be parsed into a JSON object.')
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiExpressMissingApiKeyError extends SengiExpressRequestError {
  constructor () {
    super('The request did not specify an X-API-KEY header.')
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiExpressMismatchedIdsError extends SengiExpressRequestError {
  constructor (readonly idFromRequestBody?: string, readonly idFromRequestUrlParams?: string) {
    super(`The id from the request body '${idFromRequestBody}' does not match the id from the url parameters '${idFromRequestUrlParams}'.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.idFromRequestBody = idFromRequestBody
    this.idFromRequestUrlParams = idFromRequestUrlParams
  }
}

export class SengiExpressUnrecognisedDocTypeNameError extends SengiExpressRequestError {
  constructor (readonly docTypePluralName: string) {
    super(`The value '${docTypePluralName}' was not recognised as either a singular or plural name of a known doc type.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypePluralName = docTypePluralName
  }
}

export class SengiExpressUnsupportedRequestContentTypeError extends SengiExpressRequestError {
  constructor (readonly reqContentType: string, readonly supportedContentType: string) {
    super(`Cannot read payloads in the '${reqContentType}' format as declared in the sent Content-Type header. Try '${supportedContentType}'.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.reqContentType = reqContentType
    this.supportedContentType = supportedContentType
  }
}

export class SengiExpressUnsupportedResponseContentTypeError extends SengiExpressRequestError {
  constructor (readonly reqContentType: string, readonly supportedContentType: string) {
    super(`Cannot provide responses in the '${reqContentType}' format as requested in the sent Accept header. Try '${supportedContentType}'.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.reqContentType = reqContentType
    this.supportedContentType = supportedContentType
  }
}
