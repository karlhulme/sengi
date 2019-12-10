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

const deleteDocument = async ({ roleNames, roleTypes, safeDocStore, docTypes, docTypeName, id, docStoreOptions }) => {
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.string(id)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, 'delete', r => canDelete(r, docTypeName))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  ensureCanDeleteDocuments(docType)

  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  await safeDocStore.deleteById(docTypeName, id, combinedDocStoreOptions)
}

module.exports = deleteDocument
