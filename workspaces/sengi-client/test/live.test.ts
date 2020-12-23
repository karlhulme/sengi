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

  docs.push({
    id: 'ba8f06b4-9b41-4e71-849c-484433afee79',
    docType: 'hobby',
    docVersion: 'xyz',
    docOps: [],
    name: 'Chess',
    inventor: 'Grand Vizier Sissa Ben Dahir',
    rules: [
      'The pawns move forward, except...',
      'The rooks move horizontally and vertically.',
      'The bishops move diagonally.'
    ]
  })
  
  docs.push({
    id: '8c6e2aa0-b88d-4d14-966e-da8d3941d13c',
    docType: 'hobby',
    docVersion: 'xyz',
    docOps: [],
    name: 'Tic tac toe',
    inventor: 'Unknown',
    rules: [
      'Take turns to place an X or 0.',
      'Get 3 in a line to win.'
    ]
  })

  const memDocStore = new MemDocStore({ docs, generateDocVersionFunc: () => 'xxxx' })

  const sengiExpress = createSengiExpress({
    docTypes: testDocTypes,
    roleTypes: testRoleTypes,
    jsonotronTypes: [mediumStringType, positiveInteger],
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

test('Query for a document', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  const doc = await client.getDocumentById('hobbies', 'ba8f06b4-9b41-4e71-849c-484433afee79', ['name', 'inventor'])
  expect(doc).toHaveProperty('name', 'Chess')
  expect(doc).toHaveProperty('inventor', 'Grand Vizier Sissa Ben Dahir')
})

test('Save a new document', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  await client.saveNewDocument('hobbies', {
    id: '72750f5a-0e85-4dd3-bfe9-bdb8c623d3d1',
    name: 'Darts',
    inventor: 'Brian Gamlin'
  })
  expect(docs.findIndex(d => d.id === '72750f5a-0e85-4dd3-bfe9-bdb8c623d3d1')).toBeGreaterThan(-1)
})

test('Operate on a document', async () => {
  const client = new SengiClient({ url: `http://localhost:${PORT}/`, roleNames: ['admin'] })
  await client.operateOnDocument('hobbies', 'cbd7a3a5-97cb-4279-abb4-25061293d795', 'ba8f06b4-9b41-4e71-849c-484433afee79', 'addRule', {
    newRule: 'The king moves one space in any direction'
  })
  expect(docs.findIndex(d => d.id === 'ba8f06b4-9b41-4e71-849c-484433afee79' && (d.rules as string[]).length === 4)).toBeGreaterThan(-1)
})

afterAll(async () => {
  return new Promise<void>(resolve => {
    server.close(() => {
      resolve()
    })
  })
})
