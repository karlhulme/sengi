/* eslint-env jest */
import { JsonotronDocumentNotFoundError } from '../jsonotron-errors'
import { ensureDocWasFound } from './ensureDocWasFound'

test('A found doc should not raise an error.', () => {
  expect(() => ensureDocWasFound('test', '123', {})).not.toThrow()
})

test('A doc that was not found should raise an error.', () => {
  expect(() => ensureDocWasFound('test', '123', null)).toThrow(JsonotronDocumentNotFoundError)
  expect(() => ensureDocWasFound('test', '123', null)).toThrow(/not found/)
  expect(() => ensureDocWasFound('test', '123', null)).toThrow(/123/)
  expect(() => ensureDocWasFound('test', '123', 'invalid')).toThrow(JsonotronDocumentNotFoundError)
  expect(() => ensureDocWasFound('test', '123', 911)).toThrow(JsonotronDocumentNotFoundError)
  expect(() => ensureDocWasFound('test', '123', true)).toThrow(JsonotronDocumentNotFoundError)
})
