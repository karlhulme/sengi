/* eslint-env jest */
import {
  SengiRequestError,
  SengiActionForbiddenByPolicyError,
  SengiConflictOnSaveError,
  SengiDocumentCustomValidationError,
  SengiDocumentNotFoundError,
  SengiInsufficientPermissionsError,
  SengiInvalidMergePatchError,
  SengiRequiredVersionNotAvailableError,
  SengiUnrecognisedDocTypeNameError,
  SengiUnrecognisedEnumTypeNameError,
  SengiUnrecognisedFieldNameError,
  SengiUnrecognisedFilterNameError,
  SengiUnrecognisedOperationNameError
} from './requestErrors'

test('The request error is constructed correctly.', () => {
  const err = new SengiRequestError('my message')
  expect(err).toHaveProperty('name', 'SengiRequestError')
  expect(err).toHaveProperty('message', 'my message')
})

test('The action forbidden by policy error is constructed correctly.', () => {
  const err = new SengiActionForbiddenByPolicyError('my docType', 'my action')
  expect(err).toHaveProperty('name', 'SengiActionForbiddenByPolicyError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('action', 'my action')
  expect(err).toHaveProperty('message', 'Access policy for \'my docType\' forbids the action \'my action\'.')
})

test('The conflict on save error is constructed correctly.', () => {
  const err = new SengiConflictOnSaveError()
  expect(err).toHaveProperty('name', 'SengiConflictOnSaveError')
  expect(err).toHaveProperty('message', 'Document could not be updated as it was changed by another process during the operation.')
})

test('The document custom validation error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new SengiDocumentCustomValidationError('my docType', innerErr)
  expect(err).toHaveProperty('name', 'SengiDocumentCustomValidationError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'Document did not pass custom validation defined for document type \'my docType\'.\nError: inner error.')
})

test('The document not found error is constructed correctly.', () => {
  const err = new SengiDocumentNotFoundError('my docType', '123')
  expect(err).toHaveProperty('name', 'SengiDocumentNotFoundError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('id', '123')
  expect(err).toHaveProperty('message', 'Document of type \'my docType\' with id \'123\' was not found in the document store.')
})

test('The insufficient permissions error is constructed correctly.', () => {
  const err = new SengiInsufficientPermissionsError(['roleA', 'roleB'], 'my docType', 'my action')
  expect(err).toHaveProperty('name', 'SengiInsufficientPermissionsError')
  expect(err).toHaveProperty('roleNames', ['roleA', 'roleB'])
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('action', 'my action')
  expect(err).toHaveProperty('message', 'None of the permissions in roles \'roleA, roleB\' support performing action \'my action\' on \'my docType\'.')
})

test('The invalid merge patch error is constructed correctly.', () => {
  const err = new SengiInvalidMergePatchError('my message.')
  expect(err).toHaveProperty('name', 'SengiInvalidMergePatchError')
  expect(err).toHaveProperty('message', 'Merge patch is invalid.\nmy message.')
})

test('The required version not available error is constructed correctly.', () => {
  const err = new SengiRequiredVersionNotAvailableError()
  expect(err).toHaveProperty('name', 'SengiRequiredVersionNotAvailableError')
  expect(err).toHaveProperty('message', 'Required version of document is not available in the doc store.')
})

test('The unrecognised doc type name error is constructed correctly.', () => {
  const err = new SengiUnrecognisedDocTypeNameError('my docType')
  expect(err).toHaveProperty('name', 'SengiUnrecognisedDocTypeNameError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('message', 'A document type named \'my docType\' is not defined.')
})

test('The unrecognised enum type name error is constructed correctly.', () => {
  const err = new SengiUnrecognisedEnumTypeNameError('my enumType')
  expect(err).toHaveProperty('name', 'SengiUnrecognisedEnumTypeNameError')
  expect(err).toHaveProperty('enumTypeName', 'my enumType')
  expect(err).toHaveProperty('message', 'An enum type named \'my enumType\' is not defined.')
})

test('The unrecognised field name error is constructed correctly.', () => {
  const err = new SengiUnrecognisedFieldNameError('my docType', 'my field')
  expect(err).toHaveProperty('name', 'SengiUnrecognisedFieldNameError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('fieldName', 'my field')
  expect(err).toHaveProperty('message', 'Document type \'my docType\' does not define a field named \'my field\'.')
})

test('The unrecognised filter name error is constructed correctly.', () => {
  const err = new SengiUnrecognisedFilterNameError('my docType', 'my filter')
  expect(err).toHaveProperty('name', 'SengiUnrecognisedFilterNameError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('filterName', 'my filter')
  expect(err).toHaveProperty('message', 'Document type \'my docType\' does not define a filter named \'my filter\'.')
})

test('The unrecognised operation name error is constructed correctly.', () => {
  const err = new SengiUnrecognisedOperationNameError('my docType', 'my operation')
  expect(err).toHaveProperty('name', 'SengiUnrecognisedOperationNameError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('operationName', 'my operation')
  expect(err).toHaveProperty('message', 'Document type \'my docType\' does not define an operation named \'my operation\'.')
})
