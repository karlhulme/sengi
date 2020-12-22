import { expect, test } from '@jest/globals'
import { Doc, DocType } from 'sengi-interfaces'
import { createCarDocType } from './shared.test'
import { updateCalcsOnDocument } from './updateCalcsOnDocument'

function createDocType (): DocType {
  const docType = createCarDocType()

  docType.calculatedFields = {
    combined: {
      type: 'string',
      documentation: '',
      inputFields: ['propA', 'propB'],
      value: input => input.propA + ' ' + input.propB
    }
  }

  return docType
}

test('Calculated fields are added to the doc.', () => {
  const doc: Doc = { propA: 'hello', propB: 'world' }
  updateCalcsOnDocument(createDocType(), doc)
  expect(doc.combined).toEqual('hello world')
})

test('Calculated fields are updated on the doc.', () => {
  const doc: Doc = { propA: 'hello', propB: 'world', combined: 'old_value' }
  updateCalcsOnDocument(createDocType(), doc)
  expect(doc.combined).toEqual('hello world')
})
