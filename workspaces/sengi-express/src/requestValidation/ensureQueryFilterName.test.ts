import { test, expect } from '@jest/globals'
import { SengiExpressMalformedFilterNameError } from '../errors'
import { ensureQueryFilterName } from './ensureQueryFilterName'

test('Return the blank token for unrecognised filter name definitions.', () => {
  expect(() => ensureQueryFilterName()).toThrow(SengiExpressMalformedFilterNameError)
  expect(() => ensureQueryFilterName([])).toThrow(SengiExpressMalformedFilterNameError)
  expect(() => ensureQueryFilterName({})).toThrow(SengiExpressMalformedFilterNameError)
})

test('Return a filter name.', () => {
  expect(ensureQueryFilterName('one')).toEqual('one')
})
