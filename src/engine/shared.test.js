/* eslint-env jest */
const testDocTypes = require('../testData/docTypes')
const testEnumTypes = require('../testData/enumTypes')
const testFieldTypes = require('../testData/fieldTypes')
const testRoleTypes = require('../testData/roleTypes')
const createJsonotron = require('./createJsonotron')

/**
 * Creates a jsonotron object with a mocked doc store based on the
 * given functions.
 * @param {Object} mockedDocStoreTemplate An object where each key represents
 * a mocked method that should be monitored by the test runtime, and each
 * value represents the implementation of that method.
 * @param {Object} funcs A block of functions that can be invoked by
 * jsonotron to signal events have taken place.
 */
const createJsonotronWithMockStore = (mockedDocStoreTemplate, funcs) => {
  const docStore = Object.keys(mockedDocStoreTemplate || {})
    .reduce((agg, key) => ({ ...agg, [key]: jest.fn(mockedDocStoreTemplate[key]) }), {})

  const config = {
    docStore,
    enumTypes: testEnumTypes,
    fieldTypes: testFieldTypes,
    docTypes: testDocTypes,
    roleTypes: testRoleTypes,
    dateTimeFunc: () => '2020-01-01T14:22:03Z'
  }

  if (funcs) {
    if (funcs.onPreSaveDoc) { config.onPreSaveDoc = funcs.onPreSaveDoc }
    if (funcs.onQueryDocs) { config.onQueryDocs = funcs.onQueryDocs }
    if (funcs.onCreateDoc) { config.onCreateDoc = funcs.onCreateDoc }
    if (funcs.onUpdateDoc) { config.onUpdateDoc = funcs.onUpdateDoc }
    if (funcs.onDeleteDoc) { config.onDeleteDoc = funcs.onDeleteDoc }
  }

  const jsonotron = createJsonotron(config)

  jsonotron._test = { config, docStore }

  return jsonotron
}

const defaultRequestProps = {
  userIdentity: 'testUser',
  roleNames: ['admin'],
  reqProps: { foo: 'bar' },
  docStoreOptions: { custom: 'prop' }
}

test('createJsonotronWithMockStore creates a valid jsonotron object.', async () => {
  const jsonotron = createJsonotronWithMockStore({})
  expect(jsonotron._test).toHaveProperty('config')
  expect(jsonotron._test).toHaveProperty('docStore')
})

module.exports = {
  createJsonotronWithMockStore,
  defaultRequestProps
}
