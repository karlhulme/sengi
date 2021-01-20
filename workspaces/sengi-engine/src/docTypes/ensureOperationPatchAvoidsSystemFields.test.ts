import { expect, test } from '@jest/globals'
import { SengiInvalidOperationPatchError } from 'sengi-interfaces'
import { ensureOperationPatchAvoidsSystemFields } from './ensureOperationPatchAvoidsSystemFields'

test('Accept patches returned from operations that contain declared fields.', () => {
  expect(() => ensureOperationPatchAvoidsSystemFields('test', 'someOp', { fieldA: 'hello', fieldB: 123 })).not.toThrow()
})

test('Reject patches returned from operations that reference the id field.', () => {
  try {
    ensureOperationPatchAvoidsSystemFields('test', 'someOp', { id: 'abc' })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInvalidOperationPatchError)
    expect(err.message).toMatch(/id/)
  }
})

test('Reject patches returned from operations that reference the docType field.', () => {
  try {
    ensureOperationPatchAvoidsSystemFields('test', 'someOp', { docType: 'abc' })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInvalidOperationPatchError)
    expect(err.message).toMatch(/docType/)
  }
})

test('Reject patches returned from operations that reference the docOps field.', () => {
  try {
    ensureOperationPatchAvoidsSystemFields('test', 'someOp', { docOps: [] })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInvalidOperationPatchError)
    expect(err.message).toMatch(/docOps/)
  }
})

test('Reject patches returned from operations that reference the docVersion field.', () => {
  try {
    ensureOperationPatchAvoidsSystemFields('test', 'someOp', { docVersion: 'abc' })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInvalidOperationPatchError)
    expect(err.message).toMatch(/docVersion/)
  }
})
