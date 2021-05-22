import { test, expect } from '@jest/globals'
import { SengiExpressInvalidReqVersionError } from '../errors'
import { ensureHeaderReqVersion } from './ensureHeaderReqVersion'

test('Use the req version if one is supplied in the request.', () => {
  expect(ensureHeaderReqVersion('1234')).toEqual('1234')
})

test('Return undefined if req version not supplied.', () => {
  expect(ensureHeaderReqVersion()).toBeUndefined()
})

test('Reject unrecognised req version.', () => {
  try {
    ensureHeaderReqVersion(['1234', '5678'])
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiExpressInvalidReqVersionError)
  }
})
