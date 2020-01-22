const check = require('check-types')
const {
  applyCalculatedFieldValuesToDocument,
  applyDeclaredFieldDefaultsToDocument,
  createDocStoreOptions,
  determineFieldNamesForRetrieval,
  ensureFilterName,
  evaluateFilter,
  removeSurplusFieldsFromDocument,
  selectDocTypeFromArray
} = require('../docTypes')
const {
  canQuery,
  ensurePermission
} = require('../roleTypes')

const queryDocumentsByFilter = async ({ roleNames, roleTypes, safeDocStore, validatorCache, docTypes, docTypeName, fieldNames, filterName, filterParams, onQueryDocs, reqProps, docStoreOptions }) => {
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.object(validatorCache)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.string(filterName)
  check.assert.maybe.object(filterParams)
  check.assert.maybe.function(onQueryDocs)
  check.assert.maybe.object(reqProps)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, `query(${fieldNames.join(',')})`,
    r => canQuery(r, docTypeName, fieldNames))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  ensureFilterName(docType, filterName)
  const retrievalFieldNames = determineFieldNamesForRetrieval(docType, fieldNames)
  validatorCache.ensureDocTypeFilterParams(docTypeName, filterName, filterParams)

  const filterResult = evaluateFilter(docType, filterName, filterParams)

  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  const docs = await safeDocStore.queryByFilter(docType.name, docType.pluralName, retrievalFieldNames, filterResult, combinedDocStoreOptions)

  if (onQueryDocs) {
    await Promise.resolve(onQueryDocs({ roleNames, reqProps, docType, fieldNames, retrievalFieldNames }))
  }

  docs.forEach(d => applyDeclaredFieldDefaultsToDocument(docType, d, retrievalFieldNames))
  docs.forEach(d => applyCalculatedFieldValuesToDocument(docType, d, fieldNames))
  docs.forEach(d => removeSurplusFieldsFromDocument(d, fieldNames))

  return { docs }
}

module.exports = queryDocumentsByFilter
