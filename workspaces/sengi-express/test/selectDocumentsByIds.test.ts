import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('200 - get documents by single id', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?fields=id,filmTitle&ids=8c6e2aa0-b88d-4d14-966e-da8d3941d13c')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    docs: [
      { id: '8c6e2aa0-b88d-4d14-966e-da8d3941d13c', filmTitle: 'Home Alone' }
    ]
  })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('200 - get documents with multiple ids', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?fields=id,filmTitle&ids=8c6e2aa0-b88d-4d14-966e-da8d3941d13c,ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    docs: [
      { id: 'ba8f06b4-9b41-4e71-849c-484433afee79', filmTitle: 'Die Hard' },
      { id: '8c6e2aa0-b88d-4d14-966e-da8d3941d13c', filmTitle: 'Home Alone' }
    ]
  })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('200 - get documents with unrecognised ids', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?fields=id,filmTitle&ids=00000000-b88d-4d14-966e-da8d3941d13c')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({ docs: [] })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('200 - get documents by ids without specifying fields', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?ids=8c6e2aa0-b88d-4d14-966e-da8d3941d13c')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({ docs: [{ id: '8c6e2aa0-b88d-4d14-966e-da8d3941d13c' }] })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('403 - fail to get documents by ids with insufficient permissions', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?ids=8c6e2aa0-b88d-4d14-966e-da8d3941d13c')
    .set('x-api-key', 'guestKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(403)
  expect(docs).toHaveLength(2)
})

test('404 - fail to get documents by ids from an unknown collection', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/unknown?ids=8c6e2aa0-b88d-4d14-966e-da8d3941d13c')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/value 'unknown' was not recognised/)
  expect(docs).toHaveLength(2)
})
