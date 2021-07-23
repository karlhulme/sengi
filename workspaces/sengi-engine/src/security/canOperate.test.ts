import { expect, test } from '@jest/globals'
import { canOperate } from './canOperate'

test('Check permission set for operate permission', () => {
  expect(canOperate({}, 'someOp')).toEqual(false)
  expect(canOperate({ update: false }, 'someOp')).toEqual(false)
  expect(canOperate({ update: true }, 'someOp')).toEqual(true)
  expect(canOperate({ update: { operations: [] } }, 'someOp')).toEqual(false)
  expect(canOperate({ update: { operations: ['someOp'] } }, 'someOp')).toEqual(true)
})
