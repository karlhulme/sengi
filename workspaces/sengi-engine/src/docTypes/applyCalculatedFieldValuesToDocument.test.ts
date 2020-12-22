import { expect, test } from '@jest/globals'
import { DocType } from 'sengi-interfaces'
import { applyCalculatedFieldValuesToDocument } from './applyCalculatedFieldValuesToDocument'
import { createCarDocType } from './shared.test'

function createDocType (): DocType {
  const docType = createCarDocType()

  docType.calculatedFields.combined = {
    type: 'string',
    inputFields: ['propA', 'propB'],
    value: input => input.propA + ' ' + input.propB,
    documentation: ''
  }

  return docType
}

test('Apply calculated values for known fields and ignore unknown ones.', () => {
  const doc = { propA: 'hello', propB: 'world' }
  applyCalculatedFieldValuesToDocument(createDocType(), doc, ['combined', 'unknown'])
  expect(doc).toEqual({ propA: 'hello', propB: 'world', combined: 'hello world' })
})
