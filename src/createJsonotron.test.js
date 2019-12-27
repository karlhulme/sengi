/* eslint-env jest */
const createJsonotron = require('./createJsonotron')
const { JsonotronInsufficientPermissionsError } = require('./errors')

const createRequestWith = (propertyName, propertyValue) => {
  const req = {
    constructorParams: { propA: 'valueA' },
    docStoreOptions: { custom: 'prop' },
    doc: { id: 'abcd' },
    docTypeName: 'sale',
    fieldNames: ['fieldA', 'fieldB'],
    filterName: 'filterByProp',
    filterParams: { propA: 'valueA' },
    id: 'id_string',
    ids: ['id_string_1', 'id_string_2'],
    mergePatch: { propA: 'newValue' },
    operationId: 'opId_string',
    operationName: 'performAction',
    operationParams: { propA: 'valueA' },
    reqVersion: 'abcd',
    roleNames: ['admin']
  }

  if (typeof req[propertyName] !== 'undefined') {
    delete req[propertyName]
  }

  if (propertyValue !== 'undefined') {
    req[propertyName] = propertyValue
  }

  return req
}

test('A Jsonotron can be created given valid inputs.', () => {
  expect(() => createJsonotron({}, [], [])).not.toThrow()
  expect(() => createJsonotron({}, [], [], {})).not.toThrow()
  expect(() => createJsonotron({}, [], [], { customFieldTypes: [] })).not.toThrow()
  expect(() => createJsonotron({}, [], [], { onFieldsQueried: () => {} })).not.toThrow()
})

test('A Jsonotron can be created with invalid inputs or config.', () => {
  expect(() => createJsonotron('invalid', [], [], {})).toThrow(/docStore/)
  expect(() => createJsonotron({}, 'invalid', [], {})).toThrow(/docTypes/)
  expect(() => createJsonotron({}, [], 'invalid', {})).toThrow(/roleTypes/)
  expect(() => createJsonotron({}, [], [], 'invalid')).toThrow(/config/)
  expect(() => createJsonotron({}, [], [], { customFieldTypes: 123 })).toThrow(/config.customFieldTypes/)
  expect(() => createJsonotron({}, [], [], { onFieldsQueried: 123 })).toThrow(/config.onFieldsQueried/)
})

test('Reject a Jsonotron call without a request object.', async () => {
  const jsonotron = createJsonotron({}, [], [])
  await expect(jsonotron.queryDocuments()).rejects.toThrow(/req/)
  await expect(jsonotron.queryDocuments(null)).rejects.toThrow(/req/)
  await expect(jsonotron.queryDocuments([])).rejects.toThrow(/req/)
  await expect(jsonotron.queryDocuments(123)).rejects.toThrow(/req/)
})

test('A Jsonotron call with all the required inputs, but no roles, should only fail due to permissions.', async () => {
  const jsonotron = createJsonotron({}, [], [])
  await expect(jsonotron.createDocument(createRequestWith('all_props_valid'))).rejects.toThrow(JsonotronInsufficientPermissionsError)
  await expect(jsonotron.createDocument(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(JsonotronInsufficientPermissionsError)

  await expect(jsonotron.deleteDocument(createRequestWith('all_props_valid'))).rejects.toThrow(JsonotronInsufficientPermissionsError)
  await expect(jsonotron.deleteDocument(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(JsonotronInsufficientPermissionsError)

  await expect(jsonotron.operateOnDocument(createRequestWith('all_props_valid'))).rejects.toThrow(JsonotronInsufficientPermissionsError)
  await expect(jsonotron.operateOnDocument(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(JsonotronInsufficientPermissionsError)

  await expect(jsonotron.patchDocument(createRequestWith('all_props_valid'))).rejects.toThrow(JsonotronInsufficientPermissionsError)
  await expect(jsonotron.patchDocument(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(JsonotronInsufficientPermissionsError)

  await expect(jsonotron.queryDocuments(createRequestWith('all_props_valid'))).rejects.toThrow(JsonotronInsufficientPermissionsError)
  await expect(jsonotron.queryDocuments(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(JsonotronInsufficientPermissionsError)

  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('all_props_valid'))).rejects.toThrow(JsonotronInsufficientPermissionsError)
  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(JsonotronInsufficientPermissionsError)

  await expect(jsonotron.queryDocumentsByIds(createRequestWith('all_props_valid'))).rejects.toThrow(JsonotronInsufficientPermissionsError)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(JsonotronInsufficientPermissionsError)

  await expect(jsonotron.replaceDocument(createRequestWith('all_props_valid'))).rejects.toThrow(JsonotronInsufficientPermissionsError)
  await expect(jsonotron.replaceDocument(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

test('A Jsonotron call to createDocument will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({}, [], [])
  await expect(jsonotron.createDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.createDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.createDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.createDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.createDocument(createRequestWith('id', undefined))).rejects.toThrow(/id/)
  await expect(jsonotron.createDocument(createRequestWith('id', 123))).rejects.toThrow(/id/)
  await expect(jsonotron.createDocument(createRequestWith('constructorParams', undefined))).rejects.toThrow(/constructorParams/)
  await expect(jsonotron.createDocument(createRequestWith('constructorParams', 123))).rejects.toThrow(/constructorParams/)
  await expect(jsonotron.createDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
})

test('A Jsonotron call to deleteDocument will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({}, [], [])
  await expect(jsonotron.deleteDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.deleteDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.deleteDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.deleteDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.deleteDocument(createRequestWith('id', undefined))).rejects.toThrow(/id/)
  await expect(jsonotron.deleteDocument(createRequestWith('id', 123))).rejects.toThrow(/id/)
  await expect(jsonotron.deleteDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
})

test('A Jsonotron call to operateOnDocument will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({}, [], [])
  await expect(jsonotron.operateOnDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.operateOnDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.operateOnDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.operateOnDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.operateOnDocument(createRequestWith('id', undefined))).rejects.toThrow(/id/)
  await expect(jsonotron.operateOnDocument(createRequestWith('id', 123))).rejects.toThrow(/id/)
  await expect(jsonotron.operateOnDocument(createRequestWith('reqVersion', undefined))).rejects.toThrow(/reqVersion/)
  await expect(jsonotron.operateOnDocument(createRequestWith('reqVersion', 123))).rejects.toThrow(/reqVersion/)
  await expect(jsonotron.operateOnDocument(createRequestWith('operationId', undefined))).rejects.toThrow(/operationId/)
  await expect(jsonotron.operateOnDocument(createRequestWith('operationId', 123))).rejects.toThrow(/operationId/)
  await expect(jsonotron.operateOnDocument(createRequestWith('operationName', undefined))).rejects.toThrow(/operationName/)
  await expect(jsonotron.operateOnDocument(createRequestWith('operationName', 123))).rejects.toThrow(/operationName/)
  await expect(jsonotron.operateOnDocument(createRequestWith('operationParams', undefined))).rejects.toThrow(/operationParams/)
  await expect(jsonotron.operateOnDocument(createRequestWith('operationParams', 123))).rejects.toThrow(/operationParams/)
  await expect(jsonotron.operateOnDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
})

test('A Jsonotron call to patchDocument will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({}, [], [])
  await expect(jsonotron.patchDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.patchDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.patchDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.patchDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.patchDocument(createRequestWith('id', undefined))).rejects.toThrow(/id/)
  await expect(jsonotron.patchDocument(createRequestWith('id', 123))).rejects.toThrow(/id/)
  await expect(jsonotron.patchDocument(createRequestWith('reqVersion', undefined))).rejects.toThrow(/reqVersion/)
  await expect(jsonotron.patchDocument(createRequestWith('reqVersion', 123))).rejects.toThrow(/reqVersion/)
  await expect(jsonotron.patchDocument(createRequestWith('operationId', undefined))).rejects.toThrow(/operationId/)
  await expect(jsonotron.patchDocument(createRequestWith('operationId', 123))).rejects.toThrow(/operationId/)
  await expect(jsonotron.patchDocument(createRequestWith('mergePatch', undefined))).rejects.toThrow(/mergePatch/)
  await expect(jsonotron.patchDocument(createRequestWith('mergePatch', 123))).rejects.toThrow(/mergePatch/)
  await expect(jsonotron.patchDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
})

test('A Jsonotron call to queryDocuments will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({}, [], [])
  await expect(jsonotron.queryDocuments(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.queryDocuments(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.queryDocuments(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.queryDocuments(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.queryDocuments(createRequestWith('fieldNames', undefined))).rejects.toThrow(/fieldNames/)
  await expect(jsonotron.queryDocuments(createRequestWith('fieldNames', 123))).rejects.toThrow(/fieldNames/)
  await expect(jsonotron.queryDocuments(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
})

test('A Jsonotron call to queryDocumentsByFilter will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({}, [], [])
  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('fieldNames', undefined))).rejects.toThrow(/fieldNames/)
  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('fieldNames', 123))).rejects.toThrow(/fieldNames/)
  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('filterName', undefined))).rejects.toThrow(/filterName/)
  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('filterName', 123))).rejects.toThrow(/filterName/)
  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('filterParams', undefined))).rejects.toThrow(/filterParams/)
  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('filterParams', 123))).rejects.toThrow(/filterParams/)
  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
})

test('A Jsonotron call to queryDocumentsByIds will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({}, [], [])
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('fieldNames', undefined))).rejects.toThrow(/fieldNames/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('fieldNames', 123))).rejects.toThrow(/fieldNames/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('ids', undefined))).rejects.toThrow(/ids/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('ids', 123))).rejects.toThrow(/ids/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
})

test('A Jsonotron call to replaceDocument will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({}, [], [])
  await expect(jsonotron.replaceDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.replaceDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.replaceDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.replaceDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.replaceDocument(createRequestWith('doc', undefined))).rejects.toThrow(/doc/)
  await expect(jsonotron.replaceDocument(createRequestWith('doc', 123))).rejects.toThrow(/doc/)
  await expect(jsonotron.replaceDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
})