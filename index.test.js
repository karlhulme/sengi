/* eslint-env jest */
const mdl = require('./index')

test('A createJsonotron function is exported from the module.', () => {
  expect(mdl).toHaveProperty('createJsonotron')
})

// test('Functions for building json schemas are exported from the module.', () => {
//   expect(mdl).toHaveProperty('createJsonSchemaForDocTypeConstructorParameters')
//   expect(mdl).toHaveProperty('createJsonSchemaForDocTypeInstance')
//   expect(mdl).toHaveProperty('createJsonSchemaForDocTypeMergePatch')
//   expect(mdl).toHaveProperty('createJsonSchemaForDocTypeOperationParameters')
// })

test('An errors object is exported from the module.', () => {
  expect(mdl).toHaveProperty('errors')
  expect(mdl.errors).toHaveProperty('JsonotronDocStoreFailureError')
  expect(mdl.errors).toHaveProperty('JsonotronCalculatedFieldFailedError')
  expect(mdl.errors).toHaveProperty('JsonotronInternalError')
  expect(mdl.errors).toHaveProperty('JsonotronUnrecognisedFieldNameError')
})
