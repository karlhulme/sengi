import Ajv from 'ajv'
import { expect, test } from '@jest/globals'
import { ensureUser } from './ensureUser'
import { asError } from '../utils'
import { SengiUserValidationFailedError } from 'sengi-interfaces'

test('Accept user of a valid shape .', () => {
  expect(ensureUser(new Ajv(), { type: 'number' }, 12)).toEqual(12)
})

test('Reject user of a invalid shape.', () => {
  expect(() => ensureUser(new Ajv(), { type: 'number' }, 'not-a-number')).toThrow(asError(SengiUserValidationFailedError))
})