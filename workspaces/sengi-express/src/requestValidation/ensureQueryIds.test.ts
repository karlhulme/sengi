import { test, expect } from '@jest/globals'
import { ensureQueryIds } from './ensureQueryIds'

test('Return an empty array for unrecognised field names definition.', () => {
  expect(ensureQueryIds()).toEqual([])
  expect(ensureQueryIds([])).toEqual([])
  expect(ensureQueryIds({})).toEqual([])
})

test('Return an array of field names for a string.', () => {
  expect(ensureQueryIds('1234')).toEqual(['1234'])
  expect(ensureQueryIds('1234, 56-78')).toEqual(['1234', '56-78'])
})
