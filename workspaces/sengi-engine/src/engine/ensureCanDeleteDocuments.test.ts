import { expect, test } from '@jest/globals'
import { SengiActionForbiddenByPolicyError, UnknownDocType } from 'sengi-interfaces'
import { ensureCanDeleteDocuments } from './ensureCanDeleteDocuments'
import { asError } from './shared.test'

test('Remain silent if policy allows delete action.', () => {
  const docType: UnknownDocType = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    policy: {
      canDeleteDocuments: true
    }
  }

  expect(() => ensureCanDeleteDocuments(docType)).not.toThrow()
})

test('Raise error if policy disallows delete action.', () => {
  const docType: UnknownDocType = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    policy: {
      canDeleteDocuments: true
    }
  }

  expect(() => ensureCanDeleteDocuments(docType)).toThrow(asError(SengiActionForbiddenByPolicyError))
  expect(() => ensureCanDeleteDocuments(docType)).toThrow(/delete document/)
})
