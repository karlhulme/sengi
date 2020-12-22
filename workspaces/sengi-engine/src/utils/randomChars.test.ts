import { expect, test } from '@jest/globals'
import { randomChars } from './randomChars'

test('Random chars will return the requested number of characters.', () => {
  expect(randomChars(10)).toHaveLength(10)
  expect(randomChars(20)).toHaveLength(20)
})

test('Random chars will return different characters each time.', async () => {
  expect(randomChars(10)).not.toEqual(randomChars(10))
})
