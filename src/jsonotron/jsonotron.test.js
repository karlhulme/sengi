/* eslint-env jest */
const Jsonotron = require('./jsonotron')

test('A Jsonotron can be created given valid inputs.', () => {
  expect(() => new Jsonotron({}, [], [], {})).not.toThrow()

  expect(() => new Jsonotron('invalid', [], [], {})).toThrow(/docStore/)
  expect(() => new Jsonotron({}, 'invalid', [], {})).toThrow(/docTypes/)
  expect(() => new Jsonotron({}, [], 'invalid', {})).toThrow(/roleTypes/)
  expect(() => new Jsonotron({}, [], [], 'invalid')).toThrow(/config/)
})
