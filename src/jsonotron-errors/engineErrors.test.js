/* eslint-env jest */
import {
  JsonotronEngineError,
  JsonotronApiResourceTypesDocumentationMissingError,
  JsonotronApiResourceTypeValidationError,
  JsonotronCalculatedFieldFailedError,
  JsonotronCallbackError,
  JsonotronCategoryTypeDocumentationMissingError,
  JsonotronCategoryTypeValidationError,
  JsonotronConstructorFailedError,
  JsonotronDocTypeValidationError,
  JsonotronDocTypesDocumentationMissingError,
  JsonotronEnumTypeDocumentationMissingError,
  JsonotronEnumTypeResolutionError,
  JsonotronEnumTypeValidationError,
  JsonotronFieldTypeResolutionError,
  JsonotronFieldTypesDocumentationMissingError,
  JsonotronFieldTypeValidationError,
  JsonotronFieldTypeValuesValidationError,
  JsonotronFilterFailedError,
  JsonotronInvalidOperationMergePatchError,
  JsonotronOperationFailedError,
  JsonotronOperationNonObjectResponseError,
  JsonotronPreSaveFailedError,
  JsonotronRoleTypeDocumentationMissingError,
  JsonotronRoleTypeValidationError
} from './engineErrors'

test('The engine error is constructed correctly.', () => {
  const err = new JsonotronEngineError('my message')
  expect(err).toHaveProperty('name', 'JsonotronEngineError')
  expect(err).toHaveProperty('message', 'my message')
})

test('The api resource type documentation missing error is constructed correctly.', () => {
  const err = new JsonotronApiResourceTypesDocumentationMissingError([{ apiResourceTypeUrlRoot: '/resource', propertyPaths: ['title', 'parent.child[0].paragraphs'] }])
  expect(err).toHaveProperty('name', 'JsonotronApiResourceTypesDocumentationMissingError')
  expect(err).toHaveProperty('message', expect.stringContaining('Documentation is missing for api resource types'))
  expect(err).toHaveProperty('message', expect.stringContaining('parent.child[0].paragraphs'))
})

test('The api resource type validation error is constructed correctly.', () => {
  const err = new JsonotronApiResourceTypeValidationError('/resource', 'my message.')
  expect(err).toHaveProperty('name', 'JsonotronApiResourceTypeValidationError')
  expect(err).toHaveProperty('apiResourceTypeUrlRoot', '/resource')
  expect(err).toHaveProperty('message', 'Api resource type \'/resource\' is not valid.\nmy message.')
})

test('The calculated field failed error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new JsonotronCalculatedFieldFailedError('my doctype', 'my field', innerErr)
  expect(err).toHaveProperty('name', 'JsonotronCalculatedFieldFailedError')
  expect(err).toHaveProperty('docTypeName', 'my doctype')
  expect(err).toHaveProperty('fieldName', 'my field')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'Calculated field \'my field\' on document type \'my doctype\' raised an error.\nError: inner error.')
})

test('The callback error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new JsonotronCallbackError('my callback', innerErr)
  expect(err).toHaveProperty('name', 'JsonotronCallbackError')
  expect(err).toHaveProperty('callbackName', 'my callback')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'An error was thrown by the callback delegate for \'my callback\'\nError: inner error.')
})

test('The category type documentation missing error is constructed correctly.', () => {
  const err = new JsonotronCategoryTypeDocumentationMissingError('my category', ['title', 'parent.child[0].paragraphs'])
  expect(err).toHaveProperty('name', 'JsonotronCategoryTypeDocumentationMissingError')
  expect(err).toHaveProperty('categoryTypeName', 'my category')
  expect(err).toHaveProperty('message', expect.stringContaining('Documentation is missing for category \'my category\''))
  expect(err).toHaveProperty('message', expect.stringContaining('parent.child[0].paragraphs'))
})

test('The category type validation error is constructed correctly.', () => {
  const err = new JsonotronCategoryTypeValidationError('my category', 'my error.')
  expect(err).toHaveProperty('name', 'JsonotronCategoryTypeValidationError')
  expect(err).toHaveProperty('categoryTypeName', 'my category')
  expect(err).toHaveProperty('message', 'Category \'my category\' is not valid.\nmy error.')

  const err2 = new JsonotronCategoryTypeValidationError(undefined, 'my error.')
  expect(err2).toHaveProperty('name', 'JsonotronCategoryTypeValidationError')
  expect(err2).toHaveProperty('categoryTypeName', undefined)
  expect(err2).toHaveProperty('message', 'Category \'undefined\' is not valid.\nmy error.')
})

test('The constructor failed error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new JsonotronConstructorFailedError('my docType', innerErr)
  expect(err).toHaveProperty('name', 'JsonotronConstructorFailedError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'Constructor on document type \'my docType\' raised an error.\nError: inner error.')
})

test('The doc type documentation missing error is constructed correctly.', () => {
  const err = new JsonotronDocTypesDocumentationMissingError([{ docTypeName: 'myDocType', propertyPaths: ['title', 'parent.child[0].paragraphs'] }])
  expect(err).toHaveProperty('name', 'JsonotronDocTypesDocumentationMissingError')
  expect(err).toHaveProperty('message', expect.stringContaining('Documentation is missing for doc types'))
  expect(err).toHaveProperty('message', expect.stringContaining('parent.child[0].paragraphs'))
})

test('The doc type validation error is constructed correctly.', () => {
  const err = new JsonotronDocTypeValidationError('my docType', 'my message.')
  expect(err).toHaveProperty('name', 'JsonotronDocTypeValidationError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('message', 'Document type \'my docType\' is not valid.\nmy message.')
})

test('The enum type documentation missing error is constructed correctly.', () => {
  const err = new JsonotronEnumTypeDocumentationMissingError('my enumType', ['title', 'parent.child[0].paragraphs'])
  expect(err).toHaveProperty('name', 'JsonotronEnumTypeDocumentationMissingError')
  expect(err).toHaveProperty('enumTypeName', 'my enumType')
  expect(err).toHaveProperty('message', expect.stringContaining('Documentation is missing for enum type \'my enumType\''))
  expect(err).toHaveProperty('message', expect.stringContaining('parent.child[0].paragraphs'))
})

test('The enum type resolution error is constructed correctly.', () => {
  const err = new JsonotronEnumTypeResolutionError('my enumType')
  expect(err).toHaveProperty('name', 'JsonotronEnumTypeResolutionError')
  expect(err).toHaveProperty('enumTypeName', 'my enumType')
  expect(err).toHaveProperty('message', 'Enum type \'my enumType\' cannot be resolved.')
})

test('The enum type validation error is constructed correctly.', () => {
  const err = new JsonotronEnumTypeValidationError('my enumType', 'my message.')
  expect(err).toHaveProperty('name', 'JsonotronEnumTypeValidationError')
  expect(err).toHaveProperty('enumTypeName', 'my enumType')
  expect(err).toHaveProperty('message', 'Enum type \'my enumType\' is not valid.\nmy message.')
})

test('The field type documentation missing error is constructed correctly.', () => {
  const err = new JsonotronFieldTypesDocumentationMissingError([{ fieldTypeName: 'myFieldType', propertyPaths: ['title', 'parent.child[0].paragraphs'] }])
  expect(err).toHaveProperty('name', 'JsonotronFieldTypesDocumentationMissingError')
  expect(err).toHaveProperty('message', expect.stringContaining('Documentation is missing for field types'))
  expect(err).toHaveProperty('message', expect.stringContaining('parent.child[0].paragraphs'))
})

test('The field type resolution error is constructed correctly.', () => {
  const err = new JsonotronFieldTypeResolutionError('my fieldType')
  expect(err).toHaveProperty('name', 'JsonotronFieldTypeResolutionError')
  expect(err).toHaveProperty('fieldTypeName', 'my fieldType')
  expect(err).toHaveProperty('message', 'Field type \'my fieldType\' cannot be resolved.')
})

test('The field type validation error is constructed correctly.', () => {
  const err = new JsonotronFieldTypeValidationError('my fieldType', 'my message.')
  expect(err).toHaveProperty('name', 'JsonotronFieldTypeValidationError')
  expect(err).toHaveProperty('fieldTypeName', 'my fieldType')
  expect(err).toHaveProperty('message', 'Field type \'my fieldType\' is not valid.\nmy message.')
})

test('The field type values error is constructed correctly.', () => {
  const err = new JsonotronFieldTypeValuesValidationError('my fieldType', 'en', 'my error.')
  expect(err).toHaveProperty('name', 'JsonotronFieldTypeValuesValidationError')
  expect(err).toHaveProperty('fieldTypeName', 'my fieldType')
  expect(err).toHaveProperty('lang', 'en')
  expect(err).toHaveProperty('message', 'The values object for field type \'my fieldType\' in language \'en\' is not valid.\nmy error.')
})

test('The filter failed error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new JsonotronFilterFailedError('my docType', 'my filter', innerErr)
  expect(err).toHaveProperty('name', 'JsonotronFilterFailedError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('filterName', 'my filter')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'Filter \'my filter\' on document type \'my docType\' raised an error.\nError: inner error.')
})

test('The invalid operation merge patch error is constructed correctly.', () => {
  const err = new JsonotronInvalidOperationMergePatchError('my docType', 'my operation', 'my message.')
  expect(err).toHaveProperty('name', 'JsonotronInvalidOperationMergePatchError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('operationName', 'my operation')
  expect(err).toHaveProperty('message', 'Merge patch returned from operation \'my operation\' on document type \'my docType\' is invalid.\nmy message.')
})

test('The operation failed error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new JsonotronOperationFailedError('my docType', 'my operation', innerErr)
  expect(err).toHaveProperty('name', 'JsonotronOperationFailedError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('operationName', 'my operation')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'Operation \'my operation\' on document type \'my docType\' raised an error.\nError: inner error.')
})

test('The operation non object response error is constructed correctly.', () => {
  const err = new JsonotronOperationNonObjectResponseError('my docType', 'my operation')
  expect(err).toHaveProperty('name', 'JsonotronOperationNonObjectResponseError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('operationName', 'my operation')
  expect(err).toHaveProperty('message', 'Operation \'my operation\' on document type \'my docType\' failed to return an object.')
})

test('The pre save failed error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new JsonotronPreSaveFailedError('my docType', innerErr)
  expect(err).toHaveProperty('name', 'JsonotronPreSaveFailedError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'Pre-save function on document type \'my docType\' raised an error.\nError: inner error.')
})

test('The role type documentation missing error is constructed correctly.', () => {
  const err = new JsonotronRoleTypeDocumentationMissingError('my roleType', ['title', 'parent.child[0].paragraphs'])
  expect(err).toHaveProperty('name', 'JsonotronRoleTypeDocumentationMissingError')
  expect(err).toHaveProperty('roleTypeName', 'my roleType')
  expect(err).toHaveProperty('message', expect.stringContaining('Documentation is missing for role type \'my roleType\''))
  expect(err).toHaveProperty('message', expect.stringContaining('parent.child[0].paragraphs'))
})

test('The role type validation error is constructed correctly.', () => {
  const err = new JsonotronRoleTypeValidationError('my roleType', 'my message.')
  expect(err).toHaveProperty('name', 'JsonotronRoleTypeValidationError')
  expect(err).toHaveProperty('roleTypeName', 'my roleType')
  expect(err).toHaveProperty('message', 'Role type \'my roleType\' is not valid.\nmy message.')
})
