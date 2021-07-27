import { expect, test } from '@jest/globals'
import { DocBase, DocType, SengiAuthorisationFailedError } from 'sengi-interfaces'
import { ensureDocTypeRequestAuthorised } from './ensureDocTypeRequestAuthorised'
import { asError } from '../utils'

interface ExampleDoc extends DocBase {
  propA: string
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, unknown, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    authorise: props => {
      if (props.fieldNames.includes('private')) {
        return 'AuthFailed'
      }
    }
  }

  return docType
}

test('Accept valid auth request.', () => {
  expect(() => ensureDocTypeRequestAuthorised(createDocType(), {
    user: {},
    fieldNames: ['a', 'b', 'c'],
    isRead: true,
    isWrite: true,
    requestType: 'replace'
  })).not.toThrow()
})

test('Reject invalid auth request.', () => {
  expect(() => ensureDocTypeRequestAuthorised(createDocType(), {
    user: {},
    fieldNames: ['a', 'b', 'c', 'private'],
    isRead: true,
    isWrite: true,
    requestType: 'replace'
  })).toThrow(asError(SengiAuthorisationFailedError))
})

test('Skip auth request if there is no authorisation method.', () => {
  const docType = createDocType()
  delete docType.authorise
  expect(() => ensureDocTypeRequestAuthorised(docType, {
    user: {},
    fieldNames: ['a', 'b', 'c', 'private'],
    isRead: true,
    isWrite: true,
    requestType: 'replace'
  })).not.toThrow()
})
