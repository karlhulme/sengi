/* eslint-env jest */
const { createMemDocStore } = require('jsonotron-memdocstore')
const builtinDocTypes = require('../builtinDocTypes')
const builtinFieldTypes = require('../builtinFieldTypes')
const testDocs = require('../entryPointTestData/docs')
const testDocTypes = require('../entryPointTestData/docTypes')
const testFieldTypes = require('../entryPointTestData/fieldTypes')
const testRoleTypes = require('../entryPointTestData/roleTypes')
const { initValidatorCache, createCustomisedAjv } = require('../jsonValidation')
const { wrapDocStore } = require('../docStore')
const { combineCustomAndBuiltInFieldTypes } = require('../fieldTypes')

/**
 * Creates an object with the common properties required
 * to execute a request against a document store.
 */
const createTestRequest = () => {
  const fieldTypes = combineCustomAndBuiltInFieldTypes(builtinFieldTypes, testFieldTypes)
  const docTypes = builtinDocTypes.concat(testDocTypes)

  const ajv = createCustomisedAjv()
  const validatorCache = initValidatorCache(ajv, docTypes, fieldTypes)

  const docs = JSON.parse(JSON.stringify(testDocs))
  const safeDocStore = wrapDocStore(createMemDocStore(docs, d => 'Version1'))

  return {
    safeDocStore,
    docStoreDocs: docs,
    docTypes,
    fieldTypes,
    validatorCache,
    roleTypes: testRoleTypes,
    onFieldsQueried: v => null
  }
}

test('createTestRequest creates a valid object.', async () => {
  const req = createTestRequest()
  expect(req).toHaveProperty('safeDocStore')
  expect(req).toHaveProperty('docStoreDocs')
  expect(req).toHaveProperty('docTypes')
  expect(req).toHaveProperty('fieldTypes')
  expect(req).toHaveProperty('validatorCache')
  expect(req).toHaveProperty('roleTypes')
  expect(req).toHaveProperty('onFieldsQueried')
})

/**
 * Creates an object with the common properties required
 * to execute a request but without a document store backing.
 * @param {Object} mockedDocStoreTemplate An object where each key represents
 * a mocked method that should be monitored by the test runtime, and each
 * value represents the implementation of that method.
 */
const createTestRequestWithMockedDocStore = mockedDocStoreTemplate => {
  const fieldTypes = combineCustomAndBuiltInFieldTypes(builtinFieldTypes, testFieldTypes)
  const docTypes = builtinDocTypes.concat(testDocTypes)

  const ajv = createCustomisedAjv()
  const validatorCache = initValidatorCache(ajv, docTypes, fieldTypes)

  const docStore = Object.keys(mockedDocStoreTemplate || {})
    .reduce((agg, key) => ({ ...agg, [key]: jest.fn(mockedDocStoreTemplate[key]) }), {})

  return {
    mockedDocStore: docStore,
    safeDocStore: wrapDocStore(docStore),
    docTypes,
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
  createTestRequest,
  createTestRequestWithMockedDocStore
}
