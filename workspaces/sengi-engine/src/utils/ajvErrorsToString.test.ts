import { expect, test } from '@jest/globals'
import { ajvErrorsToString } from './ajvErrorsToString'

test('A null can be handled by ajvErrorsToString.', () => {
  expect(ajvErrorsToString(null)).toEqual('null')
})

test('An empty array can be handled by ajvErrorsToString.', () => {
  expect(ajvErrorsToString([])).toEqual('[]')
})
