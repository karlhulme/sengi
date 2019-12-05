/* eslint-env jest */
const resolveParameterFieldIsArray = require('./resolveParameterFieldIsArray')

const docType = {
  fields: {
    propA: { isArray: true },
    propB: { isArray: false }
  }
}

test('Resolve parameter isArray property declared on the parameter.', () => {
  expect(resolveParameterFieldIsArray(docType, 'direct', { isArray: true })).toEqual(true)
})

test('Resolve parameter isArray property from referenced doc type field declarations.', () => {
  expect(resolveParameterFieldIsArray(docType, 'propA', { lookup: 'field' })).toEqual(true)
  expect(resolveParameterFieldIsArray(docType, 'propB', { lookup: 'field' })).toEqual(false)
})
