/* eslint-env jest */
const createJsonotron = require('./createJsonotron')

test('A Jsonotron can be created given valid inputs.', () => {
  expect(() => createJsonotron({}, [], [], {})).not.toThrow()

  expect(() => createJsonotron('invalid', [], [], {})).toThrow(/docStore/)
  expect(() => createJsonotron({}, 'invalid', [], {})).toThrow(/docTypes/)
  expect(() => createJsonotron({}, [], 'invalid', {})).toThrow(/roleTypes/)
  expect(() => createJsonotron({}, [], [], 'invalid')).toThrow(/config/)
})
