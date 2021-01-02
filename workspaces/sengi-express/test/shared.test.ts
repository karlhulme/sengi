import { test, expect } from '@jest/globals'
import fs from 'fs'
import bodyParser from 'body-parser'
import express, { Express } from 'express'
import { Doc } from 'sengi-interfaces'
import { MemDocStore } from 'sengi-docstore-mem'
import { testDocTypes } from './docTypes'
import { testRoleTypes } from './roleTypes'
import { createSengiExpress } from '../src'

interface TestableAppResult {
  testableApp: Express
  docs: Doc[]
}

export function createTestableApp (): TestableAppResult {
  const dayOfWeekType = fs.readFileSync('./test/testTypeSystem/dayOfWeek.yaml', 'utf-8')
  const integerType = fs.readFileSync('./test/testTypeSystem/integer.yaml', 'utf-8')
  const mediumStringType = fs.readFileSync('./test/testTypeSystem/mediumString.yaml', 'utf-8')
  const positiveInteger = fs.readFileSync('./test/testTypeSystem/positiveInteger.yaml', 'utf-8')
  const shortStringType = fs.readFileSync('./test/testTypeSystem/shortString.yaml', 'utf-8')

  const docs: Doc[] = [{
    id: 'ba8f06b4-9b41-4e71-849c-484433afee79',
    docType: 'film',
    docVersion: 'xyz',
    docOps: [{
      opId: '0000d8e8-70b5-4968-8fc8-f9ef8b150000',
      style: 'patch'
    }],
    filmTitle: 'Die Hard',
    durationInMinutes: 105,
    castMembers: [],
    totalCastSize: 0
  }, {
    id: '8c6e2aa0-b88d-4d14-966e-da8d3941d13c',
    docType: 'film',
    docVersion: 'xyz',
    docOps: [],
    filmTitle: 'Home Alone',
    durationInMinutes: 91,
    castMembers: ['Bob Hope'],
    totalCastSize: 1
  }]
  const memDocStore = new MemDocStore({ docs, generateDocVersionFunc: () => 'xxxx' })

  const sengiExpress = createSengiExpress({
    docTypes: testDocTypes,
    roleTypes: testRoleTypes,
    jsonotronTypes: [dayOfWeekType, integerType, mediumStringType, positiveInteger, shortStringType],
    docStore: memDocStore,
    getUuid: () => '00000000-0000-0000-0000-000000000001'
  })

  const testableApp = express()
  testableApp.use(bodyParser.json())
  testableApp.use('/root', sengiExpress)

  return {
    testableApp,
    docs
  }
}

test('Testable app can be created.', () => {
  const { testableApp, docs } = createTestableApp()
  expect(testableApp).toBeDefined()
  expect(docs).toBeDefined()
})
