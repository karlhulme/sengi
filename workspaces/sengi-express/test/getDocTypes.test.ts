import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('200 - get doc types.', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/docTypes/')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    docTypes: [
      { name: 'film', pluralName: 'films', title: 'Film', pluralTitle: 'Films', summary: '' }
    ]
  })
})

test('405 - fail to get doc types using the POST method.', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/docTypes')

  expect(response.status).toEqual(405)
  expect(response.text).toMatch(/Verb 'POST' is not valid /)
})
