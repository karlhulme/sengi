import { expect, test } from '@jest/globals'
import { SengiNewDocIdMismatch } from 'sengi-interfaces'
import { ensureNewDocIdsMatch } from './ensureNewDocIdsMatch'

test('A doc with no id property does not conflict with request id.', () => {
  expect(() => ensureNewDocIdsMatch('1234')).not.toThrow()
})

test('A doc with an id property that matches the request id is accepted.', () => {
  expect(() => ensureNewDocIdsMatch('1234', '1234')).not.toThrow()
})

test('A doc with an id property that conflicts with the request id raises an error.', () => {
  try {
    ensureNewDocIdsMatch('1234', '5678')
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiNewDocIdMismatch)
  }
})
