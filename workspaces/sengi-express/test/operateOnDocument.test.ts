import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('204 - operate on a document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films/ba8f06b4-9b41-4e71-849c-484433afee79:addCastMember')
    .set('x-role-names', 'admin')
    .send({ actor: 'Bruce Willis' })

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-version-matched']).toEqual('false')
  expect(response.header['sengi-document-operation-id']).toEqual('00000000-0000-0000-0000-000000000001')
  expect(response.header['sengi-document-operation-type']).toEqual('update')
  expect(docs).toHaveLength(2)
  expect(docs[0].castMembers).toEqual(['Bruce Willis'])
})

test('204 - operate on a document with a required version', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films/ba8f06b4-9b41-4e71-849c-484433afee79:addCastMember')
    .set('x-role-names', 'admin')
    .set('if-match', 'xyz')
    .send({ actor: 'Bruce Willis' })

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-version-matched']).toEqual('true')
  expect(response.header['sengi-document-operation-id']).toEqual('00000000-0000-0000-0000-000000000001')
  expect(response.header['sengi-document-operation-type']).toEqual('update')
  expect(docs).toHaveLength(2)
  expect(docs[0].castMembers).toEqual(['Bruce Willis'])
})

test('204 - operate on a document with an explicit operation id', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films/ba8f06b4-9b41-4e71-849c-484433afee79:addCastMember')
    .set('x-role-names', 'admin')
    .set('x-request-id', 'abcdd8e8-70b5-4968-8fc8-f9ef8b15abcd')
    .send({ actor: 'Bruce Willis' })

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-version-matched']).toEqual('false')
  expect(response.header['sengi-document-operation-id']).toEqual('abcdd8e8-70b5-4968-8fc8-f9ef8b15abcd')
  expect(response.header['sengi-document-operation-type']).toEqual('update')
  expect(docs).toHaveLength(2)
  expect(docs[0].castMembers).toEqual(['Bruce Willis'])
})

test('204 - operate on a document with a used (previously applied) operation id', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films/ba8f06b4-9b41-4e71-849c-484433afee79:addCastMember')
    .set('x-role-names', 'admin')
    .set('x-request-id', '0000d8e8-70b5-4968-8fc8-f9ef8b150000')
    .send({ actor: 'Bruce Willis' })

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-version-matched']).toEqual('false')
  expect(response.header['sengi-document-operation-id']).toEqual('0000d8e8-70b5-4968-8fc8-f9ef8b150000')
  expect(response.header['sengi-document-operation-type']).toEqual('none')
  expect(docs).toHaveLength(2)
  expect(docs[0].castMembers).toEqual([]) // change not made
})

test('400 - fail to invoke an operation with invalid parameters', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films/ba8f06b4-9b41-4e71-849c-484433afee79:addCastMember')
    .set('x-role-names', 'admin')
    .send({ actor: 123 })

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/actor/)
  expect(docs).toHaveLength(2)
})

test('404 - fail to invoke an operation on an unknown document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films/unknown_id:addCastMember')
    .set('x-role-names', 'admin')
    .send({ actor: 'Bruce Willis' })

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/unknown_id/)
  expect(docs).toHaveLength(2)
})

test('404 - fail to invoke an unknown operation on a document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films/ba8f06b4-9b41-4e71-849c-484433afee79:unknownMethod')
    .set('x-role-names', 'admin')
    .send({ actor: 'Bruce Willis' })

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/unknownMethod/)
  expect(docs).toHaveLength(2)
})

test('405 - fail to operate on a document with an invalid verb', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .patch('/root/films/ba8f06b4-9b41-4e71-849c-484433afee79:addCastMember')
    .set('x-role-names', 'admin')
    .send({ actor: 'Bruce Willis' })

  expect(response.status).toEqual(405)
  expect(response.text).toMatch(/Verb 'PATCH' is not valid /)
  expect(docs).toHaveLength(2)
})

test('412 - fail to operate on a document with an unavailable required version', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/films/ba8f06b4-9b41-4e71-849c-484433afee79:addCastMember')
    .set('x-role-names', 'admin')
    .set('if-match', 'abcd')
    .send({ actor: 'Bruce Willis' })

  expect(response.status).toEqual(412)
  expect(response.text).toMatch(/Required version of document is not available/)
  expect(docs).toHaveLength(2)
})
