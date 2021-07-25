import { expect, test } from '@jest/globals'
import { DocBase, DocRecord, DocType, SengiPreSaveFailedError } from 'sengi-interfaces'
import { asError } from '../utils'
import { executePreSave } from './executePreSave'

interface ExampleDoc extends DocBase {
  propA: string
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, unknown, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    preSave: props => {
      if (props.doc.propA === 'fail') {
        throw new Error('fail')
      }

      props.doc.propA = props.doc.propA.toUpperCase()
    }
  }

  return docType
}

test('Executing a valid pre-save function raises no errors.', () => {
  const doc: DocRecord = { propA: 'abc' }
  expect(() => executePreSave(createDocType(), doc, null)).not.toThrow()
  expect(doc).toEqual({ propA: 'ABC' })
})

test('Executing a pre-save function on a doc type that does not define one raises no errors.', () => {
  const docType = createDocType()
  delete docType.preSave
  const doc: DocRecord = { propA: 'abc' }
  expect(() => executePreSave(docType, doc, null)).not.toThrow()
  expect(doc).toEqual({ propA: 'abc' })
})

test('Executing a pre-save function that raises errors will be wrapped.', () => {
  const doc: DocRecord = { propA: 'fail' }
  expect(() => executePreSave(createDocType(), doc, null)).toThrow(asError(SengiPreSaveFailedError))
  expect(() => executePreSave(createDocType(), doc, null)).toThrow(/Error: fail/)
})
