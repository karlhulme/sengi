/* eslint-env jest */
const ensureCanDeleteDocuments = require('./ensureCanDeleteDocuments')
const { JsonotronActionForbiddenByPolicyError } = require('../errors')

test('Remain silent if policy allows action.', () => {
  expect(() => ensureCanDeleteDocuments({ name: 'test', policy: { canDeleteDocuments: true } })).not.toThrow()
})

test('Raise error if policy disallows action.', () => {
  expect(() => ensureCanDeleteDocuments({ name: 'test', policy: {} })).toThrow(JsonotronActionForbiddenByPolicyError)
  expect(() => ensureCanDeleteDocuments({ name: 'test' })).toThrow(/delete document/)
})
