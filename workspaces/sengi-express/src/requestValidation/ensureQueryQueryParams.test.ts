import { test, expect } from '@jest/globals'
import { SengiExpressMalformedQueryParamsError } from '../errors'
import { ensureQueryQueryParams } from './ensureQueryQueryParams'

test('Raise an error for malformed JSON filter params.', () => {
  expect(() => ensureQueryQueryParams('{ malfored params }')).toThrow(SengiExpressMalformedQueryParamsError)
})

test('Return null for missing query params.', () => {
  expect(ensureQueryQueryParams('')).toEqual(null)
  expect(ensureQueryQueryParams()).toEqual(null)
})

test('Return a query params object.', () => {
  expect(ensureQueryQueryParams('"hello"')).toEqual('hello')
  expect(ensureQueryQueryParams('{"foo": "bar"}')).toEqual({ foo: 'bar' })
})
