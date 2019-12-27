/* eslint-env jest */
const { JsonotronInvalidMergePatchError } = require('../errors')
const ensureMergePatchAvoidsSystemFields = require('./ensureMergePatchAvoidsSystemFields')

test('Accept patches that contain declared fields.', () => {
  expect(() => ensureMergePatchAvoidsSystemFields({ fieldA: 'hello', fieldB: 123 })).not.toThrow()
})

test('Reject patches that reference system fields.', () => {
  expect(() => ensureMergePatchAvoidsSystemFields({ id: 'abc' })).toThrow(/Cannot reference a system field 'id'/)
  expect(() => ensureMergePatchAvoidsSystemFields({ docType: 'exampleDocType' })).toThrow(JsonotronInvalidMergePatchError)
  expect(() => ensureMergePatchAvoidsSystemFields({ docOps: [] })).toThrow(JsonotronInvalidMergePatchError)
})