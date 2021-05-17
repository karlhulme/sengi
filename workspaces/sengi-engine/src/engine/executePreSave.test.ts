import { expect, test } from '@jest/globals'
import { DocBase, DocRecord, DocType, SengiPreSaveFailedError } from 'sengi-interfaces'
import { executePreSave } from './executePreSave'
import { asError } from './shared.test'

interface ExampleDoc extends DocBase {
  propA: string
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    preSave: (doc: ExampleDoc) => {
      if (doc.propA === 'fail') {
        throw new Error('fail')
      }

      doc.propA = doc.propA.toUpperCase()
    }
  }

  return docType
}

test('Executing a valid pre-save function raises no errors.', () => {
  const doc: DocRecord = { propA: 'abc' }
  expect(() => executePreSave(createDocType(), doc)).not.toThrow()
  expect(doc).toEqual({ propA: 'ABC' })
})

test('Executing a pre-save function on a doc type that does not define one raises no errors.', () => {
  const docType = createDocType()
  delete docType.preSave
  const doc: DocRecord = { propA: 'abc' }
  expect(() => executePreSave(docType, doc)).not.toThrow()
  expect(doc).toEqual({ propA: 'abc' })
})

test('Executing a pre-save function that raises errors will be wrapped.', () => {
  const doc: DocRecord = { propA: 'fail' }
  expect(() => executePreSave(createDocType(), doc)).toThrow(asError(SengiPreSaveFailedError))
  expect(() => executePreSave(createDocType(), doc)).toThrow(/Error: fail/)
})
