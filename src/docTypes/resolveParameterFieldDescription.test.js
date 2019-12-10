/* eslint-env jest */
const resolveParameterFieldDescription = require('./resolveParameterFieldDescription')

const docType = {
  fields: {
    propA: { description: 'This is prop A.' },
    propB: { description: 'This is prop B.' }
  }
}

test('Resolve parameter description declared on the parameter.', () => {
  expect(resolveParameterFieldDescription(docType, 'direct', { description: 'This is direct.' })).toEqual('This is direct.')
})

test('Resolve parameter description that reference doc type field declarations.', () => {
  expect(resolveParameterFieldDescription(docType, 'propA', { lookup: 'field' })).toEqual('This is prop A.')
  expect(resolveParameterFieldDescription(docType, 'propB', { lookup: 'field' })).toEqual('This is prop B.')
})

test('Resolve parameter description that is override on parameter.', () => {
  expect(resolveParameterFieldDescription(docType, 'propA', { lookup: 'field', description: 'This is a custom description.' })).toEqual('This is a custom description.')
})
