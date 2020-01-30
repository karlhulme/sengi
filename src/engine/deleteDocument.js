const check = require('check-types')
const {
  createDocStoreOptions,
  ensureCanDeleteDocuments,
  selectDocTypeFromArray
} = require('../docTypes')
const {
  canDelete,
  ensurePermission
} = require('../roleTypes')
const invokeCallback = require('./invokeCallback')

const deleteDocument = async ({ roleNames, roleTypes, safeDocStore, docTypes, docTypeName, id, onDeleteDoc, reqProps, docStoreOptions }) => {
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.string(id)
  check.assert.maybe.function(onDeleteDoc)
  check.assert.maybe.object(reqProps)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, 'delete', r => canDelete(r, docTypeName))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  ensureCanDeleteDocuments(docType)

  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  const isDeleted = await safeDocStore.deleteById(docType.name, docType.pluralName, id, combinedDocStoreOptions)

  if (onDeleteDoc && isDeleted) {
    await invokeCallback('onDeleteDoc', onDeleteDoc, { roleNames, reqProps, docType, id })
  }

  return { isDeleted }
}

module.exports = deleteDocument
