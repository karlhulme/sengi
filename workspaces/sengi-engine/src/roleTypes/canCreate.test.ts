import { expect, test } from '@jest/globals'
import { canCreate } from './canCreate'

test('Check permission set for create permission', () => {
  expect(canCreate({})).toEqual(false)
  expect(canCreate({ create: false })).toEqual(false)
  expect(canCreate({ create: true })).toEqual(true)
})
