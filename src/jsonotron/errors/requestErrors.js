const check = require('check-types')
const JsonotronError = require('./jsonotronError')

class JsonotronRequestError extends JsonotronError {}

class JsonotronActionForbiddenByPolicyError extends JsonotronRequestError {
  constructor (docTypeName, action) {
    check.assert.string(docTypeName)
    check.assert.string(action)
    super(`Access policy for '${docTypeName}' forbids the action '${action}'.`)
    this.docTypeName = docTypeName
    this.action = action
  }
}

class JsonotronConstructorNotDefinedError extends JsonotronRequestError {
  constructor (docTypeName) {
    check.assert.string(docTypeName)
    super(`Documents of type '${docTypeName}' cannot be constructed because a constructor is not defined.`)
    this.docTypeName = docTypeName
  }
}

class JsonotronConstructorParamsValidationError extends JsonotronRequestError {
  constructor (docTypeName, validatorErrors) {
    check.assert.string(docTypeName)
    check.assert.array(validatorErrors)
    super(`Validation failed for params of constructor on document type '${docTypeName}'.\n${JSON.stringify(validatorErrors, null, 2)}`)
    this.docTypeName = docTypeName
    this.validatorErrors = validatorErrors
  }
}

class JsonotronDocumentCustomValidationError extends JsonotronRequestError {
  constructor (docTypeName, innerErr) {
    check.assert.string(docTypeName)
    check.assert.instance(innerErr, Error)
    super(`Document did not pass custom validation defined for document type '${docTypeName}'.\n${innerErr.toString()}`)
    this.docTypeName = docTypeName
    this.innerErr = innerErr
  }
}

class JsonotronDocumentFieldsValidationError extends JsonotronRequestError {
  constructor (docTypeName, validatorErrors) {
    check.assert.string(docTypeName)
    check.assert.array(validatorErrors)
    super(`Validation failed for fields of document type '${docTypeName}'.\n${JSON.stringify(validatorErrors, null, 2)}`)
    this.docTypeName = docTypeName
    this.validatorErrors = validatorErrors
  }
}

class JsonotronFilterParamsValidationError extends JsonotronRequestError {
  constructor (docTypeName, filterName, validatorErrors) {
    check.assert.string(docTypeName)
    check.assert.string(filterName)
    check.assert.array(validatorErrors)
    super(`Validation failed for params of filter '${filterName} on document type '${docTypeName}'.\n${JSON.stringify(validatorErrors, null, 2)}`)
    this.docTypeName = docTypeName
    this.filterName = filterName
    this.validatorErrors = validatorErrors
  }
}

class JsonotronMergePatchValidationError extends JsonotronRequestError {
  constructor (docTypeName, validatorErrors) {
    check.assert.string(docTypeName)
    check.assert.array(validatorErrors)
    super(`Validation failed for merge-patch on document type '${docTypeName}'.\n${JSON.stringify(validatorErrors, null, 2)}`)
    this.docTypeName = docTypeName
    this.validatorErrors = validatorErrors
  }
}

class JsonotronDocumentNotFoundError extends JsonotronRequestError {
  constructor (docTypeName, id) {
    check.assert.string(docTypeName)
    check.assert.string(id)
    super(`Documents of type '${docTypeName}' with id '${id}' was not found in the document store.`)
    this.docTypeName = docTypeName
    this.id = id
  }
}

class JsonotronOperationParamsValidationError extends JsonotronRequestError {
  constructor (docTypeName, operationName, validatorErrors) {
    check.assert.string(docTypeName)
    check.assert.string(operationName)
    check.assert.array(validatorErrors)
    super(`Validation failed for params of operation '${operationName} on document type '${docTypeName}'.\n${JSON.stringify(validatorErrors, null, 2)}`)
    this.docTypeName = docTypeName
    this.operationName = operationName
    this.validatorErrors = validatorErrors
  }
}

class JsonotronFieldValueValidationError extends JsonotronRequestError {
  constructor (fieldTypeName, validatorErrors) {
    check.assert.string(fieldTypeName)
    check.assert.array(validatorErrors)
    super(`Validation failed for value of field type '${fieldTypeName}'.\n${JSON.stringify(validatorErrors, null, 2)}`)
    this.fieldTypeName = fieldTypeName
    this.validatorErrors = validatorErrors
  }
}

class JsonotronInsufficientPermissionsError extends JsonotronRequestError {
  constructor (roleNames, docTypeName, action) {
    check.assert.array.of.string(roleNames)
    check.assert.string(docTypeName)
    check.assert.string(action)
    super(`None of the permissions in roles '${roleNames.join(', ')}' support performing action '${action}' on '${docTypeName}'.`)
    this.roleNames = roleNames
    this.docTypeName = docTypeName
    this.action = action
  }
}

class JsonotronInvalidMergePatchError extends JsonotronRequestError {
  constructor (message) {
    check.assert.string(message)
    super(`Merge patch is invalid.\n${message}`)
  }
}

class JsonotronRequiredVersionNotAvailableError extends JsonotronRequestError {
  constructor () {
    super('Required version of document is not available in the doc store.')
  }
}

class JsonotronUnrecognisedDocTypeNameError extends JsonotronRequestError {
  constructor (docTypeName) {
    check.assert.string(docTypeName)
    super(`A document type named '${docTypeName}' is not defined.`)
    this.docTypeName = docTypeName
  }
}

class JsonotronUnrecognisedDocTypePluralNameError extends JsonotronRequestError {
  constructor (docTypePluralName) {
    check.assert.string(docTypePluralName)
    super(`A document type with a plural name of '${docTypePluralName}' is not defined.`)
    this.docTypePluralName = docTypePluralName
  }
}

class JsonotronUnrecognisedFieldNameError extends JsonotronRequestError {
  constructor (docTypeName, fieldName) {
    check.assert.string(docTypeName)
    check.assert.string(fieldName)
    super(`Document type '${docTypeName}' does not define a field named '${fieldName}'.`)
    this.docTypeName = docTypeName
    this.fieldName = fieldName
  }
}

class JsonotronUnrecognisedFilterNameError extends JsonotronRequestError {
  constructor (docTypeName, filterName) {
    check.assert.string(docTypeName)
    check.assert.string(filterName)
    super(`Document type '${docTypeName}' does not define a filter named '${filterName}'.`)
    this.docTypeName = docTypeName
    this.filterName = filterName
  }
}

class JsonotronUnrecognisedOperationNameError extends JsonotronRequestError {
  constructor (docTypeName, operationName) {
    check.assert.string(docTypeName)
    check.assert.string(operationName)
    super(`Document type '${docTypeName}' does not define an operation named '${operationName}'.`)
    this.docTypeName = docTypeName
    this.operationName = operationName
  }
}

class JsonotronUnrecognisedRoleTypeNameError extends JsonotronRequestError {
  constructor (roleTypeName) {
    check.assert.string(roleTypeName)
    super(`A role type named '${roleTypeName}' is not defined.`)
    this.roleTypeName = roleTypeName
  }
}

module.exports = {
  JsonotronActionForbiddenByPolicyError,
  JsonotronConstructorNotDefinedError,
  JsonotronConstructorParamsValidationError,
  JsonotronDocumentCustomValidationError,
  JsonotronDocumentFieldsValidationError,
  JsonotronDocumentNotFoundError,
  JsonotronFieldValueValidationError,
  JsonotronFilterParamsValidationError,
  JsonotronInsufficientPermissionsError,
  JsonotronInvalidMergePatchError,
  JsonotronMergePatchValidationError,
  JsonotronOperationParamsValidationError,
  JsonotronRequiredVersionNotAvailableError,
  JsonotronUnrecognisedDocTypeNameError,
  JsonotronUnrecognisedDocTypePluralNameError,
  JsonotronUnrecognisedFieldNameError,
  JsonotronUnrecognisedFilterNameError,
  JsonotronUnrecognisedOperationNameError,
  JsonotronUnrecognisedRoleTypeNameError
}
