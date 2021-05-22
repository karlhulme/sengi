import { test, expect } from '@jest/globals'
import { SengiExpressMalformedQueryNameError } from '../errors'
import { ensureQueryQueryName } from './ensureQueryQueryName'

test('Return the blank token for unrecognised query name definitions.', () => {
  expect(() => ensureQueryQueryName()).toThrow(SengiExpressMalformedQueryNameError)
  expect(() => ensureQueryQueryName([])).toThrow(SengiExpressMalformedQueryNameError)
  expect(() => ensureQueryQueryName({})).toThrow(SengiExpressMalformedQueryNameError)
})

test('Return a query name.', () => {
  expect(ensureQueryQueryName('one')).toEqual('one')
})
