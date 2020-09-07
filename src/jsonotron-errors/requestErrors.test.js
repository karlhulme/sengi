/* eslint-env jest */
import {
  JsonotronRequestError,
  JsonotronActionForbiddenByPolicyError,
  JsonotronConflictOnSaveError,
  JsonotronConstructorNotDefinedError,
  JsonotronConstructorParamsValidationError,
  JsonotronDocumentCustomValidationError,
  JsonotronDocumentFieldsValidationError,
  JsonotronDocumentNotFoundError,
  JsonotronEnumValueValidationError,
  JsonotronFieldValueValidationError,
  JsonotronFilterParamsValidationError,
  JsonotronInsufficientPermissionsError,
  JsonotronInvalidMergePatchError,
  JsonotronMergePatchValidationError,
  JsonotronOperationParamsValidationError,
  JsonotronRequiredVersionNotAvailableError,
  JsonotronUnrecognisedCalculatedFieldNameError,
  JsonotronUnrecognisedDocTypeNameError,
  JsonotronUnrecognisedFieldNameError,
  JsonotronUnrecognisedFilterNameError,
  JsonotronUnrecognisedOperationNameError
} from './requestErrors'

test('The request error is constructed correctly.', () => {
  const err = new JsonotronRequestError('my message')
  expect(err).toHaveProperty('name', 'JsonotronRequestError')
  expect(err).toHaveProperty('message', 'my message')
})

test('The action forbidden by policy error is constructed correctly.', () => {
  const err = new JsonotronActionForbiddenByPolicyError('my docType', 'my action')
  expect(err).toHaveProperty('name', 'JsonotronActionForbiddenByPolicyError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('action', 'my action')
  expect(err).toHaveProperty('message', 'Access policy for \'my docType\' forbids the action \'my action\'.')
})

test('The conflict on save error is constructed correctly.', () => {
  const err = new JsonotronConflictOnSaveError()
  expect(err).toHaveProperty('name', 'JsonotronConflictOnSaveError')
  expect(err).toHaveProperty('message', 'Document could not be updated as it was changed by another process during the operation.')
})

test('The constructor not defined error is constructed correctly.', () => {
  const err = new JsonotronConstructorNotDefinedError('my docType')
  expect(err).toHaveProperty('name', 'JsonotronConstructorNotDefinedError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('message', 'Documents of type \'my docType\' cannot be constructed because a constructor is not defined.')
})

test('The constructor params validation error is constructed correctly.', () => {
  const validatorErrors = [1, 2, 3]
  const err = new JsonotronConstructorParamsValidationError('my docType', validatorErrors)
  expect(err).toHaveProperty('name', 'JsonotronConstructorParamsValidationError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('validatorErrors', validatorErrors)
  expect(err).toHaveProperty('message', 'Validation failed for params of constructor on document type \'my docType\'.\n' + JSON.stringify(validatorErrors, null, 2))
})

test('The document custom validation error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new JsonotronDocumentCustomValidationError('my docType', innerErr)
  expect(err).toHaveProperty('name', 'JsonotronDocumentCustomValidationError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'Document did not pass custom validation defined for document type \'my docType\'.\nError: inner error.')
})

test('The document fields validation error is constructed correctly.', () => {
  const validatorErrors = [1, 2, 3]
  const err = new JsonotronDocumentFieldsValidationError('my docType', validatorErrors)
  expect(err).toHaveProperty('name', 'JsonotronDocumentFieldsValidationError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('validatorErrors', validatorErrors)
  expect(err).toHaveProperty('message', 'Validation failed for fields of document type \'my docType\'.\n' + JSON.stringify(validatorErrors, null, 2))
})

test('The filter params validation error is constructed correctly.', () => {
  const validatorErrors = [1, 2, 3]
  const err = new JsonotronFilterParamsValidationError('my docType', 'my filter', validatorErrors)
  expect(err).toHaveProperty('name', 'JsonotronFilterParamsValidationError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('filterName', 'my filter')
  expect(err).toHaveProperty('validatorErrors', validatorErrors)
  expect(err).toHaveProperty('message', 'Validation failed for params of filter \'my filter\' on document type \'my docType\'.\n' + JSON.stringify(validatorErrors, null, 2))
})

test('The merge patch validation error is constructed correctly.', () => {
  const validatorErrors = [1, 2, 3]
  const err = new JsonotronMergePatchValidationError('my docType', validatorErrors)
  expect(err).toHaveProperty('name', 'JsonotronMergePatchValidationError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('validatorErrors', validatorErrors)
  expect(err).toHaveProperty('message', 'Validation failed for merge-patch on document type \'my docType\'.\n' + JSON.stringify(validatorErrors, null, 2))
})

test('The document not found error is constructed correctly.', () => {
  const err = new JsonotronDocumentNotFoundError('my docType', '123')
  expect(err).toHaveProperty('name', 'JsonotronDocumentNotFoundError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('id', '123')
  expect(err).toHaveProperty('message', 'Document of type \'my docType\' with id \'123\' was not found in the document store.')
})

test('The operation params validation error is constructed correctly.', () => {
  const validatorErrors = [1, 2, 3]
  const err = new JsonotronOperationParamsValidationError('my docType', 'my operation', validatorErrors)
  expect(err).toHaveProperty('name', 'JsonotronOperationParamsValidationError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('operationName', 'my operation')
  expect(err).toHaveProperty('validatorErrors', validatorErrors)
  expect(err).toHaveProperty('message', 'Validation failed for params of operation \'my operation\' on document type \'my docType\'.\n' + JSON.stringify(validatorErrors, null, 2))
})

test('The enum value validation error is constructed correctly.', () => {
  const validatorErrors = [1, 2, 3]
  const err = new JsonotronEnumValueValidationError('my enumType', validatorErrors)
  expect(err).toHaveProperty('name', 'JsonotronEnumValueValidationError')
  expect(err).toHaveProperty('enumTypeName', 'my enumType')
  expect(err).toHaveProperty('validatorErrors', validatorErrors)
  expect(err).toHaveProperty('message', 'Validation failed for value of enum type \'my enumType\'.\n' + JSON.stringify(validatorErrors, null, 2))
})

test('The field value validation error is constructed correctly.', () => {
  const validatorErrors = [1, 2, 3]
  const err = new JsonotronFieldValueValidationError('my fieldType', validatorErrors)
  expect(err).toHaveProperty('name', 'JsonotronFieldValueValidationError')
  expect(err).toHaveProperty('fieldTypeName', 'my fieldType')
  expect(err).toHaveProperty('validatorErrors', validatorErrors)
  expect(err).toHaveProperty('message', 'Validation failed for value of field type \'my fieldType\'.\n' + JSON.stringify(validatorErrors, null, 2))
})

test('The insufficient permissions error is constructed correctly.', () => {
  const err = new JsonotronInsufficientPermissionsError(['roleA', 'roleB'], 'my docType', 'my action')
  expect(err).toHaveProperty('name', 'JsonotronInsufficientPermissionsError')
  expect(err).toHaveProperty('roleNames', ['roleA', 'roleB'])
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('action', 'my action')
  expect(err).toHaveProperty('message', 'None of the permissions in roles \'roleA, roleB\' support performing action \'my action\' on \'my docType\'.')
})

test('The invalid merge patch error is constructed correctly.', () => {
  const err = new JsonotronInvalidMergePatchError('my message.')
  expect(err).toHaveProperty('name', 'JsonotronInvalidMergePatchError')
  expect(err).toHaveProperty('message', 'Merge patch is invalid.\nmy message.')
})

test('The required version not available error is constructed correctly.', () => {
  const err = new JsonotronRequiredVersionNotAvailableError()
  expect(err).toHaveProperty('name', 'JsonotronRequiredVersionNotAvailableError')
  expect(err).toHaveProperty('message', 'Required version of document is not available in the doc store.')
})

test('The unrecognised calculated field name error is constructed correctly.', () => {
  const err = new JsonotronUnrecognisedCalculatedFieldNameError('my docType', 'my calc')
  expect(err).toHaveProperty('name', 'JsonotronUnrecognisedCalculatedFieldNameError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('calculatedFieldName', 'my calc')
  expect(err).toHaveProperty('message', 'Document type \'my docType\' does not define a calculated field named \'my calc\'.')
})

test('The unrecognised doc type name error is constructed correctly.', () => {
  const err = new JsonotronUnrecognisedDocTypeNameError('my docType')
  expect(err).toHaveProperty('name', 'JsonotronUnrecognisedDocTypeNameError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('message', 'A document type named \'my docType\' is not defined.')
})

test('The unrecognised field name error is constructed correctly.', () => {
  const err = new JsonotronUnrecognisedFieldNameError('my docType', 'my field')
  expect(err).toHaveProperty('name', 'JsonotronUnrecognisedFieldNameError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('fieldName', 'my field')
  expect(err).toHaveProperty('message', 'Document type \'my docType\' does not define a field named \'my field\'.')
})

test('The unrecognised filter name error is constructed correctly.', () => {
  const err = new JsonotronUnrecognisedFilterNameError('my docType', 'my filter')
  expect(err).toHaveProperty('name', 'JsonotronUnrecognisedFilterNameError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('filterName', 'my filter')
  expect(err).toHaveProperty('message', 'Document type \'my docType\' does not define a filter named \'my filter\'.')
})

test('The unrecognised operation name error is constructed correctly.', () => {
  const err = new JsonotronUnrecognisedOperationNameError('my docType', 'my operation')
  expect(err).toHaveProperty('name', 'JsonotronUnrecognisedOperationNameError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('operationName', 'my operation')
  expect(err).toHaveProperty('message', 'Document type \'my docType\' does not define an operation named \'my operation\'.')
})
