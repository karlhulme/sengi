import { expect, test } from '@jest/globals'
import { DocPatch, DocType } from 'sengi-interfaces'
import { createCarDocType } from './shared.test'
import { trimInternalPatch } from './trimInternalPatch'

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

test('Declared and calculated fields will be retained on a patch and other fields removed.', () => {
  const patch: DocPatch = { id: '123', docType: 'car', docOps: [], docVersion: 'abcd', model: 'ford', engine: 'V8', time0to60: 10, unrecognised: 'value' }
  const reducedDoc = trimInternalPatch(createDocType(), patch)
  expect(reducedDoc).toHaveProperty('model')
  expect(reducedDoc).toHaveProperty('engine')
  expect(reducedDoc).toHaveProperty('time0to60')
  expect(reducedDoc).not.toHaveProperty('id')
  expect(reducedDoc).not.toHaveProperty('docType')
  expect(reducedDoc).not.toHaveProperty('docOps')
  expect(reducedDoc).not.toHaveProperty('docVersion')
  expect(reducedDoc).not.toHaveProperty('unrecognised')
})
