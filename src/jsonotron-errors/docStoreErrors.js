import check from 'check-types'
import { JsonotronError } from './JsonotronError'

export class JsonotronDocStoreError extends JsonotronError {
  constructor (functionName, message) {
    check.assert.string(functionName)
    check.assert.string(message)
    super(message)
    this.functionName = functionName
  }
}

export class JsonotronDocStoreFailureError extends JsonotronDocStoreError {
  constructor (functionName, innerErr) {
    check.assert.string(functionName)
    check.assert.instance(innerErr, Error)
    super(functionName, `The document store implementation of '${functionName}' raised an error.\n${innerErr.toString()}`)
    this.innerErr = innerErr
  }
}

export class JsonotronDocStoreInvalidResponseError extends JsonotronDocStoreError {
  constructor (functionName, message) {
    check.assert.string(functionName)
    check.assert.string(message)
    super(functionName, `The document store function '${functionName}' returned an invalid response.\n${message}`)
  }
}

export class JsonotronDocStoreMissingFunctionError extends JsonotronDocStoreError {
  constructor (functionName) {
    check.assert.string(functionName)
    super(functionName, `The document store does not provide an implementation of '${functionName}'.`)
  }
}

export class JsonotronDocStoreUnrecognisedErrorCodeError extends JsonotronDocStoreError {
  constructor (functionName, errorCode) {
    check.assert.string(functionName)
    check.assert.string(errorCode)
    super(functionName, `The document store function '${functionName}' returned an object with an unrecognised error code '${errorCode}'.`)
    this.errorCode = errorCode
  }
}

export class JsonotronDocStoreUnrecognisedSuccessCodeError extends JsonotronDocStoreError {
  constructor (functionName, successCode) {
    check.assert.string(functionName)
    check.assert.string(successCode)
    super(functionName, `The document store function '${functionName}' returned an object with an unrecognised success code '${successCode}'.`)
    this.successCode = successCode
  }
}
