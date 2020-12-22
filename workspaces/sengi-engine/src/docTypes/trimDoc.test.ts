import { expect, test } from '@jest/globals'
import { Doc, DocType } from 'sengi-interfaces'
import { createCarDocType } from './shared.test'
import { trimDoc } from './trimDoc'

function createDocType (): DocType {
  const docType = createCarDocType()

  docType.fields = {
    model: { type: 'shortString', isRequired: true, canUpdate: true, documentation: '' },
    engine: { type: 'shortString', documentation: '', default: 'Unrated' }
  }

  docType.calculatedFields = {
    time0to60: { type: 'positiveInteger', documentation: '', inputFields: [], value: () => 5 }
  }

  return docType
}

test('Unrecognised fields will be trimmed from the document but system, declared field and calculated fields will be retained.', () => {
  const doc: Doc = { id: '123', docType: 'car', docOps: [], docVersion: 'abcd', model: 'ford', engine: 'V8', time0to60: 10, unrecognised: 'value' }
  const reducedDoc = trimDoc(createDocType(), doc)
  expect(reducedDoc).toHaveProperty('id')
  expect(reducedDoc).toHaveProperty('docType')
  expect(reducedDoc).toHaveProperty('docOps')
  expect(reducedDoc).toHaveProperty('docVersion')
  expect(reducedDoc).toHaveProperty('model')
  expect(reducedDoc).toHaveProperty('engine')
  expect(reducedDoc).toHaveProperty('time0to60')
  expect(reducedDoc).not.toHaveProperty('unrecognised')
})
