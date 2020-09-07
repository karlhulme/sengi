/* eslint-env jest */
import { SengiInsufficientPermissionsError } from '../errors'
import { Sengi } from './Sengi'

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

const createCandidateDocTypes = () => ([{
  name: 'candidate',
  pluralName: 'candidates',
  title: 'Candidate',
  pluralTitle: 'Candidates',
  fields: {
    propA: { type: 'string' }
  },
  filters: {
    byProp: {
      parameters: {},
      implementation: () => {}
    }
  },
  operations: {
    doSomething: {
      parameters: {},
      implementation: () => {}
    }
  }
}])

const createCandidateRoleTypes = () => ([{
  name: 'admin',
  docPermissions: true
}])

test('A Sengi can be created given valid inputs.', () => {
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [] })).not.toThrow()
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], schemaTypes: [] })).not.toThrow()
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], formatValidators: [] })).not.toThrow()
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], dateTimeFunc: () => '2000-01-01T12:00:00Z' })).not.toThrow()
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], onPreSaveDoc: () => {} })).not.toThrow()
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], onQueryDocs: () => {} })).not.toThrow()
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], onCreateDoc: () => {} })).not.toThrow()
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], onUpdateDoc: () => {} })).not.toThrow()
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], onDeleteDoc: () => {} })).not.toThrow()
})

test('A Sengi can be queried for document types.', () => {
  const sengi = new Sengi({ docStore: {}, docTypes: createCandidateDocTypes(), roleTypes: [] })
  expect(sengi.getDocTypeNames()).toEqual(['candidate'])
})

test('A Sengi can be queried for enum types.', () => {
  const sengi = new Sengi({ docStore: {}, docTypes: [], roleTypes: [] })
  expect(sengi.getEnumTypeNames()).toEqual(expect.arrayContaining(['boolean', 'callingCode', 'monthOfYear']))
})

test('A Sengi can be queried for field types.', () => {
  const sengi = new Sengi({ docStore: {}, docTypes: [], roleTypes: [] })
  expect(sengi.getSchemaTypeNames()).toEqual(expect.arrayContaining(['integer', 'money', 'paymentCardNo', 'uuid']))
})

test('A Sengi can be queried for field types.', () => {
  const sengi = new Sengi({ docStore: {}, docTypes: [], roleTypes: createCandidateRoleTypes() })
  expect(sengi.getRoleTypeNames()).toEqual(['admin'])
})

test('A Sengi cannot be created with invalid inputs or config.', () => {
  expect(() => new Sengi()).toThrow()
  expect(() => new Sengi({})).toThrow()
  expect(() => new Sengi({ docStore: 'invalid', docTypes: [], roleTypes: [] })).toThrow(/docStore/)
  expect(() => new Sengi({ docStore: {}, docTypes: 'invalid', roleTypes: [] })).toThrow(/docTypes/)
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: 'invalid' })).toThrow(/roleTypes/)
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], enumTypes: 123 })).toThrow(/config.enumTypes/)
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], schemaTypes: 123 })).toThrow(/config.schemaTypes/)
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], formatValidators: 123 })).toThrow(/config.formatValidators/)
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], dateTimeFunc: 123 })).toThrow(/config.dateTimeFunc/)
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], onPreSaveDoc: 123 })).toThrow(/config.onPreSaveDoc/)
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], onQueryDocs: 123 })).toThrow(/config.onQueryDocs/)
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], onCreateDoc: 123 })).toThrow(/config.onCreateDoc/)
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], onUpdateDoc: 123 })).toThrow(/config.onUpdateDoc/)
  expect(() => new Sengi({ docStore: {}, docTypes: [], roleTypes: [], onDeleteDoc: 123 })).toThrow(/config.onDeleteDoc/)
})

test('Reject a Sengi call without a request object.', async () => {
  const sengi = new Sengi({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(sengi.queryDocuments()).rejects.toThrow(/req/)
  await expect(sengi.queryDocuments(null)).rejects.toThrow(/req/)
  await expect(sengi.queryDocuments([])).rejects.toThrow(/req/)
  await expect(sengi.queryDocuments(123)).rejects.toThrow(/req/)
})

test('A Sengi call with all the required inputs, but no roles, should only fail due to permissions.', async () => {
  const sengi = new Sengi({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(sengi.createDocument(createRequestWith('all_props_valid'))).rejects.toThrow(SengiInsufficientPermissionsError)
  await expect(sengi.createDocument(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(SengiInsufficientPermissionsError)

  await expect(sengi.deleteDocument(createRequestWith('all_props_valid'))).rejects.toThrow(SengiInsufficientPermissionsError)
  await expect(sengi.deleteDocument(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(SengiInsufficientPermissionsError)

  await expect(sengi.operateOnDocument(createRequestWith('all_props_valid'))).rejects.toThrow(SengiInsufficientPermissionsError)
  await expect(sengi.operateOnDocument(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(SengiInsufficientPermissionsError)

  await expect(sengi.patchDocument(createRequestWith('all_props_valid'))).rejects.toThrow(SengiInsufficientPermissionsError)
  await expect(sengi.patchDocument(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(SengiInsufficientPermissionsError)

  await expect(sengi.queryDocuments(createRequestWith('all_props_valid'))).rejects.toThrow(SengiInsufficientPermissionsError)
  await expect(sengi.queryDocuments(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(SengiInsufficientPermissionsError)

  await expect(sengi.queryDocumentsByFilter(createRequestWith('all_props_valid'))).rejects.toThrow(SengiInsufficientPermissionsError)
  await expect(sengi.queryDocumentsByFilter(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(SengiInsufficientPermissionsError)

  await expect(sengi.queryDocumentsByIds(createRequestWith('all_props_valid'))).rejects.toThrow(SengiInsufficientPermissionsError)
  await expect(sengi.queryDocumentsByIds(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(SengiInsufficientPermissionsError)

  await expect(sengi.replaceDocument(createRequestWith('all_props_valid'))).rejects.toThrow(SengiInsufficientPermissionsError)
  await expect(sengi.replaceDocument(createRequestWith('docStoreOptions', undefined))).rejects.toThrow(SengiInsufficientPermissionsError)
})

test('A Sengi call to createDocument will fail if required parameters are not provided.', async () => {
  const sengi = new Sengi({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(sengi.createDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(sengi.createDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(sengi.createDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(sengi.createDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(sengi.createDocument(createRequestWith('id', undefined))).rejects.toThrow(/id/)
  await expect(sengi.createDocument(createRequestWith('id', 123))).rejects.toThrow(/id/)
  await expect(sengi.createDocument(createRequestWith('constructorParams', undefined))).rejects.toThrow(/constructorParams/)
  await expect(sengi.createDocument(createRequestWith('constructorParams', 123))).rejects.toThrow(/constructorParams/)
  await expect(sengi.createDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(sengi.createDocument(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Sengi call to deleteDocument will fail if required parameters are not provided.', async () => {
  const sengi = new Sengi({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(sengi.deleteDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(sengi.deleteDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(sengi.deleteDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(sengi.deleteDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(sengi.deleteDocument(createRequestWith('id', undefined))).rejects.toThrow(/id/)
  await expect(sengi.deleteDocument(createRequestWith('id', 123))).rejects.toThrow(/id/)
  await expect(sengi.deleteDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(sengi.deleteDocument(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Sengi call to operateOnDocument will fail if required parameters are not provided.', async () => {
  const sengi = new Sengi({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(sengi.operateOnDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(sengi.operateOnDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(sengi.operateOnDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(sengi.operateOnDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(sengi.operateOnDocument(createRequestWith('id', undefined))).rejects.toThrow(/id/)
  await expect(sengi.operateOnDocument(createRequestWith('id', 123))).rejects.toThrow(/id/)
  await expect(sengi.operateOnDocument(createRequestWith('reqVersion', 123))).rejects.toThrow(/reqVersion/)
  await expect(sengi.operateOnDocument(createRequestWith('operationId', undefined))).rejects.toThrow(/operationId/)
  await expect(sengi.operateOnDocument(createRequestWith('operationId', 123))).rejects.toThrow(/operationId/)
  await expect(sengi.operateOnDocument(createRequestWith('operationName', undefined))).rejects.toThrow(/operationName/)
  await expect(sengi.operateOnDocument(createRequestWith('operationName', 123))).rejects.toThrow(/operationName/)
  await expect(sengi.operateOnDocument(createRequestWith('operationParams', undefined))).rejects.toThrow(/operationParams/)
  await expect(sengi.operateOnDocument(createRequestWith('operationParams', 123))).rejects.toThrow(/operationParams/)
  await expect(sengi.operateOnDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(sengi.operateOnDocument(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Sengi call to patchDocument will fail if required parameters are not provided.', async () => {
  const sengi = new Sengi({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(sengi.patchDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(sengi.patchDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(sengi.patchDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(sengi.patchDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(sengi.patchDocument(createRequestWith('id', undefined))).rejects.toThrow(/id/)
  await expect(sengi.patchDocument(createRequestWith('id', 123))).rejects.toThrow(/id/)
  await expect(sengi.patchDocument(createRequestWith('reqVersion', 123))).rejects.toThrow(/reqVersion/)
  await expect(sengi.patchDocument(createRequestWith('operationId', undefined))).rejects.toThrow(/operationId/)
  await expect(sengi.patchDocument(createRequestWith('operationId', 123))).rejects.toThrow(/operationId/)
  await expect(sengi.patchDocument(createRequestWith('mergePatch', undefined))).rejects.toThrow(/mergePatch/)
  await expect(sengi.patchDocument(createRequestWith('mergePatch', 123))).rejects.toThrow(/mergePatch/)
  await expect(sengi.patchDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(sengi.patchDocument(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Sengi call to queryDocuments will fail if required parameters are not provided.', async () => {
  const sengi = new Sengi({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(sengi.queryDocuments(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(sengi.queryDocuments(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(sengi.queryDocuments(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(sengi.queryDocuments(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(sengi.queryDocuments(createRequestWith('fieldNames', undefined))).rejects.toThrow(/fieldNames/)
  await expect(sengi.queryDocuments(createRequestWith('fieldNames', 123))).rejects.toThrow(/fieldNames/)
  await expect(sengi.queryDocuments(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(sengi.queryDocuments(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Sengi call to queryDocumentsByFilter will fail if required parameters are not provided.', async () => {
  const sengi = new Sengi({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(sengi.queryDocumentsByFilter(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(sengi.queryDocumentsByFilter(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(sengi.queryDocumentsByFilter(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(sengi.queryDocumentsByFilter(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(sengi.queryDocumentsByFilter(createRequestWith('fieldNames', undefined))).rejects.toThrow(/fieldNames/)
  await expect(sengi.queryDocumentsByFilter(createRequestWith('fieldNames', 123))).rejects.toThrow(/fieldNames/)
  await expect(sengi.queryDocumentsByFilter(createRequestWith('filterName', undefined))).rejects.toThrow(/filterName/)
  await expect(sengi.queryDocumentsByFilter(createRequestWith('filterName', 123))).rejects.toThrow(/filterName/)
  await expect(sengi.queryDocumentsByFilter(createRequestWith('filterParams', undefined))).rejects.toThrow(/filterParams/)
  await expect(sengi.queryDocumentsByFilter(createRequestWith('filterParams', 123))).rejects.toThrow(/filterParams/)
  await expect(sengi.queryDocumentsByFilter(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(sengi.queryDocumentsByFilter(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Sengi call to queryDocumentsByIds will fail if required parameters are not provided.', async () => {
  const sengi = new Sengi({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(sengi.queryDocumentsByIds(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(sengi.queryDocumentsByIds(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(sengi.queryDocumentsByIds(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(sengi.queryDocumentsByIds(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(sengi.queryDocumentsByIds(createRequestWith('fieldNames', undefined))).rejects.toThrow(/fieldNames/)
  await expect(sengi.queryDocumentsByIds(createRequestWith('fieldNames', 123))).rejects.toThrow(/fieldNames/)
  await expect(sengi.queryDocumentsByIds(createRequestWith('ids', undefined))).rejects.toThrow(/ids/)
  await expect(sengi.queryDocumentsByIds(createRequestWith('ids', 123))).rejects.toThrow(/ids/)
  await expect(sengi.queryDocumentsByIds(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(sengi.queryDocumentsByIds(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})

test('A Sengi call to replaceDocument will fail if required parameters are not provided.', async () => {
  const sengi = new Sengi({ docStore: {}, docTypes: [], roleTypes: [] })
  await expect(sengi.replaceDocument(createRequestWith('roleNames', undefined))).rejects.toThrow(/roleNames/)
  await expect(sengi.replaceDocument(createRequestWith('roleNames', 123))).rejects.toThrow(/roleNames/)
  await expect(sengi.replaceDocument(createRequestWith('docTypeName', undefined))).rejects.toThrow(/docTypeName/)
  await expect(sengi.replaceDocument(createRequestWith('docTypeName', 123))).rejects.toThrow(/docTypeName/)
  await expect(sengi.replaceDocument(createRequestWith('doc', undefined))).rejects.toThrow(/doc/)
  await expect(sengi.replaceDocument(createRequestWith('doc', 123))).rejects.toThrow(/doc/)
  await expect(sengi.replaceDocument(createRequestWith('docStoreOptions', 123))).rejects.toThrow(/docStoreOptions/)
  await expect(sengi.replaceDocument(createRequestWith('reqProps', 123))).rejects.toThrow(/reqProps/)
})
