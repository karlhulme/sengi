import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('204 - delete a document that exists', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .delete('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-operation-type']).toEqual('delete')
  expect(docs).toHaveLength(1)
})

test('204 - delete a non-existent document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .delete('/root/records/films/unknown_id')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-operation-type']).toEqual('none')
  expect(docs).toHaveLength(2)
})

test('403 - fail to delete a document with insufficient permissions', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .delete('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'guestKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(403)
  expect(docs).toHaveLength(2)
})

test('404 - fail to delete a document in an unknown collection', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .delete('/root/records/unknown/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/value 'unknown' was not recognised/)
  expect(docs).toHaveLength(2)
})
