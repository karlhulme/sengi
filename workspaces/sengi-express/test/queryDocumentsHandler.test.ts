import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('200 - execute a query that does not require parameters', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?queryName=count')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    data: { count: 2 }
  })
  expect(response.header['sengi-document-operation-type']).toEqual('read')
  expect(docs).toHaveLength(2)
})

test('400 - fail to execute a query with malformed parameters', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?queryName=countWithParam&queryParams={malformed_json}')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/cannot be parsed into a JSON object/)
  expect(docs).toHaveLength(2)
})

test('400 - fail to execute a query with invalid parameters', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?queryName=countWithParam&queryParams={"dummy":123}') // dummy field should be a string
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/should be string/)
  expect(docs).toHaveLength(2)
})

test('400 - fail to execute an unknown query', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?queryName=unknown')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/does not define a query named 'unknown'/)
  expect(docs).toHaveLength(2)
})

test('403 - fail to execute query with insufficient permissions', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/films?queryName=count')
    .set('x-api-key', 'guestKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(403)
  expect(docs).toHaveLength(2)
})

test('404 - fail to execute a query against an unknown collection', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/records/unknown?queryName=count')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/value 'unknown' was not recognised/)
  expect(docs).toHaveLength(2)
})
