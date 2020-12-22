import { test, expect } from '@jest/globals'
import { ensureDocIdConsistency } from './ensureDocIdConsistency'
import { SengiExpressMismatchedIdsError } from '../errors'

test('Consistent ids are accepted.', () => {
  expect(() => ensureDocIdConsistency('a', 'a')).not.toThrow()
})

test('Undefined ids are not accepted.', () => {
  try {
    ensureDocIdConsistency(undefined, undefined)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiExpressMismatchedIdsError)
  }
})

test('An error is raised for inconsistent ids.', () => {
  try {
    ensureDocIdConsistency('a', 'b')
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiExpressMismatchedIdsError)
  }
})

test('An error is raised for partially missing ids', () => {
  try {
    ensureDocIdConsistency(undefined, 'b')
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiExpressMismatchedIdsError)
  }
})
