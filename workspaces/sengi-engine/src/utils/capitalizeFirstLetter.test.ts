import { expect, test } from '@jest/globals'
import { capitalizeFirstLetter } from './capitalizeFirstLetter'

test('First letter of a string can be capitalised.', () => {
  expect(capitalizeFirstLetter('hello')).toEqual('Hello')
  expect(capitalizeFirstLetter('h')).toEqual('H')
  expect(capitalizeFirstLetter('')).toEqual('')
})

