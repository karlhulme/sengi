import { expect, test } from '@jest/globals'
import { applyPatch } from './applyPatch'

test('Replace an attribute.', () => {
  const subject = { a: 'b' }
  applyPatch(subject, { a: 'c' })
  expect(subject).toEqual({ a: 'c' })
})

test('Add an attribute.', () => {
  const subject = { a: 'b' }
  applyPatch(subject, { b: 'c' })
  expect(subject).toEqual({ a: 'b', b: 'c' })
})

test('Delete attribute.', () => {
  const subject = { a: 'b', c: 'd' }
  applyPatch(subject, { a: null })
  expect(subject).toEqual({ c: 'd'})
})
