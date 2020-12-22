import { expect, test } from '@jest/globals'
import { DocType } from 'sengi-interfaces'

export function createCarDocType (): DocType {
  return {
    name: 'car',
    title: 'Car',
    pluralName: 'cars',
    pluralTitle: 'Cars',
    summary: 'A car',
    documentation: 'This is a car document type.',

    fields: {},
    examples: [],
    patchExamples: [],

    aggregates: {},
    calculatedFields: {},
    ctor: {
      title: 'New car',
      documentation: 'Create a new car',
      parameters: {},
      examples: [],
      implementation: () => ({})
    },
    filters: {},
    operations: {},
    docStoreOptions: {},
    policy: {
      canDeleteDocuments: true,
      canFetchWholeCollection: true,
      canReplaceDocuments: true,
      maxOpsSize: 3
    }
  }
}

test('Prevent warnings about no tests found in file.', () => {
  expect(typeof createCarDocType()).toEqual('object')
})
