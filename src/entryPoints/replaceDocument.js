const check = require('check-types')
const {
  createDocStoreOptions,
  ensureCanReplaceDocuments,
  executeValidator,
  selectDocTypeFromArray
} = require('../docTypes')
const {
  canReplace,
  ensurePermission
} = require('../roleTypes')

const replaceDocument = async ({ roleNames, roleTypes, safeDocStore, validatorCache, docTypes, docTypeName, reqVersion, doc, docStoreOptions }) => {
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.object(validatorCache)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.maybe.string(reqVersion)
  check.assert.object(doc)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, 'replace', r => canReplace(r, docTypeName))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  ensureCanReplaceDocuments(docType)

  validatorCache.ensureDocTypeFields(docType.name, doc)
  executeValidator(docType, doc)

  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  await safeDocStore.upsert(docTypeName, doc, reqVersion || null, combinedDocStoreOptions)
}

module.exports = replaceDocument
