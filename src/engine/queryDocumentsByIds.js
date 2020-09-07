import check from 'check-types'
import {
  applyCalculatedFieldValuesToDocument,
  applyDeclaredFieldDefaultsToDocument,
  createDocStoreOptions,
  determineFieldNamesForRetrieval,
  getDeprecationsForRetrievalFieldNames,
  removeSurplusFieldsFromDocument,
  selectDocTypeFromArray
} from '../docTypes'
import {
  canQuery,
  ensurePermission
} from '../roleTypes'
import { invokeCallback } from './invokeCallback'

export const queryDocumentsByIds = async ({ roleNames, roleTypes, safeDocStore, docTypes, docTypeName, fieldNames, ids, onQueryDocs, reqProps, docStoreOptions }) => {
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.array.of.string(fieldNames)
  check.assert.array.of.string(ids)
  check.assert.maybe.function(onQueryDocs)
  check.assert.maybe.object(reqProps)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, `query(${fieldNames.join(',')})`,
    r => canQuery(r, docTypeName, fieldNames))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  const retrievalFieldNames = determineFieldNamesForRetrieval(docType, fieldNames)
  const deprecations = getDeprecationsForRetrievalFieldNames(docType, retrievalFieldNames)

  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  const docs = await safeDocStore.queryByIds(docType.name, docType.pluralName, retrievalFieldNames, ids, combinedDocStoreOptions)

  if (onQueryDocs) {
    await invokeCallback('onQueryDocs', onQueryDocs, { roleNames, reqProps, docType, fieldNames, retrievalFieldNames })
  }

  docs.forEach(d => applyDeclaredFieldDefaultsToDocument(docType, d, retrievalFieldNames))
  docs.forEach(d => applyCalculatedFieldValuesToDocument(docType, d, fieldNames))
  docs.forEach(d => removeSurplusFieldsFromDocument(d, fieldNames))

  return { deprecations, docs }
}
