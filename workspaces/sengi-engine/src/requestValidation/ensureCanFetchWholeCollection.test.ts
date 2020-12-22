import { expect, test } from '@jest/globals'
import { DocType, SengiActionForbiddenByPolicyError } from 'sengi-interfaces'
import { ensureCanFetchWholeCollection } from './ensureCanFetchWholeCollection'
import { createFilmDocType } from './shared.test'

function createDocType (canFetchAll: boolean): DocType {
  const docType = createFilmDocType()
  docType.policy.canFetchWholeCollection = canFetchAll
  return docType
}

test('Remain silent if policy allows action.', () => {
  expect(() => ensureCanFetchWholeCollection(createDocType(true))).not.toThrow()
})

test('Raise error if policy disallows action.', () => {
  try {
    ensureCanFetchWholeCollection(createDocType(false))
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiActionForbiddenByPolicyError)
    expect(err.message).toMatch(/fetch whole collection/)
  }
})
