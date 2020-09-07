import check from 'check-types'
import { SengiError } from './SengiError'

export class SengiDocStoreError extends SengiError {
  constructor (functionName, message) {
    check.assert.string(functionName)
    check.assert.string(message)
    super(message)
    this.functionName = functionName
  }
}

export class SengiDocStoreFailureError extends SengiDocStoreError {
  constructor (functionName, innerErr) {
    check.assert.string(functionName)
    check.assert.instance(innerErr, Error)
    super(functionName, `The document store implementation of '${functionName}' raised an error.\n${innerErr.toString()}`)
    this.innerErr = innerErr
  }
}

export class SengiDocStoreInvalidResponseError extends SengiDocStoreError {
  constructor (functionName, message) {
    check.assert.string(functionName)
    check.assert.string(message)
    super(functionName, `The document store function '${functionName}' returned an invalid response.\n${message}`)
  }
}

export class SengiDocStoreMissingFunctionError extends SengiDocStoreError {
  constructor (functionName) {
    check.assert.string(functionName)
    super(functionName, `The document store does not provide an implementation of '${functionName}'.`)
  }
}

export class SengiDocStoreUnrecognisedErrorCodeError extends SengiDocStoreError {
  constructor (functionName, errorCode) {
    check.assert.string(functionName)
    check.assert.string(errorCode)
    super(functionName, `The document store function '${functionName}' returned an object with an unrecognised error code '${errorCode}'.`)
    this.errorCode = errorCode
  }
}

export class SengiDocStoreUnrecognisedSuccessCodeError extends SengiDocStoreError {
  constructor (functionName, successCode) {
    check.assert.string(functionName)
    check.assert.string(successCode)
    super(functionName, `The document store function '${functionName}' returned an object with an unrecognised success code '${successCode}'.`)
    this.successCode = successCode
  }
}
