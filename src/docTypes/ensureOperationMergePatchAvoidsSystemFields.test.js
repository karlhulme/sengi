/* eslint-env jest */
const ensureOperationMergePatchAvoidsSystemFields = require('./ensureOperationMergePatchAvoidsSystemFields')
const { JsonotronInvalidOperationMergePatchError } = require('../errors')

test('Accept operation patches that contain declared fields.', () => {
  expect(() => ensureOperationMergePatchAvoidsSystemFields('test', 'doSomething', { fieldA: 'hello', fieldB: 123 })).not.toThrow()
})

test('Reject operation patches that reference system fields.', () => {
  expect(() => ensureOperationMergePatchAvoidsSystemFields('test', 'doSomething', { id: 'abc' })).toThrow(/Cannot reference a system field 'id'/)
  expect(() => ensureOperationMergePatchAvoidsSystemFields('test', 'doSomething', { docType: 'exampleDocType' })).toThrow(JsonotronInvalidOperationMergePatchError)
  expect(() => ensureOperationMergePatchAvoidsSystemFields('test', 'doSomething', { sys: 'invalid' })).toThrow(JsonotronInvalidOperationMergePatchError)
})
