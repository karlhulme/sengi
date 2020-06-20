/* eslint-env jest */
const { builtinFieldTypes } = require('jsonotron-fields')
const { getJsonSchemaFragmentForFieldType } = require('../fieldTypes')
const createJsonSchemaDefinitionsSection = require('./createJsonSchemaDefinitionsSection')

const getJsonSchemaFragmentForFieldName = fieldTypeName => {
  const fieldType = builtinFieldTypes.find(ft => ft.name === fieldTypeName)
  return getJsonSchemaFragmentForFieldType(fieldType)
}

test('Build a JSON Schema definitions section.', () => {
  expect(createJsonSchemaDefinitionsSection(builtinFieldTypes, ['currencyCode', 'integer', 'money'])).toEqual({
    currencyCode: getJsonSchemaFragmentForFieldName('currencyCode'),
    integer: getJsonSchemaFragmentForFieldName('integer'),
    money: getJsonSchemaFragmentForFieldName('money')
  })
})

test('Fail to build a JSON Schema definitions section if a referenced type is not in the list of field types.', () => {
  expect(() => createJsonSchemaDefinitionsSection(builtinFieldTypes, ['invalid'])).toThrow(/Unable to find referenced field type/)
})
