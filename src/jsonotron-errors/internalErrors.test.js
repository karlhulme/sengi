/* eslint-env jest */
import { JsonotronInternalError } from './internalErrors'

test('The internal error is constructed correctly.', () => {
  const err = new JsonotronInternalError('my message')
  expect(err).toHaveProperty('name', 'JsonotronInternalError')
  expect(err).toHaveProperty('message', 'my message')
})
