import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('204 - patch a document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .patch('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'adminKey')
    .send({ filmTitle: 'Die Hard 2' })

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-version-matched']).toEqual('false')
  expect(response.header['sengi-document-operation-id']).toEqual('00000000-0000-0000-0000-000000000001')
  expect(response.header['sengi-document-operation-type']).toEqual('update')
  expect(docs).toHaveLength(2)
  expect(docs[0].filmTitle).toEqual('Die Hard 2')
})

test('204 - patch a document with a required version', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .patch('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'adminKey')
    .set('if-match', 'xyz')
    .send({ filmTitle: 'Die Hard 2' })

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-version-matched']).toEqual('true')
  expect(response.header['sengi-document-operation-id']).toEqual('00000000-0000-0000-0000-000000000001')
  expect(response.header['sengi-document-operation-type']).toEqual('update')
  expect(docs).toHaveLength(2)
  expect(docs[0].filmTitle).toEqual('Die Hard 2')
})

test('204 - patch a document with an explicit operation id', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .patch('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'adminKey')
    .set('x-request-id', 'abcdd8e8-70b5-4968-8fc8-f9ef8b15abcd')
    .send({ filmTitle: 'Die Hard 2' })

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-version-matched']).toEqual('false')
  expect(response.header['sengi-document-operation-id']).toEqual('abcdd8e8-70b5-4968-8fc8-f9ef8b15abcd')
  expect(response.header['sengi-document-operation-type']).toEqual('update')
  expect(docs).toHaveLength(2)
  expect(docs[0].filmTitle).toEqual('Die Hard 2')
})

test('204 - patch a document with a used (previously applied) operation id', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .patch('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'adminKey')
    .set('x-request-id', '0000d8e8-70b5-4968-8fc8-f9ef8b150000')
    .send({ filmTitle: 'Die Hard 2' })

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-version-matched']).toEqual('false')
  expect(response.header['sengi-document-operation-id']).toEqual('0000d8e8-70b5-4968-8fc8-f9ef8b150000')
  expect(response.header['sengi-document-operation-type']).toEqual('none')
  expect(docs).toHaveLength(2)
  expect(docs[0].filmTitle).toEqual('Die Hard') // change not made
})

test('400 - fail to patch a document with invalid fields', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .patch('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'adminKey')
    .send({ filmTitle: 123 })

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/filmTitle/)
  expect(docs).toHaveLength(2)
})

test('400 - fail to patch a readonly fields in a document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .patch('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'adminKey')
    .send({ durationInMinutes: 95 })

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/durationInMinutes/)
  expect(docs).toHaveLength(2)
  expect(docs[0]).toHaveProperty('durationInMinutes', 105)
})

test('404 - fail to patch an unknown document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .patch('/root/records/films/unknown_id')
    .set('x-api-key', 'adminKey')
    .send({ filmTitle: 'Die Hard 2' })

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/unknown_id/)
  expect(docs).toHaveLength(2)
})

test('412 - fail to patch a document with an unavailable required version', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .patch('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'adminKey')
    .set('if-match', 'abcd')
    .send({ filmTitle: 'Die Hard 2' })

  expect(response.status).toEqual(412)
  expect(response.text).toMatch(/Required version of document is not available/)
  expect(docs).toHaveLength(2)
})
