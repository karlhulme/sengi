import { expect, test } from '@jest/globals'
import { UnknownDocType, SengiActionForbiddenByPolicyError } from 'sengi-interfaces'
import { ensureCanReplaceDocuments } from './ensureCanReplaceDocuments'
import { asError } from '../utils'

test('Remain silent if policy allows replace document action.', () => {
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

test('Raise error if policy disallows replace document action.', () => {
  const docType: UnknownDocType = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    policy: {
      canReplaceDocuments: false
    }
  }

  expect(() => ensureCanReplaceDocuments(docType)).toThrow(asError(SengiActionForbiddenByPolicyError))
  expect(() => ensureCanReplaceDocuments(docType)).toThrow(/replace document/)
})

test('Raise error if policy not specified for replace document action.', () => {
  const docType: UnknownDocType = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {}
  }

  expect(() => ensureCanReplaceDocuments(docType)).toThrow(asError(SengiActionForbiddenByPolicyError))
  expect(() => ensureCanReplaceDocuments(docType)).toThrow(/replace document/)
})
