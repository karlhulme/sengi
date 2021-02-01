import { test, expect } from '@jest/globals'
import supertest from 'supertest'
import { createTestableApp } from './shared.test'

test('200 - get enum type.', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/enumTypes/https%3A%2F%2Fjsonotron.org%2Fjss%2FdayOfWeek')

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    enumType: {
      domain: 'https://jsonotron.org',
      system: 'jss',
      name: 'dayOfWeek',
      title: 'Day of Week',
      documentation: 'A day of the week.',
      items: expect.arrayContaining([
        { value: 'sa', text: 'Saturday' }
      ])
    }
  })
})

test('404 - fail to get an unknown enum type. ', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .get('/root/enumTypes/unknown')

  expect(response.status).toEqual(404)
  expect(response.text).toMatch(/'unknown'/)
})

test('405 - fail to get an enum type using the POST method.', async () => {
  const { testableApp } = createTestableApp()
  const response = await supertest(testableApp)
    .post('/root/enumTypes/https%3A%2F%2Fjsonotron.org%2Fjss%2FdayOfWeek/')

  expect(response.status).toEqual(405)
  expect(response.text).toMatch(/Verb 'POST' is not valid /)
})