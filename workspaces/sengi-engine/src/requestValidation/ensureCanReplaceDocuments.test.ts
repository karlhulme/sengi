import { expect, test } from '@jest/globals'
import { DocType, SengiActionForbiddenByPolicyError } from 'sengi-interfaces'
import { ensureCanReplaceDocuments } from './ensureCanReplaceDocuments'
import { createFilmDocType } from './shared.test'

function createDocType (canReplace: boolean): DocType {
  const docType = createFilmDocType()
  docType.policy.canReplaceDocuments = canReplace
  return docType
}

test('Remain silent if policy allows action.', () => {
  expect(() => ensureCanReplaceDocuments(createDocType(true))).not.toThrow()
})

test('Raise error if policy disallows action.', () => {
  try {
    ensureCanReplaceDocuments(createDocType(false))
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiActionForbiddenByPolicyError)
    expect(err.message).toMatch(/replace document/)
  }
})
