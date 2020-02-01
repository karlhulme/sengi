/* eslint-env jest */
const { JsonotronInsufficientPermissionsError } = require('../errors')
const createJsonotron = require('./createJsonotron')

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
    reqProps: { custom: 'value' },
    reqVersion: 'abcd',
    roleNames: ['admin'],
    userIdentity: 'testUser'
  }

  if (typeof req[propertyName] !== 'undefined') {
    delete req[propertyName]
  }

  if (propertyValue !== 'undefined') {
    req[propertyName] = propertyValue
  }

  return req
}

const createCandidateDocTypesForSchemaGen = () => ([{
  name: 'candidate',
  pluralName: 'candidates',
  title: 'Candidate',
  pluralTitle: 'Candidates',
  fields: {
    propA: { type: 'string', description: 'A property.', example: 'abc' }
  },
  filters: {
    byProp: {
      description: 'Filter by prop',
      parameters: {},
      implementation: () => {}
    }
  },
  operations: {
    doSomething: {
      title: 'Do Something',
      description: 'Do a thing',
      parameters: {},
      implementation: () => {}
    }
  }
}])

test('A Jsonotron can be created given valid inputs.', () => {
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [] })).not.toThrow()
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], fieldTypes: [] })).not.toThrow()
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], dateTimeFunc: () => '2000-01-01T12:00:00Z' })).not.toThrow()
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], onPreSaveDoc: () => {} })).not.toThrow()
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], onQueryDocs: () => {} })).not.toThrow()
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], onCreateDoc: () => {} })).not.toThrow()
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], onUpdateDoc: () => {} })).not.toThrow()
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], onDeleteDoc: () => {} })).not.toThrow()
})

test('A Jsonotron cannot be created with invalid inputs or config.', () => {
  expect(() => createJsonotron('invalid')).toThrow(/config/)
  expect(() => createJsonotron({ docStore: 'invalid', docTypes: [], roleTypes: [] })).toThrow(/docStore/)
  expect(() => createJsonotron({ docStore: {}, docTypes: 'invalid', roleTypes: [] })).toThrow(/docTypes/)
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: 'invalid' })).toThrow(/roleTypes/)
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], fieldTypes: 123 })).toThrow(/config.fieldTypes/)
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], dateTimeFunc: 123 })).toThrow(/config.dateTimeFunc/)
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], onPreSaveDoc: 123 })).toThrow(/config.onPreSaveDoc/)
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], onQueryDocs: 123 })).toThrow(/config.onQueryDocs/)
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], onCreateDoc: 123 })).toThrow(/config.onCreateDoc/)
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], onUpdateDoc: 123 })).toThrow(/config.onUpdateDoc/)
  expect(() => createJsonotron({ docStore: {}, docTypes: [], roleTypes: [], onDeleteDoc: 123 })).toThrow(/config.onDeleteDoc/)
})

test('Reject a Jsonotron call without a request object.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(jsonotron.queryDocuments()).rejects.toThrow(/req/)
  await expect(jsonotron.queryDocuments(null)).rejects.toThrow(/req/)
  await expect(jsonotron.queryDocuments([])).rejects.toThrow(/req/)
  await expect(jsonotron.queryDocuments(123)).rejects.toThrow(/req/)
})

test('A Jsonotron call with all the required inputs, but no roles, should only fail due to permissions.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: [], roleTypes: [] })
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
  const jsonotron = createJsonotron({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(jsonotron.createDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.createDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.createDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.createDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.createDocument(createRequestWith('id', undefined))).rejects.toThrow(/id/)
  await expect(jsonotron.createDocument(createRequestWith('id', 123))).rejects.toThrow(/id/)
  await expect(jsonotron.createDocument(createRequestWith('constructorParams', undefined))).rejects.toThrow(/constructorParams/)
  await expect(jsonotron.createDocument(createRequestWith('constructorParams', 123))).rejects.toThrow(/constructorParams/)
  await expect(jsonotron.createDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(jsonotron.createDocument(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Jsonotron call to deleteDocument will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(jsonotron.deleteDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.deleteDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.deleteDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.deleteDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.deleteDocument(createRequestWith('id', undefined))).rejects.toThrow(/id/)
  await expect(jsonotron.deleteDocument(createRequestWith('id', 123))).rejects.toThrow(/id/)
  await expect(jsonotron.deleteDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(jsonotron.deleteDocument(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Jsonotron call to operateOnDocument will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(jsonotron.operateOnDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.operateOnDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.operateOnDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.operateOnDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.operateOnDocument(createRequestWith('id', undefined))).rejects.toThrow(/id/)
  await expect(jsonotron.operateOnDocument(createRequestWith('id', 123))).rejects.toThrow(/id/)
  await expect(jsonotron.operateOnDocument(createRequestWith('reqVersion', 123))).rejects.toThrow(/reqVersion/)
  await expect(jsonotron.operateOnDocument(createRequestWith('operationId', undefined))).rejects.toThrow(/operationId/)
  await expect(jsonotron.operateOnDocument(createRequestWith('operationId', 123))).rejects.toThrow(/operationId/)
  await expect(jsonotron.operateOnDocument(createRequestWith('operationName', undefined))).rejects.toThrow(/operationName/)
  await expect(jsonotron.operateOnDocument(createRequestWith('operationName', 123))).rejects.toThrow(/operationName/)
  await expect(jsonotron.operateOnDocument(createRequestWith('operationParams', undefined))).rejects.toThrow(/operationParams/)
  await expect(jsonotron.operateOnDocument(createRequestWith('operationParams', 123))).rejects.toThrow(/operationParams/)
  await expect(jsonotron.operateOnDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(jsonotron.operateOnDocument(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Jsonotron call to patchDocument will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(jsonotron.patchDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.patchDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.patchDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.patchDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.patchDocument(createRequestWith('id', undefined))).rejects.toThrow(/id/)
  await expect(jsonotron.patchDocument(createRequestWith('id', 123))).rejects.toThrow(/id/)
  await expect(jsonotron.patchDocument(createRequestWith('reqVersion', 123))).rejects.toThrow(/reqVersion/)
  await expect(jsonotron.patchDocument(createRequestWith('operationId', undefined))).rejects.toThrow(/operationId/)
  await expect(jsonotron.patchDocument(createRequestWith('operationId', 123))).rejects.toThrow(/operationId/)
  await expect(jsonotron.patchDocument(createRequestWith('mergePatch', undefined))).rejects.toThrow(/mergePatch/)
  await expect(jsonotron.patchDocument(createRequestWith('mergePatch', 123))).rejects.toThrow(/mergePatch/)
  await expect(jsonotron.patchDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(jsonotron.patchDocument(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Jsonotron call to queryDocuments will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(jsonotron.queryDocuments(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.queryDocuments(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.queryDocuments(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.queryDocuments(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.queryDocuments(createRequestWith('fieldNames', undefined))).rejects.toThrow(/fieldNames/)
  await expect(jsonotron.queryDocuments(createRequestWith('fieldNames', 123))).rejects.toThrow(/fieldNames/)
  await expect(jsonotron.queryDocuments(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(jsonotron.queryDocuments(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Jsonotron call to queryDocumentsByFilter will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: [], roleTypes: [] })
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
  await expect(jsonotron.queryDocumentsByFilter(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Jsonotron call to queryDocumentsByIds will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('fieldNames', undefined))).rejects.toThrow(/fieldNames/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('fieldNames', 123))).rejects.toThrow(/fieldNames/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('ids', undefined))).rejects.toThrow(/ids/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('ids', 123))).rejects.toThrow(/ids/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(jsonotron.queryDocumentsByIds(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Jsonotron call to replaceDocument will fail if required parameters are not provided.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(jsonotron.replaceDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.replaceDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(jsonotron.replaceDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.replaceDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(jsonotron.replaceDocument(createRequestWith('doc', undefined))).rejects.toThrow(/doc/)
  await expect(jsonotron.replaceDocument(createRequestWith('doc', 123))).rejects.toThrow(/doc/)
  await expect(jsonotron.replaceDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(jsonotron.replaceDocument(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Jsonotron engine can create a JSON schema for the constructor of document type.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: createCandidateDocTypesForSchemaGen(), roleTypes: [] })
  expect(() => jsonotron.createJsonSchemaForDocTypeConstructorParameters()).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeConstructorParameters({})).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeConstructorParameters({ docTypeName: 123 })).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeConstructorParameters({ docTypeName: 'invalid' })).toThrow(Error)
  expect(() => jsonotron.createJsonSchemaForDocTypeConstructorParameters({ docTypeName: 'candidate', fragment: 123 })).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeConstructorParameters({ docTypeName: 'candidate', externalDefs: 123 })).toThrow(TypeError)
  expect(jsonotron.createJsonSchemaForDocTypeConstructorParameters({ docTypeName: 'candidate' })).toEqual({
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Candidate "Constructor" JSON Schema',
    type: 'object',
    additionalProperties: false,
    properties: expect.anything(),
    required: expect.anything(),
    definitions: expect.anything()
  })
  expect(jsonotron.createJsonSchemaForDocTypeConstructorParameters({ docTypeName: 'candidate', fragment: true, externalDefs: '#/components/schemas/' })).toEqual({
    title: 'Candidate "Constructor" JSON Schema',
    type: 'object',
    additionalProperties: false,
    properties: expect.anything(),
    required: expect.anything()
  })
})

test('A Jsonotron engine can create a JSON schema for the parameters of a filter of a document type.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: createCandidateDocTypesForSchemaGen(), roleTypes: [] })
  expect(() => jsonotron.createJsonSchemaForDocTypeFilterParameters()).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeFilterParameters({})).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeFilterParameters({ docTypeName: 123, filterName: 'byProp' })).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeFilterParameters({ docTypeName: 'candidate', filterName: 123 })).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeFilterParameters({ docTypeName: 'invalid', filterName: 'byProp' })).toThrow(Error)
  expect(() => jsonotron.createJsonSchemaForDocTypeFilterParameters({ docTypeName: 'candidate', filterName: 'invalid' })).toThrow(Error)
  expect(jsonotron.createJsonSchemaForDocTypeFilterParameters({ docTypeName: 'candidate', filterName: 'byProp' })).toEqual({
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Candidate "Filter byProp" JSON Schema',
    type: 'object',
    additionalProperties: false,
    properties: expect.anything(),
    required: expect.anything(),
    definitions: expect.anything()
  })
  expect(jsonotron.createJsonSchemaForDocTypeFilterParameters({ docTypeName: 'candidate', filterName: 'byProp', fragment: true, externalDefs: '#/components/schemas/' })).toEqual({
    title: 'Candidate "Filter byProp" JSON Schema',
    type: 'object',
    additionalProperties: false,
    properties: expect.anything(),
    required: expect.anything()
  })
})

test('A Jsonotron engine can create a JSON schema for document type instance.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: createCandidateDocTypesForSchemaGen(), roleTypes: [] })
  expect(() => jsonotron.createJsonSchemaForDocTypeInstance()).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeInstance({})).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeInstance({ docTypeName: 123 })).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeInstance({ docTypeName: 'invalid' })).toThrow(Error)
  expect(jsonotron.createJsonSchemaForDocTypeInstance({ docTypeName: 'candidate' })).toEqual({
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Candidate JSON Schema',
    type: 'object',
    additionalProperties: true,
    properties: expect.anything(),
    required: expect.anything(),
    definitions: expect.anything()
  })
  expect(jsonotron.createJsonSchemaForDocTypeInstance({ docTypeName: 'candidate', fragment: true, externalDefs: '#/components/schemas/' })).toEqual({
    title: 'Candidate JSON Schema',
    type: 'object',
    additionalProperties: true,
    properties: expect.anything(),
    required: expect.anything()
  })
})

test('A Jsonotron engine can create a JSON schema for a merge patch of document type.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: createCandidateDocTypesForSchemaGen(), roleTypes: [] })
  expect(() => jsonotron.createJsonSchemaForDocTypeMergePatch()).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeMergePatch({})).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeMergePatch({ docTypeName: 123 })).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeMergePatch({ docTypeName: 'invalid' })).toThrow(Error)
  expect(jsonotron.createJsonSchemaForDocTypeMergePatch({ docTypeName: 'candidate' })).toEqual({
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Candidate "Merge Patch" JSON Schema',
    type: 'object',
    additionalProperties: false,
    properties: expect.anything(),
    definitions: expect.anything()
  })
  expect(jsonotron.createJsonSchemaForDocTypeMergePatch({ docTypeName: 'candidate', fragment: true, externalDefs: '#/components/schemas/' })).toEqual({
    title: 'Candidate "Merge Patch" JSON Schema',
    type: 'object',
    additionalProperties: false,
    properties: expect.anything()
  })
})

test('A Jsonotron engine can create a JSON schema for the parameters of an operation of a document type.', async () => {
  const jsonotron = createJsonotron({ docStore: {}, docTypes: createCandidateDocTypesForSchemaGen(), roleTypes: [] })
  expect(() => jsonotron.createJsonSchemaForDocTypeOperationParameters()).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeOperationParameters({})).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeOperationParameters({ docTypeName: 123, operationName: 'doSomething' })).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeOperationParameters({ docTypeName: 'candidate', operationName: 123 })).toThrow(TypeError)
  expect(() => jsonotron.createJsonSchemaForDocTypeOperationParameters({ docTypeName: 'invalid', operationName: 'doSomething' })).toThrow(Error)
  expect(() => jsonotron.createJsonSchemaForDocTypeOperationParameters({ docTypeName: 'candidate', operationName: 'invalid' })).toThrow(Error)
  expect(jsonotron.createJsonSchemaForDocTypeOperationParameters({ docTypeName: 'candidate', operationName: 'doSomething' })).toEqual({
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Candidate "Operation doSomething" JSON Schema',
    type: 'object',
    additionalProperties: false,
    properties: expect.anything(),
    required: expect.anything(),
    definitions: expect.anything()
  })
  expect(jsonotron.createJsonSchemaForDocTypeOperationParameters({ docTypeName: 'candidate', operationName: 'doSomething', fragment: true, externalDefs: '#/components/schemas/' })).toEqual({
    title: 'Candidate "Operation doSomething" JSON Schema',
    type: 'object',
    additionalProperties: false,
    properties: expect.anything(),
    required: expect.anything()
  })
})
