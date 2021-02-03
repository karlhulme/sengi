import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('200 - get doc type.', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/docTypes/film')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    docType: expect.objectContaining({
      name: 'film',
      pluralName: 'films'
    })
  })
})

test('405 - fail to get doc type using the POST method.', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/docTypes/anything')

  expect(response.status).toEqual(405)
  expect(response.text).toMatch(/Verb 'POST' is not valid /)
})
