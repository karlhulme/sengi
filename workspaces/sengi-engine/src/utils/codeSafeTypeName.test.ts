import { expect, test } from '@jest/globals'
import { codeSafeTypeName } from './codeSafeTypeName'

test('Code safe version of type names.', () => {
  expect(codeSafeTypeName('hello')).toEqual('hello')
  expect(codeSafeTypeName('hello.world')).toEqual('world')
  expect(codeSafeTypeName('')).toEqual('')
})

