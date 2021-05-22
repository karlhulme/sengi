import { expect, test } from '@jest/globals'
import { AnyDocType, DocRecord } from 'sengi-interfaces'
import { appendDocOpId } from './appendDocOpId'

function createDocType (): AnyDocType {
  return {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    policy: {
      maxOpIds: 3
    }
  }
}

test('Append operation id for doc with no historical doc op ids.', () => {
  const doc: DocRecord = {}
  appendDocOpId(createDocType(), doc, 'abc')
  expect(doc.docOpIds).toEqual(['abc'])
})

test('Append operation id at the limit of doc ops with an explicitly set max-ops value.', () => {
  const doc = {
    docOpIds: ['aaa', 'bbb', 'ccc']
  }
  appendDocOpId(createDocType(), doc, 'ddd')
  expect(doc.docOpIds).toEqual(['bbb', 'ccc', 'ddd'])
})

test('Append operation id at the limit of doc ops with a policy but no explicitly defined max-ops value.', () => {
  const doc = {
    docOpIds: ['aaa', 'bbb', 'ccc', 'ddd', 'eee']
  }

  const docType = createDocType()
  if (docType.policy) {
    delete docType.policy.maxOpIds
  }

  appendDocOpId(docType, doc, 'fff')
  expect(doc.docOpIds).toEqual(['bbb', 'ccc', 'ddd', 'eee', 'fff'])
})

test('Append operation id at the limit of doc ops with a default max-ops policy of 5.', () => {
  const doc = {
    docOpIds: ['aaa', 'bbb', 'ccc', 'ddd', 'eee']
  }

  const docType = createDocType()
  delete docType.policy

  appendDocOpId(docType, doc, 'fff')
  expect(doc.docOpIds).toEqual(['bbb', 'ccc', 'ddd', 'eee', 'fff'])
})
