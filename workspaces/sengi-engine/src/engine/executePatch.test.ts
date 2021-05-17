import { expect, test } from '@jest/globals'
import { DocBase, DocRecord, DocType, SengiPatchValidationFailedError } from 'sengi-interfaces'
import { executePatch } from './executePatch'
import { asError } from './shared.test'

interface ExampleDoc extends DocBase {
  propA: string
  propB: string
  propC?: string
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    readonlyFieldNames: ['propB']
  }

  return docType
}

test('A valid patch that changes a value is applied.', () => {
  const doc: DocRecord = { id: '123', propA: 'aaa',  propB: 'bbb' }
  executePatch(createDocType(), doc, { propA: 'AAA' })
  expect(doc).toEqual({ id: '123', propA: 'AAA',  propB: 'bbb' })
})

test('A valid patch that removes a value is applied.', () => {
  const doc: DocRecord = { id: '123', propA: 'aaa',  propB: 'bbb', propC: 'ccc' }
  executePatch(createDocType(), doc, { propC: null })
  expect(doc).toEqual({ id: '123', propA: 'aaa',  propB: 'bbb' })
})

test('A valid patch on a doc type with no readonly properties is applied.', () => {
  const docType = createDocType()
  delete docType.readonlyFieldNames
  const doc: DocRecord = { id: '123', propA: 'aaa',  propB: 'bbb' }
  executePatch(docType, doc, { propA: 'AAA' })
  expect(doc).toEqual({ id: '123', propA: 'AAA',  propB: 'bbb' })
})

test('A patch that changes a system field is rejected.', () => {
  const doc: DocRecord = { id: '123', propA: 'aaa',  propB: 'bbb' }
  expect(() => executePatch(createDocType(), doc, { id: '321' })).toThrow(asError(SengiPatchValidationFailedError))
  expect(() => executePatch(createDocType(), doc, { id: '321' })).toThrow(/Cannot patch system field/)
})

test('A patch that changes a readonly field is rejected.', () => {
  const doc: DocRecord = { id: '123', propA: 'aaa',  propB: 'bbb' }
  expect(() => executePatch(createDocType(), doc, { propB: 'BBB' })).toThrow(asError(SengiPatchValidationFailedError))
  expect(() => executePatch(createDocType(), doc, { propB: 'BBB' })).toThrow(/Cannot patch readonly field/)
})
