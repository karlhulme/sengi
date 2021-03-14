import { expect, test } from '@jest/globals'
import { capitaliseFirstLetter } from './capitaliseFirstLetter'

test('Capitalise the first letter of a string.', () => {
  expect(capitaliseFirstLetter('helloWorld')).toEqual('HelloWorld')
})

test('Convert underfined to an empty string.', () => {
  expect(capitaliseFirstLetter(undefined)).toEqual('')
})
