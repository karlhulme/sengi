import { expect, test } from '@jest/globals'
import { getSafeDocTypeName } from './getSafeDocTypeName'

test('Replace dollar and percentage signs with underscores.', () => {
  expect(getSafeDocTypeName('hello$World%')).toEqual('hello_World_')
})
