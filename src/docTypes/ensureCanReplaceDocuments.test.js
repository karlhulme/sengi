/* eslint-env jest */
import { ensureCanReplaceDocuments } from './ensureCanReplaceDocuments'
import { JsonotronActionForbiddenByPolicyError } from '../jsonotron-errors'

test('Remain silent if policy allows action.', () => {
  expect(() => ensureCanReplaceDocuments({ name: 'test', policy: { canReplaceDocuments: true } })).not.toThrow()
})

test('Raise error if policy disallows action.', () => {
  expect(() => ensureCanReplaceDocuments({ name: 'test', policy: {} })).toThrow(JsonotronActionForbiddenByPolicyError)
  expect(() => ensureCanReplaceDocuments({ name: 'test' })).toThrow(/replace document/)
})
