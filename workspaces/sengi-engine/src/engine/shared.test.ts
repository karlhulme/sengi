import Ajv from 'ajv'
import { expect, test } from '@jest/globals'

/**
 * Returns a validator.
 */
export function createValidator (): Ajv {
  return new Ajv()
}

/**
 * Forcibly converts the object to an Error type which works around a bug
 * where Typescript does not recognise custom errors.
 * @param errType Any error type.
 */
 export function asError (errType: unknown): Error {
  return errType as Error
} 

test('Prevent warnings about no tests found in file.', () => {
  expect(typeof asError).toEqual('function')
})
