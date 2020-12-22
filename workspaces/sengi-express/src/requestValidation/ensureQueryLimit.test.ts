import { test, expect } from '@jest/globals'
import { ensureQueryLimit } from './ensureQueryLimit'

test('Convert a valid limit number.', () => {
  expect(ensureQueryLimit('10')).toEqual(10)
})

test('Ignore invalid limit values.', () => {
  expect(ensureQueryLimit('abc')).toBeUndefined()
  expect(ensureQueryLimit()).toBeUndefined()
  expect(ensureQueryLimit({})).toBeUndefined()
})
