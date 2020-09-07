/* eslint-env jest */
import { SengiDocumentNotFoundError } from '../errors'
import { ensureDocWasFound } from './ensureDocWasFound'

test('A found doc should not raise an error.', () => {
  expect(() => ensureDocWasFound('test', '123', {})).not.toThrow()
})

test('A doc that was not found should raise an error.', () => {
  expect(() => ensureDocWasFound('test', '123', null)).toThrow(SengiDocumentNotFoundError)
  expect(() => ensureDocWasFound('test', '123', null)).toThrow(/not found/)
  expect(() => ensureDocWasFound('test', '123', null)).toThrow(/123/)
  expect(() => ensureDocWasFound('test', '123', 'invalid')).toThrow(SengiDocumentNotFoundError)
  expect(() => ensureDocWasFound('test', '123', 911)).toThrow(SengiDocumentNotFoundError)
  expect(() => ensureDocWasFound('test', '123', true)).toThrow(SengiDocumentNotFoundError)
})
