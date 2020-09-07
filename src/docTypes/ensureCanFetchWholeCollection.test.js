/* eslint-env jest */
import { ensureCanFetchWholeCollection } from './ensureCanFetchWholeCollection'
import { SengiActionForbiddenByPolicyError } from '../errors'

test('Remain silent if policy allows action.', () => {
  expect(() => ensureCanFetchWholeCollection({ name: 'test', policy: { canFetchWholeCollection: true } })).not.toThrow()
})

test('Raise error if policy disallows action.', () => {
  expect(() => ensureCanFetchWholeCollection({ name: 'test', policy: {} })).toThrow(SengiActionForbiddenByPolicyError)
  expect(() => ensureCanFetchWholeCollection({ name: 'test' })).toThrow(/fetch whole collection/)
})
