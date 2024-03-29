import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('204 - replace a new document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .put('/root/records/films/a8808117-f8c7-4928-ac19-08532d2e5775')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({ id: 'a8808117-f8c7-4928-ac19-08532d2e5775', docType: 'film', filmTitle: 'Frozen', docOpIds: [], castMembers: [] })

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-operation-type']).toEqual('create')
  expect(docs).toHaveLength(3)
})

test('204 - replace an existing document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .put('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({ id: 'ba8f06b4-9b41-4e71-849c-484433afee79', docType: 'film', filmTitle: 'Frozen', docOpIds: [], castMembers: [] })

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-operation-type']).toEqual('update')
  expect(docs).toHaveLength(2)
})

test('400 - fail to replace document if it has missing required fields', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .put('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({ id: 'ba8f06b4-9b41-4e71-849c-484433afee79', docType: 'film', missingFilmTitle: 'Frozen', docOpIds: [], castMembers: [] })

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/required property 'filmTitle'/)
  expect(docs).toHaveLength(2)
})

test('403 - fail to replace document with insufficient permissions', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .put('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'guestKey')
    .set('x-user', '{}')
    .send({ id: 'ba8f06b4-9b41-4e71-849c-484433afee79', docType: 'film', filmTitle: 'Frozen', docOpIds: [], castMembers: [] })

  expect(response.status).toEqual(403)
  expect(docs).toHaveLength(2)
})

test('404 - fail to put document in an unknown collection', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .put('/root/records/unknown/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({ id: 'ba8f06b4-9b41-4e71-849c-484433afee79', docType: 'film', filmTitle: 'Frozen', docOpIds: [], castMembers: [] })

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/value 'unknown' was not recognised/)
  expect(docs).toHaveLength(2)
})

test('405 - fail to create a new document using POST method', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films/a8808117-f8c7-4928-ac19-08532d2e5775')
    .set('x-api-key', 'adminKey')
    .set('x-user', '{}')
    .send({ id: 'a8808117-f8c7-4928-ac19-08532d2e5775', docType: 'film', filmTitle: 'Frozen', docOpIds: [], castMembers: [] })

  expect(response.status).toEqual(405)
  expect(response.text).toMatch(/Verb 'POST' is not valid /)
  expect(docs).toHaveLength(2)
})
