import express from 'express'
import fs from 'fs'
import supertest from 'supertest'
import { test, expect } from '@jest/globals'
import { MemDocStore } from 'sengi-docstore-mem'
import { createSengiExpress } from '../src'
import { testDocTypes } from './docTypes'
import { testRoleTypes } from './roleTypes'

test('A sengi express can be constructed providing custom callbacks.', async () => {
  const integerType = fs.readFileSync('./test/testTypeSystem/integer.yaml', 'utf-8')
  const mediumStringType = fs.readFileSync('./test/testTypeSystem/mediumString.yaml', 'utf-8')
  const positiveInteger = fs.readFileSync('./test/testTypeSystem/positiveInteger.yaml', 'utf-8')
  const shortStringType = fs.readFileSync('./test/testTypeSystem/shortString.yaml', 'utf-8')

  const memDocStore = new MemDocStore({ docs: [], generateDocVersionFunc: () => 'xxxx' })

  const sengiExpress = createSengiExpress({
    docTypes: testDocTypes,
    roleTypes: testRoleTypes,
    jsonotronTypes: [integerType, mediumStringType, positiveInteger, shortStringType],
    docStore: memDocStore,
    getUuid: () => '00000000-0000-0000-0000-000000000001',
    getDocStoreOptions: () => ({ foo: 'bar' }),
    getRequestProps: () => ({ hello: 'world' }),
    additionalComponentsCount: 0
  })

  const testableApp = express()
  testableApp.use('/', sengiExpress)

  const response = await supertest(testableApp).get('/')
  expect(response.status).toEqual(200)
})

test('A sengi express can be constructed without providing any custom callbacks or types.', async () => {
  const memDocStore = new MemDocStore({ docs: [], generateDocVersionFunc: () => 'xxxx' })

  const sengiExpress = createSengiExpress({
    docStore: memDocStore
  })

  const testableApp = express()
  testableApp.use('/', sengiExpress)

  const response = await supertest(testableApp).get('/')
  expect(response.status).toEqual(200)
})
