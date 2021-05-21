import { expect, test } from '@jest/globals'
import { UnknownDocType, SengiDocValidationFailedError } from 'sengi-interfaces'
import { createValidator } from './shared.test'
import { ensureDoc } from './ensureDoc'
import { asError } from '../utils'

function createDocType () {
  const docType: UnknownDocType = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        docType: { type: 'string' },
        docVersion: { type: 'string' },
        docOpIds: { type: 'array' },
        propA: { type: 'string' }
      }
    }
  }

  return docType
}

test('Valid docs are accepted.', () => {
  expect(() => ensureDoc(createValidator(), createDocType(), { id: '1234', docType: 'test', docVersion: 'aaaa', docOpIds: [], propA: 'abc' })).not.toThrow()
})

test('Invalid docs are rejected.', () => {
  expect(() => ensureDoc(createValidator(), createDocType(), { id: '1234', docType: 'test', docVersion: 'aaaa', docOpIds: [], propA: 123 })).toThrow(asError(SengiDocValidationFailedError))
})
