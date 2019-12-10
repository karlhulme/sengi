const check = require('check-types')
const {
  applyCalculatedFieldValuesToDocument,
  applyDeclaredFieldDefaultsToDocument,
  createDocStoreOptions,
  determineFieldNamesForRetrieval,
  ensureCanFetchWholeCollection,
  removeSurplusFieldsFromDocument,
  selectDocTypeFromArray
} = require('../docTypes')
const {
  canQuery,
  ensurePermission
} = require('../roleTypes')

const queryDocuments = async ({ roleNames, roleTypes, safeDocStore, docTypes, docTypeName, fieldNames, onFieldsQueried, docStoreOptions }) => {
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.array.of.string(fieldNames)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, `query(${fieldNames.join(',')})`, r => canQuery(r, docTypeName, fieldNames))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  ensureCanFetchWholeCollection(docType)

  const retrievalFieldNames = determineFieldNamesForRetrieval(docType, fieldNames)
  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  const docs = await safeDocStore.queryAll(docType.name, retrievalFieldNames, combinedDocStoreOptions)

  if (onFieldsQueried) {
    await Promise.resolve(onFieldsQueried(docType.name, fieldNames, retrievalFieldNames))
  }

  docs.forEach(d => applyDeclaredFieldDefaultsToDocument(docType, d, retrievalFieldNames))
  docs.forEach(d => applyCalculatedFieldValuesToDocument(docType, d, fieldNames))
  docs.forEach(d => removeSurplusFieldsFromDocument(d, fieldNames))

  return { docs }
}

module.exports = queryDocuments
