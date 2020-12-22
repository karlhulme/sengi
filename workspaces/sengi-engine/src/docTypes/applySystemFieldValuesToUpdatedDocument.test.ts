import { expect, test } from '@jest/globals'
import { Doc, DocType } from 'sengi-interfaces'
import { applySystemFieldValuesToUpdatedDocument } from './applySystemFieldValuesToUpdatedDocument'
import { createCarDocType } from './shared.test'

function createDocType (maxOpsSize: number): DocType {
  const docType = createCarDocType()
  docType.policy.maxOpsSize = maxOpsSize
  return docType
}

test('Apply latest operation id to the doc ops.', () => {
  const doc: Doc = {}
  applySystemFieldValuesToUpdatedDocument(createDocType(3), doc, 'abc', 'patch')
  expect(doc.docOps).toEqual([{ opId: 'abc', style: 'patch' }])
})

test('Apply latest operation id at the limit of doc ops.', () => {
  const doc = {
    docOps: [
      { opId: 'aaa', style: 'patch' },
      { opId: 'bbb', style: 'patch' },
      { opId: 'ccc', style: 'patch' }
    ]
  }
  applySystemFieldValuesToUpdatedDocument(createDocType(3), doc, 'abc', 'operation', 'addFive')
  expect(doc.docOps).toEqual([
    { opId: 'bbb', style: 'patch' },
    { opId: 'ccc', style: 'patch' },
    { opId: 'abc', style: 'operation', operationName: 'addFive' }
  ])
})
