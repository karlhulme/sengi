import check from 'check-types'
import { SengiError } from './SengiError'

export class SengiEngineError extends SengiError {
  constructor (message) {
    check.assert.string(message)
    super(message)
  }
}

export class SengiCalculatedFieldFailedError extends SengiEngineError {
  constructor (docTypeName, fieldName, innerErr) {
    check.assert.string(docTypeName)
    check.assert.string(fieldName)
    check.assert.instance(innerErr, Error)
    super(`Calculated field '${fieldName}' on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    this.docTypeName = docTypeName
    this.fieldName = fieldName
    this.innerErr = innerErr
  }
}

export class SengiCallbackError extends SengiEngineError {
  constructor (callbackName, innerErr) {
    check.assert.string(callbackName)
    check.assert.instance(innerErr, Error)
    super(`An error was thrown by the callback delegate for '${callbackName}'\n${innerErr.toString()}`)
    this.callbackName = callbackName
    this.innerErr = innerErr
  }
}

export class SengiConstructorFailedError extends SengiEngineError {
  constructor (docTypeName, innerErr) {
    check.assert.string(docTypeName)
    check.assert.instance(innerErr, Error)
    super(`Constructor on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    this.docTypeName = docTypeName
    this.innerErr = innerErr
  }
}

export class SengiFilterFailedError extends SengiEngineError {
  constructor (docTypeName, filterName, innerErr) {
    check.assert.string(docTypeName)
    check.assert.string(filterName)
    check.assert.instance(innerErr, Error)
    super(`Filter '${filterName}' on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    this.docTypeName = docTypeName
    this.filterName = filterName
    this.innerErr = innerErr
  }
}

export class SengiInvalidOperationMergePatchError extends SengiEngineError {
  constructor (docTypeName, operationName, message) {
    check.assert.string(operationName)
    check.assert.string(message)
    super(`Merge patch returned from operation '${operationName}' on document type '${docTypeName}' is invalid.\n${message}`)
    this.docTypeName = docTypeName
    this.operationName = operationName
  }
}

export class SengiOperationFailedError extends SengiEngineError {
  constructor (docTypeName, operationName, innerErr) {
    check.assert.string(docTypeName)
    check.assert.string(operationName)
    check.assert.instance(innerErr, Error)
    super(`Operation '${operationName}' on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    this.docTypeName = docTypeName
    this.operationName = operationName
    this.innerErr = innerErr
  }
}

export class SengiOperationNonObjectResponseError extends SengiEngineError {
  constructor (docTypeName, operationName) {
    check.assert.string(docTypeName)
    check.assert.string(operationName)
    super(`Operation '${operationName}' on document type '${docTypeName}' failed to return an object.`)
    this.docTypeName = docTypeName
    this.operationName = operationName
  }
}

export class SengiPreSaveFailedError extends SengiEngineError {
  constructor (docTypeName, innerErr) {
    check.assert.string(docTypeName)
    check.assert.instance(innerErr, Error)
    super(`Pre-save function on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    this.docTypeName = docTypeName
    this.innerErr = innerErr
  }
}
