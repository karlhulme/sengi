/* eslint-env jest */
const resolveParameterFieldTypeName = require('./resolveParameterFieldTypeName')

const docType = {
  fields: {
    propA: { type: 'string' },
    propB: { type: 'number' },
    propC: { ref: 'doc2' }
  }
}

test('Resolve parameter types declared on the parameter.', () => {
  expect(resolveParameterFieldTypeName(docType, 'direct', { type: 'boolean' })).toEqual('boolean')
})

test('Resolve parameter types that reference doc type field declarations.', () => {
  expect(resolveParameterFieldTypeName(docType, 'propA', { lookup: 'field' })).toEqual('string')
  expect(resolveParameterFieldTypeName(docType, 'propB', { lookup: 'field' })).toEqual('number')
})

test('Resolve parameter types that reference other documents in a lookup.', () => {
  expect(resolveParameterFieldTypeName(docType, 'propC', { lookup: 'field' })).toEqual('docId')
})
