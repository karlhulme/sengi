import { afterAll, beforeAll, expect, test } from '@jest/globals'
import fs from 'fs'
import http from 'http'
import bodyParser from 'body-parser'
import express from 'express'
import { Doc } from 'sengi-interfaces'
import { MemDocStore } from 'sengi-docstore-mem'
import { createSengiExpress } from 'sengi-express'
import { testDocTypes } from './docTypes'
import { testRoleTypes } from './roleTypes'
import { SengiClient } from '../src'

const PORT = 40123

const docs: Doc[] = []
let server: http.Server

beforeAll(async () => {
  const mediumStringType = fs.readFileSync('./test/testTypeSystem/mediumString.yaml', 'utf-8')
  const positiveInteger = fs.readFileSync('./test/testTypeSystem/positiveInteger.yaml', 'utf-8')
  const yesNo = fs.readFileSync('./test/testTypeSystem/yesNo.yaml', 'utf-8')

  docs.push({
    id: 'ba8f06b4-9b41-4e71-849c-484433afee79',
    docType: 'ns.hobby',
    docVersion: 'xyz',
    docOps: [],
    name: 'Chess',
    inventor: 'Sissa Ben Dahir',
    rules: [
      'The pawns move forward, except...',
      'The rooks move horizontally and vertically.',
      'The bishops move diagonally.'
    ]
  })
  
  docs.push({
    id: '8c6e2aa0-b88d-4d14-966e-da8d3941d13c',
    docType: 'ns.hobby',
    docVersion: 'xyz',
    docOps: [],
    name: 'Tic tac toe',
    inventor: 'Unknown',
    rules: [
      'Take turns to place an X or 0.',
      'Get 3 in a line to win.'
    ]
  })

  docs.push({
    id: '5bca1b41-e0fa-4c3a-86ae-7a8e1e832f0e',
    docType: 'ns.hobby',
    docVersion: 'xyz',
    docOps: [],
    name: 'Darts',
    inventor: 'Unknown',
    rules: [
      'Throw a dart at the board.',
      'You get three attempts.',
      'Remove your score from your total, which starts at 501',
      'The winner is the first to reach zero.'
    ]
  })

  const memDocStore = new MemDocStore({ docs, generateDocVersionFunc: () => 'xxxx' })

  const sengiExpress = createSengiExpress({
    docTypes: testDocTypes,
    roleTypes: testRoleTypes,
    jsonotronTypes: [mediumStringType, positiveInteger, yesNo],
    docStore: memDocStore,
    getUuid: () => '00000000-0000-0000-0000-000000000001'
  })

  const app = express()
  app.use(bodyParser.json())
  app.use('/', sengiExpress)

  return new Promise<void>(resolve => {
    server = app.listen(PORT, () => {
      resolve()
    })
  })
})

test('Create a new document.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  await client.createDocument({
    docTypePluralName: 'ns.hobbies', 
    newDocumentId: '72750f5a-0e85-4dd3-bfe9-bdb8c623d3d1',
    constructorParams: {
      name: 'Snakes and Ladders',
      inventor: 'Saint Gyandev'
    }
  })
  expect(docs.findIndex(d => d.id === '72750f5a-0e85-4dd3-bfe9-bdb8c623d3d1')).toBeGreaterThan(-1)
})

test('Delete a document.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  expect(docs.findIndex(d => d.id === '5bca1b41-e0fa-4c3a-86ae-7a8e1e832f0e')).toBeGreaterThan(-1)
  await client.deleteDocumentById({
    docTypePluralName: 'ns.hobbies',
    documentId: '5bca1b41-e0fa-4c3a-86ae-7a8e1e832f0e'
  })
  expect(docs.findIndex(d => d.id === '5bca1b41-e0fa-4c3a-86ae-7a8e1e832f0e')).toEqual(-1)
})

test('Get a document.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  const fetchedDoc = await client.getDocumentById({
    docTypePluralName: 'ns.hobbies',
    documentId: 'ba8f06b4-9b41-4e71-849c-484433afee79',
    fieldNames: ['name', 'inventor']
  })
  expect(fetchedDoc).toHaveProperty('name', 'Chess')
  expect(fetchedDoc).toHaveProperty('inventor')
})

test('Query for a document.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  const fetchedDoc = await client.queryDocumentById({
    docTypePluralName: 'ns.hobbies',
    documentId: 'ba8f06b4-9b41-4e71-849c-484433afee79',
    fieldNames: ['name', 'inventor']
  })
  expect(fetchedDoc).toHaveProperty('name', 'Chess')
  expect(fetchedDoc).toHaveProperty('inventor')
})

test('Query for a non-existent document.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  const fetchedDoc = await client.queryDocumentById({
    docTypePluralName: 'ns.hobbies',
    documentId: 'not-a-real-doc-id',
    fieldNames: ['name', 'inventor']
  })
  expect(fetchedDoc).toEqual(null)
})

test('Operate on a document with a required version.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  await client.operateOnDocument({
    docTypePluralName: 'ns.hobbies',
    operationId: 'cbd7a3a5-97cb-4279-abb4-25061293d795',
    documentId: 'ba8f06b4-9b41-4e71-849c-484433afee79',
    operationName: 'addRule',
    operationParams: {
      newRule: 'The king moves one space in any direction'
    },
    reqVersion: 'xyz'
  })
  const doc = docs.find(d => d.id === 'ba8f06b4-9b41-4e71-849c-484433afee79') as Record<string, Doc>
  expect(doc.rules).toHaveLength(4)
})

test('Patch a document with a required version.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'], logToConsole: true })
  await client.patchDocument({
    docTypePluralName:'ns.hobbies',
    operationId: 'e24c71a2-b5dd-4b83-bce6-dde2817225d8',
    documentId: '8c6e2aa0-b88d-4d14-966e-da8d3941d13c',
    patch: {
      inventor: 'Unknown Person'
    },
    reqVersion: 'xyz'
  })
  const doc = docs.find(d => d.id === '8c6e2aa0-b88d-4d14-966e-da8d3941d13c') as Record<string, Doc>
  expect(doc).toHaveProperty('inventor', 'Unknown Person')
})

test('Query all documents.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  const fetchedDocs = await client.queryAllDocuments({
    docTypePluralName: 'ns.hobbies',
    fieldNames: ['id', 'inventor']
  })
  expect(fetchedDocs.length).toBeGreaterThanOrEqual(2)
})

test('Query documents with a filter.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  const fetchedDocs = await client.queryDocumentsByFilter({
    docTypePluralName: 'ns.hobbies',
    filterName: 'byRulesCount',
    filterParams: { minRules: 3 },
    fieldNames: ['id', 'inventor']
  })
  expect(fetchedDocs.findIndex(d => d.id === '8c6e2aa0-b88d-4d14-966e-da8d3941d13c')).toEqual(-1)
})

test('Query documents with an id array.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  const fetchedDocs = await client.queryDocumentsByIds({
    docTypePluralName: 'ns.hobbies',
    documentIds: ['ba8f06b4-9b41-4e71-849c-484433afee79', 'ba8f06b4-9b41-4e71-849c-484433afee79'],
    fieldNames: ['id', 'inventor']
  })
  expect(fetchedDocs.length).toEqual(1)
})

test('Query documents with an empty id array.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  const fetchedDocs = await client.queryDocumentsByIds({
    docTypePluralName: 'ns.hobbies',
    documentIds: [],
    fieldNames: ['id', 'inventor']
  })
  expect(fetchedDocs.length).toEqual(0)
})

test('Upsert a document.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  await client.upsertDocument({
    docTypePluralName: 'ns.hobbies',
    document: {
      id: '67a5aa97-1a94-477a-884b-b2555f9aa230',
      name: 'Poker',
      inventor: 'Venetians'
    }
  })
  expect(docs.findIndex(d => d.id === '67a5aa97-1a94-477a-884b-b2555f9aa230')).toBeGreaterThan(-1)
})

test('Get enum type overviews.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  const enumTypes = await client.getEnumTypeOverviews()
  expect(enumTypes).toBeDefined()
  expect(enumTypes).toEqual(expect.arrayContaining([{
    domain: 'https://jsonotron.org',
    system: 'jss',
    name: 'yesNo',
    title: 'Yes or No'
  }]))
})

test('Get enum type.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  const enumType = await client.getEnumType({
    fullyQualifiedEnumTypeName: 'https://jsonotron.org/jss/yesNo'
  })
  expect(enumType).toBeDefined()
  expect(enumType.items.length).toEqual(2)
  expect(enumType.items[0]).toHaveProperty('value', 'yes')
  expect(enumType.items[0]).toHaveProperty('text', 'Yes')
  expect(enumType.items[1]).toHaveProperty('value', 'no')
  expect(enumType.items[1]).toHaveProperty('text', 'No')
})

test('Get doc type overviews.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  const docTypes = await client.getDocTypeOverviews()
  expect(docTypes).toBeDefined()
  expect(docTypes).toEqual(expect.arrayContaining([{
    name: 'ns.hobby',
    pluralName: 'ns.hobbies',
    title: 'Hobby',
    pluralTitle: 'Hobbies',
    summary: ''
  }]))
})

test('Get doc type.', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  const docType = await client.getDocType({ docTypeName: 'ns.hobby' })
  expect(docType).toBeDefined()
})

afterAll(async () => {
  return new Promise<void>(resolve => {
    server.close(() => {
      resolve()
    })
  })
})
