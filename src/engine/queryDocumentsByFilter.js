const check = require('check-types')
const {
  applyCalculatedFieldValuesToDocument,
  applyDeclaredFieldDefaultsToDocument,
  createDocStoreOptions,
  determineFieldNamesForRetrieval,
  ensureFilterName,
  evaluateFilter,
  getDeprecationsForRetrievalFieldNames,
  removeSurplusFieldsFromDocument,
  selectDocTypeFromArray
} = require('../docTypes')
const {
  canQuery,
  ensurePermission
} = require('../roleTypes')
const invokeCallback = require('./invokeCallback')

const queryDocumentsByFilter = async ({ roleNames, roleTypes, safeDocStore, sengiValidation, docTypes, docTypeName, fieldNames, filterName, filterParams, limit, offset, onQueryDocs, reqProps, docStoreOptions }) => {
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.object(sengiValidation)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.string(filterName)
  check.assert.maybe.object(filterParams)
  check.assert.maybe.number(limit)
  check.assert.maybe.number(offset)
  check.assert.maybe.function(onQueryDocs)
  check.assert.maybe.object(reqProps)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, `query(${fieldNames.join(',')})`,
    r => canQuery(r, docTypeName, fieldNames))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  ensureFilterName(docType, filterName)
  const retrievalFieldNames = determineFieldNamesForRetrieval(docType, fieldNames)
  const deprecations = getDeprecationsForRetrievalFieldNames(docType, retrievalFieldNames)
  validatorCache.ensureDocTypeFilterParams(docTypeName, filterName, filterParams)

  const filterResult = evaluateFilter(docType, filterName, filterParams)

  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  const docs = await safeDocStore.queryByFilter(docType.name, docType.pluralName, retrievalFieldNames, filterResult, limit, offset, combinedDocStoreOptions)

  if (onQueryDocs) {
    await invokeCallback('onQueryDocs', onQueryDocs, { roleNames, reqProps, docType, fieldNames, retrievalFieldNames })
  }

  docs.forEach(d => applyDeclaredFieldDefaultsToDocument(docType, d, retrievalFieldNames))
  docs.forEach(d => applyCalculatedFieldValuesToDocument(docType, d, fieldNames))
  docs.forEach(d => removeSurplusFieldsFromDocument(d, fieldNames))

  return { deprecations, docs }
}

module.exports = queryDocumentsByFilter
