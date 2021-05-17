import { expect, test } from '@jest/globals'
import { canSelect } from './canSelect'

test('Check permission set for select permission', () => {
  expect(canSelect({}, ['a', 'b'])).toEqual(false)
  expect(canSelect({ select: false }, ['a', 'b'])).toEqual(false)
  expect(canSelect({ select: true }, ['a', 'b'])).toEqual(true)
})

test('Check permission set for select permission against whitelist', () => {
  expect(canSelect({ select: { fields: ['a'], fieldsTreatment: 'include' } }, ['a', 'b'])).toEqual(false)
  expect(canSelect({ select: { fields: ['a', 'b'], fieldsTreatment: 'include' } }, ['a', 'b'])).toEqual(true)
})

test('Check permission set for select permission against blacklist', () => {
  expect(canSelect({ select: { fields: ['a'], fieldsTreatment: 'exclude' } }, ['a', 'b'])).toEqual(false)
  expect(canSelect({ select: { fields: ['a'], fieldsTreatment: 'exclude' } }, ['b'])).toEqual(true)
})
