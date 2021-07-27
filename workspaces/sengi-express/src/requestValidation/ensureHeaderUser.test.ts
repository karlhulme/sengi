import { test, expect } from '@jest/globals'
import { SengiExpressMalformedUserError, SengiExpressMissingUserError } from '../errors'
import { ensureHeaderUser } from './ensureHeaderUser'

test('Extracts the user supplied with the request.', () => {
  expect(ensureHeaderUser('{ "userId": 1234 }')).toEqual({ userId: 1234 })
})


test('Raise error if user is a json object.', () => {
  try {
    ensureHeaderUser('not-a-json-object')
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiExpressMalformedUserError)
  }
})

test('Raise error if user not supplied.', () => {
  try {
    ensureHeaderUser()
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiExpressMissingUserError)
  }
})
