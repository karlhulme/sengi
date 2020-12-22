import { expect, test } from '@jest/globals'
import { SengiDocNotFoundError } from 'sengi-interfaces'
import { ensureDocWasFound } from './ensureDocWasFound'

test('A found doc should not raise an error.', () => {
  expect(ensureDocWasFound('test', '123', {})).toEqual({})
})

test('A doc that was not found should raise an error.', () => {
  try {
    ensureDocWasFound('test', '123', null)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiDocNotFoundError)
    expect(err.message).toMatch(/not found/)
  }
})
