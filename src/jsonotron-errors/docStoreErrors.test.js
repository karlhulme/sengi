/* eslint-env jest */
import {
  JsonotronDocStoreError,
  JsonotronDocStoreFailureError,
  JsonotronDocStoreInvalidResponseError,
  JsonotronDocStoreMissingFunctionError,
  JsonotronDocStoreUnrecognisedErrorCodeError,
  JsonotronDocStoreUnrecognisedSuccessCodeError
} from './docStoreErrors'

test('The doc store error is constructed correctly.', () => {
  const err = new JsonotronDocStoreError('my function', 'my message')
  expect(err).toHaveProperty('name', 'JsonotronDocStoreError')
  expect(err).toHaveProperty('functionName', 'my function')
  expect(err).toHaveProperty('message', 'my message')
})

test('The doc store failure error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new JsonotronDocStoreFailureError('my function', innerErr)
  expect(err).toHaveProperty('name', 'JsonotronDocStoreFailureError')
  expect(err).toHaveProperty('functionName', 'my function')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'The document store implementation of \'my function\' raised an error.\nError: inner error.')
})

test('The doc store invalid response error is constructed correctly.', () => {
  const err = new JsonotronDocStoreInvalidResponseError('my function', 'my message.')
  expect(err).toHaveProperty('name', 'JsonotronDocStoreInvalidResponseError')
  expect(err).toHaveProperty('functionName', 'my function')
  expect(err).toHaveProperty('message', 'The document store function \'my function\' returned an invalid response.\nmy message.')
})

test('The doc store missing function error is constructed correctly.', () => {
  const err = new JsonotronDocStoreMissingFunctionError('my function')
  expect(err).toHaveProperty('name', 'JsonotronDocStoreMissingFunctionError')
  expect(err).toHaveProperty('functionName', 'my function')
  expect(err).toHaveProperty('message', 'The document store does not provide an implementation of \'my function\'.')
})

test('The doc store unrecognised error code error is constructed correctly.', () => {
  const err = new JsonotronDocStoreUnrecognisedErrorCodeError('my function', 'ERROR_ABC')
  expect(err).toHaveProperty('name', 'JsonotronDocStoreUnrecognisedErrorCodeError')
  expect(err).toHaveProperty('functionName', 'my function')
  expect(err).toHaveProperty('errorCode', 'ERROR_ABC')
  expect(err).toHaveProperty('message', 'The document store function \'my function\' returned an object with an unrecognised error code \'ERROR_ABC\'.')
})

test('The doc store unrecognised success code error is constructed correctly.', () => {
  const err = new JsonotronDocStoreUnrecognisedSuccessCodeError('my function', 'SUCCESS_ABC')
  expect(err).toHaveProperty('name', 'JsonotronDocStoreUnrecognisedSuccessCodeError')
  expect(err).toHaveProperty('functionName', 'my function')
  expect(err).toHaveProperty('successCode', 'SUCCESS_ABC')
  expect(err).toHaveProperty('message', 'The document store function \'my function\' returned an object with an unrecognised success code \'SUCCESS_ABC\'.')
})
