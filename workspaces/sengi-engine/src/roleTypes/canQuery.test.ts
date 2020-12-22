import { expect, test } from '@jest/globals'
import { canQuery } from './canQuery'

test('Check permission set for query permission', () => {
  expect(canQuery({}, ['a', 'b'])).toEqual(false)
  expect(canQuery({ query: false }, ['a', 'b'])).toEqual(false)
  expect(canQuery({ query: true }, ['a', 'b'])).toEqual(true)
})

test('Check permission set for query permission against whitelist', () => {
  expect(canQuery({ query: { fields: ['a'], fieldsTreatment: 'whitelist' } }, ['a', 'b'])).toEqual(false)
  expect(canQuery({ query: { fields: ['a', 'b'], fieldsTreatment: 'whitelist' } }, ['a', 'b'])).toEqual(true)
})

test('Check permission set for query permission against blacklist', () => {
  expect(canQuery({ query: { fields: ['a'], fieldsTreatment: 'blacklist' } }, ['a', 'b'])).toEqual(false)
  expect(canQuery({ query: { fields: ['a'], fieldsTreatment: 'blacklist' } }, ['b'])).toEqual(true)
})

