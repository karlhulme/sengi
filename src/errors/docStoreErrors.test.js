/* eslint-env jest */
import {
  SengiDocStoreError,
  SengiDocStoreFailureError,
  SengiDocStoreInvalidResponseError,
  SengiDocStoreMissingFunctionError,
  SengiDocStoreUnrecognisedErrorCodeError,
  SengiDocStoreUnrecognisedSuccessCodeError
} from './docStoreErrors'

test('The doc store error is constructed correctly.', () => {
  const err = new SengiDocStoreError('my function', 'my message')
  expect(err).toHaveProperty('name', 'SengiDocStoreError')
  expect(err).toHaveProperty('functionName', 'my function')
  expect(err).toHaveProperty('message', 'my message')
})

test('The doc store failure error is constructed correctly.', () => {
  const innerErr = new Error('inner error.')
  const err = new SengiDocStoreFailureError('my function', innerErr)
  expect(err).toHaveProperty('name', 'SengiDocStoreFailureError')
  expect(err).toHaveProperty('functionName', 'my function')
  expect(err).toHaveProperty('innerErr', innerErr)
  expect(err).toHaveProperty('message', 'The document store implementation of \'my function\' raised an error.\nError: inner error.')
})

test('The doc store invalid response error is constructed correctly.', () => {
  const err = new SengiDocStoreInvalidResponseError('my function', 'my message.')
  expect(err).toHaveProperty('name', 'SengiDocStoreInvalidResponseError')
  expect(err).toHaveProperty('functionName', 'my function')
  expect(err).toHaveProperty('message', 'The document store function \'my function\' returned an invalid response.\nmy message.')
})

test('The doc store missing function error is constructed correctly.', () => {
  const err = new SengiDocStoreMissingFunctionError('my function')
  expect(err).toHaveProperty('name', 'SengiDocStoreMissingFunctionError')
  expect(err).toHaveProperty('functionName', 'my function')
  expect(err).toHaveProperty('message', 'The document store does not provide an implementation of \'my function\'.')
})

test('The doc store unrecognised error code error is constructed correctly.', () => {
  const err = new SengiDocStoreUnrecognisedErrorCodeError('my function', 'ERROR_ABC')
  expect(err).toHaveProperty('name', 'SengiDocStoreUnrecognisedErrorCodeError')
  expect(err).toHaveProperty('functionName', 'my function')
  expect(err).toHaveProperty('errorCode', 'ERROR_ABC')
  expect(err).toHaveProperty('message', 'The document store function \'my function\' returned an object with an unrecognised error code \'ERROR_ABC\'.')
})

test('The doc store unrecognised success code error is constructed correctly.', () => {
  const err = new SengiDocStoreUnrecognisedSuccessCodeError('my function', 'SUCCESS_ABC')
  expect(err).toHaveProperty('name', 'SengiDocStoreUnrecognisedSuccessCodeError')
  expect(err).toHaveProperty('functionName', 'my function')
  expect(err).toHaveProperty('successCode', 'SUCCESS_ABC')
  expect(err).toHaveProperty('message', 'The document store function \'my function\' returned an object with an unrecognised success code \'SUCCESS_ABC\'.')
})
