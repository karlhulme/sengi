import check from 'check-types'
import { SengiError } from './SengiError'

export class SengiRequestError extends SengiError { // HTTP 400
  constructor (message) {
    check.assert.string(message)
    super(message)
  }
}

export class SengiActionForbiddenByPolicyError extends SengiRequestError { // HTTP 403
  constructor (docTypeName, action) {
    check.assert.string(docTypeName)
    check.assert.string(action)
    super(`Access policy for '${docTypeName}' forbids the action '${action}'.`)
    this.docTypeName = docTypeName
    this.action = action
  }
}

export class SengiConflictOnSaveError extends SengiRequestError { // HTTP 409
  constructor () {
    super('Document could not be updated as it was changed by another process during the operation.')
  }
}

export class SengiDocumentCustomValidationError extends SengiRequestError {
  constructor (docTypeName, innerErr) {
    check.assert.string(docTypeName)
    check.assert.instance(innerErr, Error)
    super(`Document did not pass custom validation defined for document type '${docTypeName}'.\n${innerErr.toString()}`)
    this.docTypeName = docTypeName
    this.innerErr = innerErr
  }
}

export class SengiDocumentNotFoundError extends SengiRequestError { // HTTP 404
  constructor (docTypeName, id) {
    check.assert.string(docTypeName)
    check.assert.string(id)
    super(`Document of type '${docTypeName}' with id '${id}' was not found in the document store.`)
    this.docTypeName = docTypeName
    this.id = id
  }
}

export class SengiInsufficientPermissionsError extends SengiRequestError {
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

export class SengiInvalidMergePatchError extends SengiRequestError {
  constructor (message) {
    check.assert.string(message)
    super(`Merge patch is invalid.\n${message}`)
  }
}

export class SengiRequiredVersionNotAvailableError extends SengiRequestError { // HTTP 412
  constructor () {
    super('Required version of document is not available in the doc store.')
  }
}

export class SengiUnrecognisedDocTypeNameError extends SengiRequestError {
  constructor (docTypeName) {
    check.assert.string(docTypeName)
    super(`A document type named '${docTypeName}' is not defined.`)
    this.docTypeName = docTypeName
  }
}

export class SengiUnrecognisedFieldNameError extends SengiRequestError {
  constructor (docTypeName, fieldName) {
    check.assert.string(docTypeName)
    check.assert.string(fieldName)
    super(`Document type '${docTypeName}' does not define a field named '${fieldName}'.`)
    this.docTypeName = docTypeName
    this.fieldName = fieldName
  }
}

export class SengiUnrecognisedFilterNameError extends SengiRequestError {
  constructor (docTypeName, filterName) {
    check.assert.string(docTypeName)
    check.assert.string(filterName)
    super(`Document type '${docTypeName}' does not define a filter named '${filterName}'.`)
    this.docTypeName = docTypeName
    this.filterName = filterName
  }
}

export class SengiUnrecognisedOperationNameError extends SengiRequestError {
  constructor (docTypeName, operationName) {
    check.assert.string(docTypeName)
    check.assert.string(operationName)
    super(`Document type '${docTypeName}' does not define an operation named '${operationName}'.`)
    this.docTypeName = docTypeName
    this.operationName = operationName
  }
}
