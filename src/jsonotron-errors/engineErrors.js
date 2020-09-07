import check from 'check-types'
import { JsonotronError } from './JsonotronError'

export class JsonotronEngineError extends JsonotronError {
  constructor (message) {
    check.assert.string(message)
    super(message)
  }
}

export class JsonotronApiResourceTypesDocumentationMissingError extends JsonotronEngineError {
  constructor (propertyPathArrays) {
    check.assert.array.of.object(propertyPathArrays)
    propertyPathArrays.forEach(a => {
      check.assert.string(a.apiResourceTypeUrlRoot)
      check.assert.array.of.string(a.propertyPaths)
    })
    super(`Documentation is missing for api resource types.\n${JSON.stringify(propertyPathArrays, null, 2)}`)
    this.propertyPathArrays = propertyPathArrays
  }
}

export class JsonotronApiResourceTypeValidationError extends JsonotronEngineError {
  constructor (apiResourceTypeUrlRoot, message) {
    // check.assert.string(apiResourceTypeUrlRoot) - allow missing name
    check.assert.string(message)
    super(`Api resource type '${apiResourceTypeUrlRoot}' is not valid.\n${message}`)
    this.apiResourceTypeUrlRoot = apiResourceTypeUrlRoot
  }
}

export class JsonotronCalculatedFieldFailedError extends JsonotronEngineError {
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

export class JsonotronCallbackError extends JsonotronEngineError {
  constructor (callbackName, innerErr) {
    check.assert.string(callbackName)
    check.assert.instance(innerErr, Error)
    super(`An error was thrown by the callback delegate for '${callbackName}'\n${innerErr.toString()}`)
    this.callbackName = callbackName
    this.innerErr = innerErr
  }
}

export class JsonotronCategoryTypeDocumentationMissingError extends JsonotronEngineError {
  constructor (categoryTypeName, propertyPaths) {
    check.assert.string(categoryTypeName)
    check.assert.array.of.string(propertyPaths)
    super(`Documentation is missing for category '${categoryTypeName}'.\n${JSON.stringify(propertyPaths, null, 2)}`)
    this.categoryTypeName = categoryTypeName
    this.propertyPaths = propertyPaths
  }
}

export class JsonotronCategoryTypeValidationError extends JsonotronEngineError {
  constructor (categoryTypeName, message) {
    // check.assert.string(categoryTypeName) - allow missing name
    check.assert.string(message)
    super(`Category '${categoryTypeName}' is not valid.\n${message}`)
    this.categoryTypeName = categoryTypeName
  }
}

export class JsonotronConstructorFailedError extends JsonotronEngineError {
  constructor (docTypeName, innerErr) {
    check.assert.string(docTypeName)
    check.assert.instance(innerErr, Error)
    super(`Constructor on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    this.docTypeName = docTypeName
    this.innerErr = innerErr
  }
}

export class JsonotronDocTypesDocumentationMissingError extends JsonotronEngineError {
  constructor (propertyPathArrays) {
    check.assert.array.of.object(propertyPathArrays)
    propertyPathArrays.forEach(a => {
      check.assert.string(a.docTypeName)
      check.assert.array.of.string(a.propertyPaths)
    })
    super(`Documentation is missing for doc types.\n${JSON.stringify(propertyPathArrays, null, 2)}`)
    this.propertyPathArrays = propertyPathArrays
  }
}

export class JsonotronDocTypeValidationError extends JsonotronEngineError {
  constructor (docTypeName, message) {
    // check.assert.string(docTypeName) - allow missing name
    check.assert.string(message)
    super(`Document type '${docTypeName}' is not valid.\n${message}`)
    this.docTypeName = docTypeName
  }
}

export class JsonotronEnumTypeDocumentationMissingError extends JsonotronEngineError {
  constructor (enumTypeName, propertyPaths) {
    check.assert.string(enumTypeName)
    check.assert.array.of.string(propertyPaths)
    super(`Documentation is missing for enum type '${enumTypeName}'.\n${JSON.stringify(propertyPaths, null, 2)}`)
    this.enumTypeName = enumTypeName
    this.propertyPaths = propertyPaths
  }
}

export class JsonotronEnumTypeResolutionError extends JsonotronEngineError {
  constructor (enumTypeName) {
    check.assert.string(enumTypeName)
    super(`Enum type '${enumTypeName}' cannot be resolved.`)
    this.enumTypeName = enumTypeName
  }
}

export class JsonotronEnumTypeValidationError extends JsonotronEngineError {
  constructor (enumTypeName, message) {
    // check.assert.string(fieldTypeName) - allow missing name
    check.assert.string(message)
    super(`Enum type '${enumTypeName}' is not valid.\n${message}`)
    this.enumTypeName = enumTypeName
  }
}

export class JsonotronFieldTypeResolutionError extends JsonotronEngineError {
  constructor (fieldTypeName) {
    check.assert.string(fieldTypeName)
    super(`Field type '${fieldTypeName}' cannot be resolved.`)
    this.fieldTypeName = fieldTypeName
  }
}

export class JsonotronFieldTypeValidationError extends JsonotronEngineError {
  constructor (fieldTypeName, message) {
    // check.assert.string(fieldTypeName) - allow missing name
    check.assert.string(message)
    super(`Field type '${fieldTypeName}' is not valid.\n${message}`)
    this.fieldTypeName = fieldTypeName
  }
}

export class JsonotronFieldTypeValuesValidationError extends JsonotronEngineError {
  constructor (fieldTypeName, lang, message) {
    // check.assert.string(fieldTypeName) - allow missing name
    // check.assert.string(lang) - allow missing language
    check.assert.string(message)
    super(`The values object for field type '${fieldTypeName}' in language '${lang}' is not valid.\n${message}`)
    this.fieldTypeName = fieldTypeName
    this.lang = lang
  }
}

export class JsonotronFieldTypesDocumentationMissingError extends JsonotronEngineError {
  constructor (propertyPathArrays) {
    check.assert.array.of.object(propertyPathArrays)
    propertyPathArrays.forEach(a => {
      check.assert.string(a.fieldTypeName)
      check.assert.array.of.string(a.propertyPaths)
    })
    super(`Documentation is missing for field types.\n${JSON.stringify(propertyPathArrays, null, 2)}`)
    this.propertyPathArrays = propertyPathArrays
  }
}

export class JsonotronFilterFailedError extends JsonotronEngineError {
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

export class JsonotronInvalidOperationMergePatchError extends JsonotronEngineError {
  constructor (docTypeName, operationName, message) {
    check.assert.string(operationName)
    check.assert.string(message)
    super(`Merge patch returned from operation '${operationName}' on document type '${docTypeName}' is invalid.\n${message}`)
    this.docTypeName = docTypeName
    this.operationName = operationName
  }
}

export class JsonotronOperationFailedError extends JsonotronEngineError {
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

export class JsonotronOperationNonObjectResponseError extends JsonotronEngineError {
  constructor (docTypeName, operationName) {
    check.assert.string(docTypeName)
    check.assert.string(operationName)
    super(`Operation '${operationName}' on document type '${docTypeName}' failed to return an object.`)
    this.docTypeName = docTypeName
    this.operationName = operationName
  }
}

export class JsonotronPreSaveFailedError extends JsonotronEngineError {
  constructor (docTypeName, innerErr) {
    check.assert.string(docTypeName)
    check.assert.instance(innerErr, Error)
    super(`Pre-save function on document type '${docTypeName}' raised an error.\n${innerErr.toString()}`)
    this.docTypeName = docTypeName
    this.innerErr = innerErr
  }
}

export class JsonotronRoleTypeDocumentationMissingError extends JsonotronEngineError {
  constructor (roleTypeName, propertyPaths) {
    check.assert.string(roleTypeName)
    check.assert.array.of.string(propertyPaths)
    super(`Documentation is missing for role type '${roleTypeName}'.\n${JSON.stringify(propertyPaths, null, 2)}`)
    this.roleTypeName = roleTypeName
    this.propertyPaths = propertyPaths
  }
}

export class JsonotronRoleTypeValidationError extends JsonotronEngineError {
  constructor (roleTypeName, message) {
    // check.assert.string(roleTypeName) - allow missing name
    check.assert.string(message)
    super(`Role type '${roleTypeName}' is not valid.\n${message}`)
    this.roleTypeName = roleTypeName
  }
}
