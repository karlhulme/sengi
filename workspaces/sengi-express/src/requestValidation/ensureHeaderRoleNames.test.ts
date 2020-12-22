import { test, expect } from '@jest/globals'
import { ensureHeaderRoleNames } from './ensureHeaderRoleNames'

test('Accept valid role names as a CSV string.', () => {
  expect(ensureHeaderRoleNames('admin')).toEqual(['admin'])
  expect(ensureHeaderRoleNames('guest, service')).toEqual(['guest', 'service'])
})

test('Reject undefined role names.', () => {
  expect(() => ensureHeaderRoleNames()).toThrow()
})

test('Reject array of role names.', () => {
  expect(() => ensureHeaderRoleNames([])).toThrow()
  expect(() => ensureHeaderRoleNames(['admin'])).toThrow()
  expect(() => ensureHeaderRoleNames(['admin', 'guest'])).toThrow()
})

test('Reject empty role names.', () => {
  expect(() => ensureHeaderRoleNames('')).toThrow()
})
