/* eslint-env jest */
import { SengiError } from './SengiError'

test('The SengiError is constructed correctly.', () => {
  const err = new SengiError('my message')
  expect(err).toHaveProperty('name', 'SengiError')
  expect(err).toHaveProperty('message', 'my message')
})
