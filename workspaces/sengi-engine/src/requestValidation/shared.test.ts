import fs from 'fs'
import { expect, test } from '@jest/globals'
import { Jsonotron } from 'jsonotron-js'
import { DocType } from 'sengi-interfaces'

export function createJsonotron (): Jsonotron {
  const mediumStringType = fs.readFileSync('./test/testTypeSystem/mediumString.yaml', 'utf-8')
  const positiveIntegerType = fs.readFileSync('./test/testTypeSystem/positiveInteger.yaml', 'utf-8')
  const shortStringType = fs.readFileSync('./test/testTypeSystem/shortString.yaml', 'utf-8')

  return new Jsonotron({
    types: [mediumStringType, positiveIntegerType, shortStringType]
  })
}

export function createFilmDocType (): DocType {
  return {
    name: 'film',
    title: 'Film',
    pluralName: 'films',
    pluralTitle: 'Films',
    summary: 'A film',
    documentation: 'This is a film document type.',

    fields: {},
    examples: [],
    patchExamples: [],

    aggregates: {},
    calculatedFields: {},
    ctor: {
      title: 'New film',
      documentation: 'Create a new film record.',
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
  expect(typeof createFilmDocType()).toEqual('object')
})
