import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('200 - get documents by single id', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/docs/films?fields=id,filmTitle&ids=8c6e2aa0-b88d-4d14-966e-da8d3941d13c')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    docs: [
      { id: '8c6e2aa0-b88d-4d14-966e-da8d3941d13c', filmTitle: 'Home Alone' }
    ],
    deprecations: {}
  })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('200 - get documents with multiple ids', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/docs/films?fields=id,filmTitle&ids=8c6e2aa0-b88d-4d14-966e-da8d3941d13c,ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    docs: [
      { id: 'ba8f06b4-9b41-4e71-849c-484433afee79', filmTitle: 'Die Hard' },
      { id: '8c6e2aa0-b88d-4d14-966e-da8d3941d13c', filmTitle: 'Home Alone' }
    ],
    deprecations: {}
  })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('200 - get documents with unrecognised ids', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/docs/films?fields=id,filmTitle&ids=00000000-b88d-4d14-966e-da8d3941d13c')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({ docs: [], deprecations: {} })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('200 - get documents by ids without specifying fields', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/docs/films?ids=8c6e2aa0-b88d-4d14-966e-da8d3941d13c')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({ docs: [{}], deprecations: {} })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('400 - fail to get documents by ids with invalid field names', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/docs/films?fields=id,filmTitle,invalid&ids=8c6e2aa0-b88d-4d14-966e-da8d3941d13c')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/not define a field named 'invalid'/)
  expect(docs).toHaveLength(2)
})

test('403 - fail to get documents by ids with insufficient permissions', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/docs/films?ids=8c6e2aa0-b88d-4d14-966e-da8d3941d13c')
    .set('x-role-names', 'none')

  expect(response.status).toEqual(403)
  expect(response.text).toMatch(/permissions/)
  expect(docs).toHaveLength(2)
})

test('404 - fail to get documents by ids from an unknown collection', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/docs/unknown?ids=8c6e2aa0-b88d-4d14-966e-da8d3941d13c')
    .set('x-role-names', 'admin')

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/doc-type name 'unknown' was not recognised/)
  expect(docs).toHaveLength(2)
})
