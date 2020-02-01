/* eslint-env jest */
const createJsonSchemaForDocTypeFieldNonArrayProperty = require('./createJsonSchemaForDocTypeFieldNonArrayProperty')

test('Create JSON schema for a doc type field non array property.', () => {
  expect(createJsonSchemaForDocTypeFieldNonArrayProperty({ description: 'my field type.' }, 'myFieldType', '#/components/schemas/')).toEqual({
    $ref: '#/components/schemas/myFieldType',
    description: 'my field type.'
  })
})
