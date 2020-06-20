/* eslint-env jest */
const ensureCanFetchWholeCollection = require('./ensureCanFetchWholeCollection')
const { JsonotronActionForbiddenByPolicyError } = require('jsonotron-errors')

test('Remain silent if policy allows action.', () => {
  expect(() => ensureCanFetchWholeCollection({ name: 'test', policy: { canFetchWholeCollection: true } })).not.toThrow()
})

test('Raise error if policy disallows action.', () => {
  expect(() => ensureCanFetchWholeCollection({ name: 'test', policy: {} })).toThrow(JsonotronActionForbiddenByPolicyError)
  expect(() => ensureCanFetchWholeCollection({ name: 'test' })).toThrow(/fetch whole collection/)
})
