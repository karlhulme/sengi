/* eslint-env jest */
import { JsonotronError } from './JsonotronError'

test('The JsonotronError is constructed correctly.', () => {
  const err = new JsonotronError('my message')
  expect(err).toHaveProperty('name', 'JsonotronError')
  expect(err).toHaveProperty('message', 'my message')
})
