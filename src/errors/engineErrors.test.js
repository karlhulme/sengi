/* eslint-env jest */
import {
  SengiEngineError,
  SengiCalculatedFieldFailedError,
  SengiCallbackError,
  SengiConstructorFailedError,
  SengiFilterFailedError,
  SengiInvalidOperationMergePatchError,
  SengiOperationFailedError,
  SengiOperationNonObjectResponseError,
  SengiPreSaveFailedError
} from './engineErrors'

test('The engine error is constructed correctly.', () => {
  const err = new SengiEngineError('my message')
  expect(err).toHaveProperty('name', 'SengiEngineError')
  expect(err).toHaveProperty('message', 'my message')
})

test('The calculated field failed error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new SengiCalculatedFieldFailedError('my doctype', 'my field', innerErr)
  expect(err).toHaveProperty('name', 'SengiCalculatedFieldFailedError')
  expect(err).toHaveProperty('docTypeName', 'my doctype')
  expect(err).toHaveProperty('fieldName', 'my field')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'Calculated field \'my field\' on document type \'my doctype\' raised an error.\nError: inner error.')
})

test('The callback error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new SengiCallbackError('my callback', innerErr)
  expect(err).toHaveProperty('name', 'SengiCallbackError')
  expect(err).toHaveProperty('callbackName', 'my callback')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'An error was thrown by the callback delegate for \'my callback\'\nError: inner error.')
})

test('The constructor failed error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new SengiConstructorFailedError('my docType', innerErr)
  expect(err).toHaveProperty('name', 'SengiConstructorFailedError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'Constructor on document type \'my docType\' raised an error.\nError: inner error.')
})

test('The filter failed error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new SengiFilterFailedError('my docType', 'my filter', innerErr)
  expect(err).toHaveProperty('name', 'SengiFilterFailedError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('filterName', 'my filter')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'Filter \'my filter\' on document type \'my docType\' raised an error.\nError: inner error.')
})

test('The invalid operation merge patch error is constructed correctly.', () => {
  const err = new SengiInvalidOperationMergePatchError('my docType', 'my operation', 'my message.')
  expect(err).toHaveProperty('name', 'SengiInvalidOperationMergePatchError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('operationName', 'my operation')
  expect(err).toHaveProperty('message', 'Merge patch returned from operation \'my operation\' on document type \'my docType\' is invalid.\nmy message.')
})

test('The operation failed error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new SengiOperationFailedError('my docType', 'my operation', innerErr)
  expect(err).toHaveProperty('name', 'SengiOperationFailedError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('operationName', 'my operation')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'Operation \'my operation\' on document type \'my docType\' raised an error.\nError: inner error.')
})

test('The operation non object response error is constructed correctly.', () => {
  const err = new SengiOperationNonObjectResponseError('my docType', 'my operation')
  expect(err).toHaveProperty('name', 'SengiOperationNonObjectResponseError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('operationName', 'my operation')
  expect(err).toHaveProperty('message', 'Operation \'my operation\' on document type \'my docType\' failed to return an object.')
})

test('The pre save failed error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new SengiPreSaveFailedError('my docType', innerErr)
  expect(err).toHaveProperty('name', 'SengiPreSaveFailedError')
  expect(err).toHaveProperty('docTypeName', 'my docType')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'Pre-save function on document type \'my docType\' raised an error.\nError: inner error.')
})
