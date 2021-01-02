import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('204 - put a new document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .put('/root/records/films/a8808117-f8c7-4928-ac19-08532d2e5775')
    .set('x-role-names', 'admin')
    .send({ id: 'a8808117-f8c7-4928-ac19-08532d2e5775', docType: 'film', filmTitle: 'Frozen', castMembers: [] })

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-operation-type']).toEqual('create')
  expect(docs).toHaveLength(3)
})

test('204 - replace an existing document', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .put('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-role-names', 'admin')
    .send({ id: 'ba8f06b4-9b41-4e71-849c-484433afee79', docType: 'film', filmTitle: 'Frozen', castMembers: [] })

  expect(response.status).toEqual(204)
  expect(response.body).toEqual({})
  expect(response.header['sengi-document-operation-type']).toEqual('update')
  expect(docs).toHaveLength(2)
})

test('400 - fail to put new document with missing required fields', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .put('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-role-names', 'admin')
    .send({ id: 'ba8f06b4-9b41-4e71-849c-484433afee79', docType: 'film', missingFilmTitle: 'Frozen', castMembers: [] })

  expect(response.status).toEqual(400)
  expect(response.text).toMatch(/filmTitle/)
  expect(response.text).toMatch(/values supplied/)
  expect(response.text).toMatch(/were not valid/)
  expect(docs).toHaveLength(2)
})

test('403 - fail to replace document with insufficient permissions', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .put('/root/records/films/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-role-names', 'none')
    .send({ id: 'ba8f06b4-9b41-4e71-849c-484433afee79', docType: 'film', filmTitle: 'Frozen', castMembers: [] })

  expect(response.status).toEqual(403)
  expect(response.text).toMatch(/permissions/)
  expect(docs).toHaveLength(2)
})

test('404 - fail to put document in an unknown collection', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .put('/root/records/unknown/ba8f06b4-9b41-4e71-849c-484433afee79')
    .set('x-role-names', 'admin')
    .send({ id: 'ba8f06b4-9b41-4e71-849c-484433afee79', docType: 'film', filmTitle: 'Frozen', castMembers: [] })

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/doc-type name 'unknown' was not recognised/)
  expect(docs).toHaveLength(2)
})

test('405 - fail to create a new document using POST method', async () => {
  const { testableApp, docs } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/films/a8808117-f8c7-4928-ac19-08532d2e5775')
    .set('x-role-names', 'admin')
    .send({ id: 'a8808117-f8c7-4928-ac19-08532d2e5775', docType: 'film', filmTitle: 'Frozen', castMembers: [] })

  expect(response.status).toEqual(405)
  expect(response.text).toMatch(/Verb 'POST' is not valid /)
  expect(docs).toHaveLength(2)
})
