import check from 'check-types'
import { SengiError } from './SengiError'

export class SengiDocStoreValidationFailedError extends SengiError {
  constructor (message) {
    check.assert.string(message)
    super(message)
  }
}

export class SengiDocTypeCtorParamsValidationFailedError extends SengiDocStoreValidationFailedError {
  constructor (docTypeName, errors) {
    check.assert.string(docTypeName)
    check.assert.array.of.object(errors)
    super(`The parameters supplied to the constructor for doc type '${docTypeName}' were not valid.`)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.errors = errors
  }
}

export class SengiDocTypeFieldsValidationFailedError extends SengiDocStoreValidationFailedError {
  constructor (docTypeName, errors) {
    check.assert.string(docTypeName)
    check.assert.array.of.object(errors)
    super(`The values supplied for the fields of doc type '${docTypeName}' were not valid.`)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.errors = errors
  }
}

export class SengiDocTypeFilterParamsValidationFailedError extends SengiDocStoreValidationFailedError {
  constructor (docTypeName, filterName, errors) {
    check.assert.string(docTypeName)
    check.assert.string(filterName)
    check.assert.array.of.object(errors)
    super(`The parameters supplied to filter '${filterName}' for doc type '${docTypeName}' were not valid.`)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.filterName = filterName
    this.errors = errors
  }
}

export class SengiDocTypeInstanceValidationFailedError extends SengiDocStoreValidationFailedError {
  constructor (docTypeName, errors) {
    check.assert.string(docTypeName)
    check.assert.array.of.object(errors)
    super(`The values supplied for an instance of doc type '${docTypeName}' were not valid.`)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.errors = errors
  }
}

export class SengiDocTypeOperationParamsValidationFailedError extends SengiDocStoreValidationFailedError {
  constructor (docTypeName, operationName, errors) {
    check.assert.string(docTypeName)
    check.assert.string(operationName)
    check.assert.array.of.object(errors)
    super(`The parameters supplied to operation '${operationName}' for doc type '${docTypeName}' were not valid.`)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.operationName = operationName
    this.errors = errors
  }
}

export class SengiDocTypePatchValidationFailedError extends SengiDocStoreValidationFailedError {
  constructor (docTypeName, errors) {
    check.assert.string(docTypeName)
    check.assert.array.of.object(errors)
    super(`The parameters supplied for a patch for doc type '${docTypeName}' were not valid.`)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.errors = errors
  }
}
