import { expect, test } from '@jest/globals'
import { UnknownDocType, SengiActionForbiddenByPolicyError } from 'sengi-interfaces'
import { ensureCanFetchWholeCollection } from './ensureCanFetchWholeCollection'
import { asError } from './shared.test'

test('Remain silent if policy allows fetch whole collection action.', () => {
  const docType: UnknownDocType = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    policy: {
      canFetchWholeCollection: true
    }
  }

  expect(() => ensureCanFetchWholeCollection(docType)).not.toThrow()
})

test('Raise error if policy disallows fetch whole collection action.', () => {
  const docType: UnknownDocType = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    policy: {
      canFetchWholeCollection: false
    }
  }

  expect(() => ensureCanFetchWholeCollection(docType)).toThrow(asError(SengiActionForbiddenByPolicyError))
  expect(() => ensureCanFetchWholeCollection(docType)).toThrow(/fetch whole collection/)
})

test('Raise error if policy not specified for fetch whole collection action.', () => {
  const docType: UnknownDocType = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {}
  }

  expect(() => ensureCanFetchWholeCollection(docType)).toThrow(asError(SengiActionForbiddenByPolicyError))
  expect(() => ensureCanFetchWholeCollection(docType)).toThrow(/fetch whole collection/)
})
