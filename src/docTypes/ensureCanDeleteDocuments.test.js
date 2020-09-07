/* eslint-env jest */
import { ensureCanDeleteDocuments } from './ensureCanDeleteDocuments'
import { SengiActionForbiddenByPolicyError } from '../errors'

test('Remain silent if policy allows action.', () => {
  expect(() => ensureCanDeleteDocuments({ name: 'test', policy: { canDeleteDocuments: true } })).not.toThrow()
})

test('Raise error if policy disallows action.', () => {
  expect(() => ensureCanDeleteDocuments({ name: 'test', policy: {} })).toThrow(SengiActionForbiddenByPolicyError)
  expect(() => ensureCanDeleteDocuments({ name: 'test' })).toThrow(/delete document/)
})
