import { expect, test } from '@jest/globals'
import { DocType, SengiActionForbiddenByPolicyError } from 'sengi-interfaces'
import { ensureCanDeleteDocuments } from './ensureCanDeleteDocuments'
import { createFilmDocType } from './shared.test'

function createDocType (canDelete: boolean): DocType {
  const docType = createFilmDocType()
  docType.policy.canDeleteDocuments = canDelete
  return docType
}

test('Remain silent if policy allows action.', () => {
  expect(() => ensureCanDeleteDocuments(createDocType(true))).not.toThrow()
})

test('Raise error if policy disallows action.', () => {
  try {
    ensureCanDeleteDocuments(createDocType(false))
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiActionForbiddenByPolicyError)
    expect(err.message).toMatch(/delete document/)
  }
})
