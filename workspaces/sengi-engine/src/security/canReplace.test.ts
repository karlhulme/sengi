import { expect, test } from '@jest/globals'
import { canReplace } from './canReplace'

test('Check permission set for replace permission', () => {
  expect(canReplace({})).toEqual(false)
  expect(canReplace({ replace: false })).toEqual(false)
  expect(canReplace({ replace: true })).toEqual(true)
})
