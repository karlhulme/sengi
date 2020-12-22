import { test, expect } from '@jest/globals'
import { SengiExpressInvalidRequestId } from '../errors'
import { ensureHeaderRequestId } from './ensureHeaderRequestId'

test('Use the server request id if one is not supplied in the request.', () => {
  expect(ensureHeaderRequestId('1234')).toEqual('1234')
})

test('Use the supplied request id.', () => {
  expect(ensureHeaderRequestId('1234', '5678')).toEqual('5678')
})

test('Reject arrays of values.', () => {
  try {
    ensureHeaderRequestId('1234', ['5678', '6789'])
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiExpressInvalidRequestId)
  }
})
