import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('200 - get enum types.', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/enumTypes/')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    enumTypes: [
      { domain: 'https://jsonotron.org', system: 'jss', name: 'dayOfWeek', title: 'Day of Week', documentation: expect.any(String) }
    ]
  })
})

test('405 - fail to get enum types using the POST method.', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/enumTypes')

  expect(response.status).toEqual(405)
  expect(response.text).toMatch(/Verb 'POST' is not valid /)
})
