import { SengiEngineError } from './baseErrors'

export class SengiCommandFailedError extends SengiEngineError {
  constructor (readonly docTypeName: string, readonly commandName: string, readonly innerErr: Error) {
    super(`Command '${commandName}' on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.commandName = commandName
    this.innerErr = innerErr
  }
}

export class SengiCallbackError extends SengiEngineError {
  constructor (readonly callbackName: string, readonly innerErr: Error) {
    super(`An error was thrown by the callback delegate for '${callbackName}'\n${innerErr.toString()}`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.callbackName = callbackName
    this.innerErr = innerErr
  }
}

export class SengiConstructorFailedError extends SengiEngineError {
  constructor (readonly docTypeName: string, readonly innerErr: Error) {
    super(`Constructor on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.innerErr = innerErr
  }
}

export class SengiConstructorNonObjectResponseError extends SengiEngineError {
  constructor (readonly docTypeName: string) {
    super(`Constructor on document type '${docTypeName}' failed to return an object.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
  }
}

export class SengiFilterFailedError extends SengiEngineError {
  constructor (readonly docTypeName: string, readonly filterName: string, readonly innerErr: Error) {
    super(`Filter '${filterName}' on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.filterName = filterName
    this.innerErr = innerErr
  }
}

export class SengiInvalidOperationPatchError extends SengiEngineError {
  constructor (readonly docTypeName: string, readonly operationName: string, readonly message: string) {
    super(`Merge patch returned from operation '${operationName}' on document type '${docTypeName}' is invalid.\n${message}`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.operationName = operationName
  }
}

export class SengiOperationFailedError extends SengiEngineError {
  constructor (readonly docTypeName: string, readonly operationName: string, readonly innerErr: Error) {
    super(`Operation '${operationName}' on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.operationName = operationName
    this.innerErr = innerErr
  }
}

export class SengiPreSaveFailedError extends SengiEngineError {
  constructor (readonly docTypeName: string, readonly innerErr: Error) {
    super(`Pre-save function on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.innerErr = innerErr
  }
}

export class SengiTypeNotFoundError extends SengiEngineError {
  constructor (readonly typeName: string) {
    super(`The fully qualified type name '${typeName}' was not recognised by the validation engine.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.typeName = typeName
  }
}
