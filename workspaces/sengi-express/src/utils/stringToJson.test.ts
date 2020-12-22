import { test, expect } from '@jest/globals'
import { stringToJson } from './stringToJson'

test('Return a JSON object for a valid string.', () => {
  expect(stringToJson('{ "foo": 123 }')).toEqual({ foo: 123 })
})

test('Return an empty JSON object for an invalid string.', () => {
  expect(stringToJson('not a json string')).toEqual({})
})

test('Return an empty JSON object for an empty string.', () => {
  expect(stringToJson('')).toEqual({})
})

test('Return an empty JSON object for a non string.', () => {
  expect(stringToJson()).toEqual({})
})
