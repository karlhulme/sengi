/* eslint-env jest */
const ensureCanReplaceDocuments = require('./ensureCanReplaceDocuments')
const { JsonotronActionForbiddenByPolicyError } = require('../errors')

test('Remain silent if policy allows action.', () => {
  expect(() => ensureCanReplaceDocuments({ name: 'test', policy: { canReplaceDocuments: true } })).not.toThrow()
})

test('Raise error if policy disallows action.', () => {
  expect(() => ensureCanReplaceDocuments({ name: 'test', policy: {} })).toThrow(JsonotronActionForbiddenByPolicyError)
  expect(() => ensureCanReplaceDocuments({ name: 'test' })).toThrow(/replace document/)
})
