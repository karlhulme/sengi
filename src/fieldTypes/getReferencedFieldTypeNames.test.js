/* eslint-env jest */
const { JsonotronFieldTypeResolutionError } = require('../errors')
const getReferencedFieldTypeNames = require('./getReferencedFieldTypeNames')

const fieldTypes = [{
  name: 'top',
  referencedFieldTypes: ['middle']
}, {
  name: 'middle',
  referencedFieldTypes: ['bottom']
}, {
  name: 'bottom'
}]

test('Check referenced field types can be identified.', () => {
  expect(getReferencedFieldTypeNames(fieldTypes, ['top'])).toEqual(['top', 'middle', 'bottom'])
  expect(getReferencedFieldTypeNames(fieldTypes, ['middle'])).toEqual(['middle', 'bottom'])
  expect(getReferencedFieldTypeNames(fieldTypes, ['bottom'])).toEqual(['bottom'])
})

test('Check unrecognised field types are identified.', () => {
  expect(() => getReferencedFieldTypeNames(fieldTypes, ['madeup'])).toThrow(JsonotronFieldTypeResolutionError)
  expect(() => getReferencedFieldTypeNames(fieldTypes, ['madeup'])).toThrow(/madeup/)
})