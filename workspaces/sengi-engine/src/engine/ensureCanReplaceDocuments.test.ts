import { expect, test } from '@jest/globals'
import { UnknownDocType, SengiActionForbiddenByPolicyError } from 'sengi-interfaces'
import { ensureCanReplaceDocuments } from './ensureCanReplaceDocuments'
import { asError } from './shared.test'

test('Remain silent if policy allows fetch whole collection action.', () => {
  const docType: UnknownDocType = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    policy: {
      canReplaceDocuments: true
    }
  }

  expect(() => ensureCanReplaceDocuments(docType)).not.toThrow()
})

test('Raise error if policy disallows fetch whole collection action.', () => {
  const docType: UnknownDocType = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    policy: {
      canReplaceDocuments: true
    }
  }

  expect(() => ensureCanReplaceDocuments(docType)).toThrow(asError(SengiActionForbiddenByPolicyError))
  expect(() => ensureCanReplaceDocuments(docType)).toThrow(/replace document/)
})
