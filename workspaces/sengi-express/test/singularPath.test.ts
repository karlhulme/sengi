import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('201 - create a document using the singular doc type name', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/records/film:makeShort')
    .set('x-api-key', 'adminKey')
    .send({ title: 'Cloudy' })

  expect(response.status).toEqual(201)
})