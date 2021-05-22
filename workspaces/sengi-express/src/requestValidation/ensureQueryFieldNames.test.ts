import { test, expect } from '@jest/globals'
import { ensureQueryFieldNames } from './ensureQueryFieldNames'

test('Return just id field for unrecognised field names.', () => {
  expect(ensureQueryFieldNames()).toEqual(['id'])
  expect(ensureQueryFieldNames([])).toEqual(['id'])
  expect(ensureQueryFieldNames({})).toEqual(['id'])
})

test('Return an array of field names for a string.', () => {
  expect(ensureQueryFieldNames('one')).toEqual(['one'])
  expect(ensureQueryFieldNames('  one, two  ')).toEqual(['one', 'two'])
})
