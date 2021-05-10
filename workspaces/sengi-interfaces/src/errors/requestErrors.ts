import { SengiRequestError } from './baseErrors'
import { ValidationError } from '../validation'

export class SengiActionForbiddenByPolicyError extends SengiRequestError { // HTTP 403
  constructor (readonly docTypeName: string, readonly action: string) {
    super(`Access policy for '${docTypeName}' forbids the action '${action}'.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.action = action
  }
}

export class SengiCommandParamsValidationFailedError extends SengiRequestError {
  constructor (readonly docTypeName: string, readonly commandName: string, readonly errors: ValidationError[]) {
    super(`The parameters supplied to command '${commandName}' for doc type '${docTypeName}' were not valid.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.commandName = commandName
    this.errors = errors
  }
}

export class SengiConflictOnSaveError extends SengiRequestError { // HTTP 409
  constructor () {
    super('Document could not be updated as it was changed by another process during the operation.')
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiCtorParamsValidationFailedError extends SengiRequestError {
  constructor (readonly docTypeName: string, readonly errors: ValidationError[]) {
    super(`The parameters supplied to the constructor for doc type '${docTypeName}' were not valid.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.errors = errors
  }
}

export class SengiDocTypeValidateFunctionError extends SengiRequestError {
  constructor (readonly docTypeName: string, readonly innerErr: Error) {
    super(`The validate function defined for document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.innerErr = innerErr
  }
}

export class SengiDocValidationFailedError extends SengiRequestError {
  constructor (readonly docTypeName: string, readonly errors: ValidationError[]) {
    super(`The values supplied are not a valid instance of doc type '${docTypeName}'.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.errors = errors
  }
}

export class SengiDocNotFoundError extends SengiRequestError { // HTTP 404
  constructor (readonly docTypeName: string, readonly id: string) {
    super(`Document of type '${docTypeName}' with id '${id}' was not found in the document store.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.id = id
  }
}

export class SengiFilterParamsValidationFailedError extends SengiRequestError {
  constructor (readonly docTypeName: string, readonly filterName: string, readonly errors: ValidationError[]) {
    super(`The parameters supplied to filter '${filterName}' for doc type '${docTypeName}' were not valid.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.filterName = filterName
    this.errors = errors
  }
}

export class SengiInsufficientPermissionsError extends SengiRequestError {
  constructor (readonly roleNames: string[], readonly docTypeName: string, readonly action: string) {
    super(`None of the permissions in roles '${roleNames.join(', ')}' support performing action '${action}' on '${docTypeName}'.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.roleNames = roleNames
    this.docTypeName = docTypeName
    this.action = action
  }
}

export class SengiOperationParamsValidationFailedError extends SengiRequestError {
  constructor (readonly docTypeName: string, readonly operationName: string, readonly errors: ValidationError[]) {
    super(`The parameters supplied to operation '${operationName}' for doc type '${docTypeName}' were not valid.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.operationName = operationName
    this.errors = errors
  }
}

export class SengiPatchValidationFailedError extends SengiRequestError {
  constructor (readonly docTypeName: string, readonly errors: ValidationError[]) {
    super(`The parameters supplied for a patch for doc type '${docTypeName}' were not valid.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.errors = errors
  }
}

export class SengiRequiredVersionNotAvailableError extends SengiRequestError { // HTTP 412
  constructor () {
    super('Required version of document is not available in the doc store.')
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
  }
}

export class SengiUnrecognisedCommandNameError extends SengiRequestError {
  constructor (readonly docTypeName: string, readonly commandName: string) {
    super(`Document type '${docTypeName}' does not define a command named '${commandName}'.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.commandName = commandName
  }
}

export class SengiUnrecognisedDocTypeNameError extends SengiRequestError {
  constructor (readonly docTypeName: string) {
    super(`A document type named '${docTypeName}' is not defined.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
  }
}

export class SengiUnrecognisedFieldNameError extends SengiRequestError {
  constructor (readonly docTypeName: string, readonly fieldName: string) {
    super(`Document type '${docTypeName}' does not define a field named '${fieldName}'.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.fieldName = fieldName
  }
}

export class SengiUnrecognisedFilterNameError extends SengiRequestError {
  constructor (readonly docTypeName: string, readonly filterName: string) {
    super(`Document type '${docTypeName}' does not define a filter named '${filterName}'.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.filterName = filterName
  }
}

export class SengiUnrecognisedOperationNameError extends SengiRequestError {
  constructor (readonly docTypeName: string, readonly operationName: string) {
    super(`Document type '${docTypeName}' does not define an operation named '${operationName}'.`)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name
    this.docTypeName = docTypeName
    this.operationName = operationName
  }
}