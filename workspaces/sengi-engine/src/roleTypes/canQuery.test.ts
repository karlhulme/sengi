import { expect, test } from '@jest/globals'
import { canQuery } from './canQuery'

test('Check permission set for query permission', () => {
  expect(canQuery({}, ['a', 'b'])).toEqual(false)
  expect(canQuery({ query: false }, ['a', 'b'])).toEqual(false)
  expect(canQuery({ query: true }, ['a', 'b'])).toEqual(true)
})

test('Check permission set for query permission against whitelist', () => {
  expect(canQuery({ query: { fields: ['a'], fieldsTreatment: 'include' } }, ['a', 'b'])).toEqual(false)
  expect(canQuery({ query: { fields: ['a', 'b'], fieldsTreatment: 'include' } }, ['a', 'b'])).toEqual(true)
})

test('Check permission set for query permission against blacklist', () => {
  expect(canQuery({ query: { fields: ['a'], fieldsTreatment: 'exclude' } }, ['a', 'b'])).toEqual(false)
  expect(canQuery({ query: { fields: ['a'], fieldsTreatment: 'exclude' } }, ['b'])).toEqual(true)
})

