/* eslint-env jest */
const builtinFieldTypes = require('../builtinFieldTypes')
const testDocTypes = require('../entryPointTestData/docTypes')
const testFieldTypes = require('../entryPointTestData/fieldTypes')
const testRoleTypes = require('../entryPointTestData/roleTypes')
const { initValidatorCache, createCustomisedAjv } = require('../jsonValidation')
const { wrapDocStore } = require('../docStore')
const { combineCustomAndBuiltInFieldTypes } = require('../fieldTypes')

/**
 * Creates an object with the common properties required
 * to execute a request but without a document store backing.
 * @param {Object} mockedDocStoreTemplate An object where each key represents
 * a mocked method that should be monitored by the test runtime, and each
 * value represents the implementation of that method.
 */
const createTestRequestWithMockedDocStore = mockedDocStoreTemplate => {
  const fieldTypes = combineCustomAndBuiltInFieldTypes(builtinFieldTypes, testFieldTypes)

  const ajv = createCustomisedAjv()
  const validatorCache = initValidatorCache(ajv, testDocTypes, fieldTypes)

  const docStore = Object.keys(mockedDocStoreTemplate || {})
    .reduce((agg, key) => ({ ...agg, [key]: jest.fn(mockedDocStoreTemplate[key]) }), {})

  return {
    mockedDocStore: docStore,
    safeDocStore: wrapDocStore(docStore),
    docTypes: testDocTypes,
    fieldTypes,
    validatorCache,
    roleTypes: testRoleTypes
  }
}

test('createTestRequestWithMockedDocStore creates a valid object.', async () => {
  const req = createTestRequestWithMockedDocStore({ example: () => {} })
  expect(req).toHaveProperty('mockedDocStore')
  expect(req).toHaveProperty('safeDocStore')
  expect(req).toHaveProperty('docTypes')
  expect(req).toHaveProperty('fieldTypes')
  expect(req).toHaveProperty('validatorCache')
  expect(req).toHaveProperty('roleTypes')
})

module.exports = {
  createTestRequestWithMockedDocStore
}
