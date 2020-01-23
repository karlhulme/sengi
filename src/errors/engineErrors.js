const check = require('check-types')
const JsonotronError = require('./jsonotronError')

class JsonotronEngineError extends JsonotronError {
  constructor (message) {
    check.assert.string(message)
    super(message)
  }
}

class JsonotronCalculatedFieldFailedError extends JsonotronEngineError {
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

class JsonotronCallbackError extends Error {
  constructor (callbackName, innerErr) {
    check.assert.instance(innerErr, Error)
    super(`An error was thrown by the callback delegate for '${callbackName}'\n${innerErr.toString()}`)
    this.callbackName = callbackName
    this.innerErr = innerErr
  }
}

class JsonotronConstructorFailedError extends JsonotronEngineError {
  constructor (docTypeName, innerErr) {
    check.assert.string(docTypeName)
    check.assert.instance(innerErr, Error)
    super(`Constructor on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    this.docTypeName = docTypeName
    this.innerErr = innerErr
  }
}

class JsonotronDocTypeValidationError extends JsonotronEngineError {
  constructor (docTypeName, message) {
    check.assert.string(docTypeName)
    check.assert.string(message)
    super(`Document type '${docTypeName}' is not valid.\n${message}`)
    this.docTypeName = docTypeName
  }
}

class JsonotronFieldTypeResolutionError extends JsonotronEngineError {
  constructor (fieldTypeName) {
    check.assert.string(fieldTypeName)
    super(`Field type '${fieldTypeName}' cannot be resolved.`)
    this.fieldTypeName = fieldTypeName
  }
}

class JsonotronFieldTypeValidationError extends JsonotronEngineError {
  constructor (fieldTypeName, message) {
    check.assert.string(fieldTypeName)
    check.assert.string(message)
    super(`Field type '${fieldTypeName}' is not valid.\n${message}`)
    this.fieldTypeName = fieldTypeName
  }
}

class JsonotronFilterFailedError extends JsonotronEngineError {
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

class JsonotronInvalidOperationMergePatchError extends JsonotronEngineError {
  constructor (docTypeName, operationName, message) {
    check.assert.string(operationName)
    check.assert.string(message)
    super(`Merge patch returned from operation '${operationName}' on document type '${docTypeName}' is invalid.\n${message}`)
  }
}

class JsonotronOperationFailedError extends JsonotronEngineError {
  constructor (docTypeName, operationName, innerErr) {
    check.assert.string(docTypeName)
    check.assert.string(operationName)
    check.assert.instance(innerErr, Error)
    super(`Operation '${operationName}' on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    this.docTypeName = docTypeName
    this.filterName = operationName
    this.innerErr = innerErr
  }
}

class JsonotronOperationNonObjectResponseError extends JsonotronEngineError {
  constructor (docTypeName, operationName) {
    check.assert.string(docTypeName)
    check.assert.string(operationName)
    super(`Operation '${operationName}' on document type '${docTypeName}' failed to return an object.`)
    this.docTypeName = docTypeName
    this.filterName = operationName
  }
}

class JsonotronRoleTypeValidationError extends JsonotronEngineError {
  constructor (roleTypeName, message) {
    check.assert.string(roleTypeName)
    check.assert.string(message)
    super(`Role type '${roleTypeName}' is not valid.\n${message}`)
    this.roleTypeName = roleTypeName
  }
}

module.exports = {
  // engine error base
  JsonotronEngineError,

  // specialised errors
  JsonotronCalculatedFieldFailedError,
  JsonotronCallbackError,
  JsonotronConstructorFailedError,
  JsonotronDocTypeValidationError,
  JsonotronFieldTypeResolutionError,
  JsonotronFieldTypeValidationError,
  JsonotronFilterFailedError,
  JsonotronInvalidOperationMergePatchError,
  JsonotronOperationFailedError,
  JsonotronOperationNonObjectResponseError,
  JsonotronRoleTypeValidationError
}
