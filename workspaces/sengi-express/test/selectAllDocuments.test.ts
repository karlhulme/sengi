import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('200 - get all documents', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?fields=id,filmTitle')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    docs: [
      { id: 'ba8f06b4-9b41-4e71-849c-484433afee79', filmTitle: 'Die Hard' },
      { id: '8c6e2aa0-b88d-4d14-966e-da8d3941d13c', filmTitle: 'Home Alone' }
    ],
  })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('200 - get all documents without specifying fields', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    docs: [
      { id: 'ba8f06b4-9b41-4e71-849c-484433afee79' },
      { id: '8c6e2aa0-b88d-4d14-966e-da8d3941d13c' }
    ],
  })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('403 - fail to get all documents with insufficient permissions', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films')
    .set('x-role-names', 'none')

  expect(response.status).toEqual(403)
  expect(response.text).toMatch(/permissions/)
  expect(docs).toHaveLength(2)
})

test('403 - fail to get all documents with invalid role names', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films')
    .set('x-role-names', 'guest')

  expect(response.status).toEqual(403)
  expect(response.text).toMatch(/permissions/)
  expect(docs).toHaveLength(2)
})

test('404 - fail to get all documents from an unknown collection', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/unknown')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/doc-type name 'unknown' was not recognised/)
  expect(docs).toHaveLength(2)
})
