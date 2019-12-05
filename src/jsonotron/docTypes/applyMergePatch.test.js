/* eslint-env jest */
const applyMergePatch = require('./applyMergePatch')

test('Reject a patch if the subject is not an object.', () => {
  expect(() => applyMergePatch(null, { a: 'b' })).toThrow()
  expect(() => applyMergePatch(123, { a: 'b' })).toThrow()
  expect(() => applyMergePatch(true, { a: 'b' })).toThrow()
  expect(() => applyMergePatch('hello', { a: 'b' })).toThrow()
  expect(() => applyMergePatch(['a', 'b'], { a: 'b' })).toThrow()
})

test('Replace an attribute.', () => {
  const subject = { a: 'b' }
  applyMergePatch(subject, { a: 'c' })
  expect(subject).toEqual({ a: 'c' })
})

test('Add an attribute.', () => {
  const subject = { a: 'b' }
  applyMergePatch(subject, { b: 'c' })
  expect(subject).toEqual({ a: 'b', b: 'c' })
})

test('Delete attribute.', () => {
  const subject = { a: 'b' }
  applyMergePatch(subject, { a: null })
  expect(subject).toEqual({})
})

test('Delete attribute without affecting others.', () => {
  const subject = { a: 'b', b: 'c' }
  applyMergePatch(subject, { a: null })
  expect(subject).toEqual({ b: 'c' })
})

test('Replace array with a string.', () => {
  const subject = { a: ['b'] }
  applyMergePatch(subject, { a: 'c' })
  expect(subject).toEqual({ a: 'c' })
})

test('Replace a string with an array.', () => {
  const subject = { a: 'c' }
  applyMergePatch(subject, { a: ['b'] })
  expect(subject).toEqual({ a: ['b'] })
})

test('Apply recursively.', () => {
  const subject = { a: { b: 'c' } }
  applyMergePatch(subject, { a: { b: 'd', c: null } })
  expect(subject).toEqual({ a: { b: 'd' } })
})

test('Replace an object array with a number array.', () => {
  const subject = { a: [{ b: 'c' }] }
  applyMergePatch(subject, { a: [1] })
  expect(subject).toEqual({ a: [1] })
})

test('Not set an attribute to null in a sub object.', () => {
  const subject = {}
  applyMergePatch(subject, { a: { bb: { ccc: null } } })
  expect(subject).toEqual({ a: { bb: {} } })
})
