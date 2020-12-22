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

export class SengiExpressDocIdNotFound extends SengiExpressRequestError {
  constructor (readonly id: string) {
    super(`Document with id (${id}) not found.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.id = id
  }
}

export class SengiExpressInvalidRequestId extends SengiExpressRequestError {
  constructor (readonly requestId: string) {
    super(`The value of X-REQUEST-ID (${requestId}) is not valid.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.requestId = requestId
  }
}

export class SengiExpressInvalidReqVersion extends SengiExpressRequestError {
  constructor () {
    super('The value of the IF-MATCH header is not valid.  It should be a string or left undefined.')
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiExpressMissingRoleNamesError extends SengiExpressRequestError {
  constructor () {
    super('The request did not specify an X-ROLE-NAMES header.')
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

export class SengiExpressUnrecognisedDocTypePluralNameError extends SengiExpressRequestError {
  constructor (readonly docTypePluralName: string) {
    super(`The plural doc-type name '${docTypePluralName}' was not recognised.`)
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
