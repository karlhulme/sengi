import { test, expect } from '@jest/globals'
import { ensureQueryFilterParams } from './ensureQueryFilterParams'

test('Return an empty object for unrecognised filter params definitions.', () => {
  expect(ensureQueryFilterParams()).toEqual({})
  expect(ensureQueryFilterParams([])).toEqual({})
  expect(ensureQueryFilterParams('hello')).toEqual({})
  expect(ensureQueryFilterParams(123)).toEqual({})
})

test('Return a filter params object.', () => {
  expect(ensureQueryFilterParams('{"foo": "bar"}')).toEqual({ foo: 'bar' })
})
