import { test, expect } from '@jest/globals'
import { ensureQueryOffset } from './ensureQueryOffset'

test('Convert a valid offset number.', () => {
  expect(ensureQueryOffset('10')).toEqual(10)
})

test('Ignore invalid offset values.', () => {
  expect(ensureQueryOffset('abc')).toBeUndefined()
  expect(ensureQueryOffset()).toBeUndefined()
  expect(ensureQueryOffset({})).toBeUndefined()
})
