import { expect, test } from '@jest/globals'
import { canDelete } from './canDelete'

test('Check permission set for delete permission', () => {
  expect(canDelete({})).toEqual(false)
  expect(canDelete({ delete: false })).toEqual(false)
  expect(canDelete({ delete: true })).toEqual(true)
})
