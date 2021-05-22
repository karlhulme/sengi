import { test, expect } from '@jest/globals'
import { SengiExpressMalformedFilterParamsError } from '../errors'
import { ensureQueryFilterParams } from './ensureQueryFilterParams'

test('Raise an error for malformed JSON filter params.', () => {
  expect(() => ensureQueryFilterParams('{ malfored params }')).toThrow(SengiExpressMalformedFilterParamsError)
})

test('Return null for missing filter params.', () => {
  expect(ensureQueryFilterParams('')).toEqual(null)
  expect(ensureQueryFilterParams()).toEqual(null)
})

test('Return a filter params object.', () => {
  expect(ensureQueryFilterParams('"hello"')).toEqual('hello')
  expect(ensureQueryFilterParams('{"foo": "bar"}')).toEqual({ foo: 'bar' })
})
