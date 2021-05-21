import Ajv from 'ajv'
import { expect, test } from '@jest/globals'

/**
 * Returns a validator.
 */
export function createValidator (): Ajv {
  return new Ajv()
}

test('Prevent warnings about no tests found in file.', () => {
  expect(typeof createValidator).toEqual('function')
})
