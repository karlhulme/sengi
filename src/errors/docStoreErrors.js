const check = require('check-types')
const JsonotronError = require('./jsonotronError')

class JsonotronDocStoreError extends JsonotronError {
  constructor (functionName, message) {
    check.assert.string(functionName)
    check.assert.string(message)
    super(message)
    this.functionName = functionName
  }
}

class JsonotronDocStoreFailureError extends JsonotronDocStoreError {
  constructor (functionName, innerErr) {
    check.assert.string(functionName)
    check.assert.instance(innerErr, Error)
    super(functionName, `The document store implementation of '${functionName}' raised an error.\n${innerErr.toString()}`)
    this.innerErr = innerErr
  }
}

class JsonotronDocStoreInvalidResponseError extends JsonotronDocStoreError {
  constructor (functionName, message) {
    check.assert.string(functionName)
    check.assert.string(message)
    super(functionName, `The document store function '${functionName}' returned an invalid response.\n${message}`)
  }
}

class JsonotronDocStoreMissingFunctionError extends JsonotronDocStoreError {
  constructor (functionName) {
    check.assert.string(functionName)
    super(functionName, `The document store does not provide an implementation of '${functionName}'.`)
  }
}

class JsonotronDocStoreUnrecognisedErrorCodeError extends JsonotronDocStoreError {
  constructor (functionName, errorCode) {
    check.assert.string(functionName)
    check.assert.string(errorCode)
    super(functionName, `The document store function '${functionName}' returned an object with an unrecognised error code '${errorCode}'.`)
    this.errorCode = errorCode
  }
}

module.exports = {
  // doc store error base
  JsonotronDocStoreError,

  // specialised errors
  JsonotronDocStoreFailureError,
  JsonotronDocStoreInvalidResponseError,
  JsonotronDocStoreMissingFunctionError,
  JsonotronDocStoreUnrecognisedErrorCodeError
}
