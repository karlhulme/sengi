/* eslint-env jest */
const builtinFieldTypes = require('../builtinFieldTypes')
const { getJsonSchemaFragmentForFieldType } = require('../fieldTypes')
const createJsonSchemaForDocTypeFunctionParameters = require('./createJsonSchemaForDocTypeFunctionParameters')

const docType = {
  name: 'map',
  title: 'Map',
  fields: {
    cost: { type: 'money', isRequired: true, description: 'The cost of the map.' },
    sizeInMetresSquares: { type: 'integer', description: 'The size of the map.' },
    placesCount: { type: 'integer', description: 'The number of places covered.' },
    neighbouringMapId: { ref: 'map', description: 'The id of a neighbouring map.' },
    baseList: { type: 'integer', isArray: true, description: 'Base list of numbers.' }
  },
  filters: {
    bySize: {
      parameters: {
        cost: { lookup: 'field', description: 'Approx cost.', isRequired: true },
        maxSize: { type: 'integer', description: 'Max size.' },
        neighbouringMapId: { lookup: 'field', isRequired: true },
        listOfNumbers: { type: 'integer', isArray: true, description: 'A list of numbers.' },
        baseList: { lookup: 'field' }
      }
    }
  }
}

const getJsonSchemaFragmentForFieldName = fieldTypeName => {
  const fieldType = builtinFieldTypes.find(ft => ft.name === fieldTypeName)
  return getJsonSchemaFragmentForFieldType(fieldType)
}

test('Build a JSON Schema for doc type function parameter.', () => {
  expect(createJsonSchemaForDocTypeFunctionParameters(docType, 'Filter bySize', docType.filters.bySize.parameters, builtinFieldTypes)).toEqual({
    title: 'Map "Filter bySize" JSON Schema',
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    additionalProperties: false,
    properties: {
      cost: { $ref: '#/definitions/money', description: 'Approx cost.' },
      maxSize: { $ref: '#/definitions/integer', description: 'Max size.' },
      neighbouringMapId: { $ref: '#/definitions/docId', description: 'The id of a neighbouring map.' },
      listOfNumbers: { type: 'array', items: { $ref: '#/definitions/integer' }, description: 'A list of numbers.' },
      baseList: { type: 'array', items: { $ref: '#/definitions/integer' }, description: 'Base list of numbers.' }
    },
    required: ['cost', 'neighbouringMapId'],
    definitions: {
      currencyCode: getJsonSchemaFragmentForFieldName('currencyCode'),
      docId: getJsonSchemaFragmentForFieldName('docId'),
      integer: getJsonSchemaFragmentForFieldName('integer'),
      money: getJsonSchemaFragmentForFieldName('money')
    }
  })
})

test('Build a JSON Schema for empty function parameter.', () => {
  expect(createJsonSchemaForDocTypeFunctionParameters(docType, 'Filter byNothing', {}, builtinFieldTypes)).toEqual({
    title: 'Map "Filter byNothing" JSON Schema',
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    additionalProperties: false,
    properties: {},
    required: [],
    definitions: {}
  })
})
