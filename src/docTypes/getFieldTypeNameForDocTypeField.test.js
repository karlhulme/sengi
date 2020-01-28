/* eslint-env jest */
const getFieldTypeNameForDocTypeField = require('./getFieldTypeNameForDocTypeField')

const docType = {
  fields: {
    simple: { type: 'number' },
    link: { ref: 'map' },
    ambiguous: {}
  }
}

test('Get field type for doc type declared fields.', () => {
  expect(getFieldTypeNameForDocTypeField(docType.fields.simple)).toEqual('number')
})

test('Get field type for doc type ref fields.', () => {
  expect(getFieldTypeNameForDocTypeField(docType.fields.link)).toEqual('sysId')
})

test('Fail to get the field type for a field with neither type nor ref.', () => {
  expect(() => getFieldTypeNameForDocTypeField(docType.fields.ambiguous)).toThrow(/Field does not specify a type or a reference/)
})
