import { expect, test } from '@jest/globals'
import { SengiInvalidOperationMergePatchError } from 'sengi-interfaces'
import { ensureOperationMergePatchAvoidsSystemFields } from './ensureOperationMergePatchAvoidsSystemFields'

test('Accept patches returned from operations that contain declared fields.', () => {
  expect(() => ensureOperationMergePatchAvoidsSystemFields('test', 'someOp', { fieldA: 'hello', fieldB: 123 })).not.toThrow()
})

test('Reject patches returned from operations that reference the id field.', () => {
  try {
    ensureOperationMergePatchAvoidsSystemFields('test', 'someOp', { id: 'abc' })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInvalidOperationMergePatchError)
    expect(err.message).toMatch(/id/)
  }
})

test('Reject patches returned from operations that reference the docType field.', () => {
  try {
    ensureOperationMergePatchAvoidsSystemFields('test', 'someOp', { docType: 'abc' })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInvalidOperationMergePatchError)
    expect(err.message).toMatch(/docType/)
  }
})

test('Reject patches returned from operations that reference the docOps field.', () => {
  try {
    ensureOperationMergePatchAvoidsSystemFields('test', 'someOp', { docOps: [] })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInvalidOperationMergePatchError)
    expect(err.message).toMatch(/docOps/)
  }
})

test('Reject patches returned from operations that reference the docVersion field.', () => {
  try {
    ensureOperationMergePatchAvoidsSystemFields('test', 'someOp', { docVersion: 'abc' })
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiInvalidOperationMergePatchError)
    expect(err.message).toMatch(/docVersion/)
  }
})
