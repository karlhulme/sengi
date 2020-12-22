import { test, expect } from '@jest/globals'
import { ensureQueryFilterName } from './ensureQueryFilterName'

test('Return an empty string for unrecognised filter name definitions.', () => {
  expect(ensureQueryFilterName()).toEqual('')
  expect(ensureQueryFilterName([])).toEqual('')
  expect(ensureQueryFilterName({})).toEqual('')
})

test('Return a filter name.', () => {
  expect(ensureQueryFilterName('one')).toEqual('one')
})
