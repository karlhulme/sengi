const check = require('check-types')
const {
  applyCalculatedFieldValuesToDocument,
  applyDeclaredFieldDefaultsToDocument,
  createDocStoreOptions,
  determineFieldNamesForRetrieval,
  removeSurplusFieldsFromDocument,
  selectDocTypeFromArray
} = require('../docTypes')
const {
  canQuery,
  ensurePermission
} = require('../roleTypes')

const queryDocumentsByIds = async ({ roleNames, roleTypes, safeDocStore, docTypes, docTypeName, fieldNames, ids, onFieldsQueried, docStoreOptions }) => {
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.array.of.string(fieldNames)
  check.assert.array.of.string(ids)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, `query(${fieldNames.join(',')})`,
    r => canQuery(r, docTypeName, fieldNames))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  const retrievalFieldNames = determineFieldNamesForRetrieval(docType, fieldNames)

  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  const docs = await safeDocStore.queryByIds(docType.name, retrievalFieldNames, ids, combinedDocStoreOptions)

  if (onFieldsQueried) {
    await Promise.resolve(onFieldsQueried(docType.name, fieldNames, retrievalFieldNames))
  }

  docs.forEach(d => applyDeclaredFieldDefaultsToDocument(docType, d, retrievalFieldNames))
  docs.forEach(d => applyCalculatedFieldValuesToDocument(docType, d, fieldNames))
  docs.forEach(d => removeSurplusFieldsFromDocument(d, fieldNames))

  return { docs }
}

module.exports = queryDocumentsByIds
