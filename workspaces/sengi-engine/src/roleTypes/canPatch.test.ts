import { expect, test } from '@jest/globals'
import { canPatch } from './canPatch'

test('Check permission set for patch permission', () => {
  expect(canPatch({})).toEqual(false)
  expect(canPatch({ update: false })).toEqual(false)
  expect(canPatch({ update: true })).toEqual(true)
  expect(canPatch({ update: { patch: false, operations: [] } })).toEqual(false)
  expect(canPatch({ update: { patch: true, operations: [] } })).toEqual(true)
})
