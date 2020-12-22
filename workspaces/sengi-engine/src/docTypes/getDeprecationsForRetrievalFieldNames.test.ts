import { expect, test } from '@jest/globals'
import { DocType } from 'sengi-interfaces'
import { getDeprecationsForRetrievalFieldNames } from './getDeprecationsForRetrievalFieldNames'
import { createCarDocType } from './shared.test'

function createDocType (): DocType {
  const docType = createCarDocType()

  docType.fields = {
    height: { type: 'string', documentation: '' },
    weight: { type: 'string', documentation: '', deprecation: 'reason1' },
    age: { type: 'string', documentation: '', deprecation: 'reason2' },
    eyeColor: { type: 'string', documentation: '' }
  }

  return docType
}

test('Retrieve deprecations for retrieval fields.', () => {
  expect(getDeprecationsForRetrievalFieldNames(createDocType(), ['id', 'height', 'weight'])).toEqual({ weight: { reason: 'reason1' } })
  expect(getDeprecationsForRetrievalFieldNames(createDocType(), ['docType', 'age', 'eyeColor'])).toEqual({ age: { reason: 'reason2' } })
  expect(getDeprecationsForRetrievalFieldNames(createDocType(), ['sys', 'height', 'eyeColor'])).toEqual({})
  expect(getDeprecationsForRetrievalFieldNames(createDocType(), ['docVersion', 'weight', 'age'])).toEqual({ age: { reason: 'reason2' }, weight: { reason: 'reason1' } })
})
