import { test, expect } from '@jest/globals'
import { ensureQueryFieldNames } from './ensureQueryFieldNames'

test('Return an empty array for unrecognised field names definition.', () => {
  expect(ensureQueryFieldNames()).toEqual([])
  expect(ensureQueryFieldNames([])).toEqual([])
  expect(ensureQueryFieldNames({})).toEqual([])
})

test('Return an array of field names for a string.', () => {
  expect(ensureQueryFieldNames('one')).toEqual(['one'])
  expect(ensureQueryFieldNames('one, two')).toEqual(['one', 'two'])
})
