import { test, expect, jest } from '@jest/globals'
import { testDocTypes } from '../testData/docTypes'
import { testEnumTypes } from '../testData/enumTypes'
import { testSchemaTypes } from '../testData/schemaTypes'
import { testRoleTypes } from '../testData/roleTypes'
import { createSengi } from './createSengi'

/**
 * Creates a sengi object with a mocked doc store based on the
 * given functions.
 * @param {Object} mockedDocStoreTemplate An object where each key represents
 * a mocked method that should be monitored by the test runtime, and each
 * value represents the implementation of that method.
 * @param {Object} funcs A block of functions that can be invoked by
 * sengi to signal events have taken place.
 */
export const createSengiWithMockStore = (mockedDocStoreTemplate, funcs) => {
  const docStore = Object.keys(mockedDocStoreTemplate || {})
    .reduce((agg, key) => ({ ...agg, [key]: jest.fn(mockedDocStoreTemplate[key]) }), {})

  const config = {
    docStore,
    enumTypes: testEnumTypes,
    schemaTypes: testSchemaTypes,
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

  const sengi = createSengi(config)

  sengi._test = { config, docStore }

  return sengi
}

export const defaultRequestProps = {
  userIdentity: 'testUser',
  roleNames: ['admin'],
  reqProps: { foo: 'bar' },
  docStoreOptions: { custom: 'prop' }
}

test('createSengiWithMockStore creates a valid sengi object.', async () => {
  const sengi = createSengiWithMockStore({})
  expect(sengi._test).toHaveProperty('config')
  expect(sengi._test).toHaveProperty('docStore')
})
