const check = require('check-types')
const {
  applyMergePatch,
  createDocStoreOptions,
  ensureDocHasSystemFields,
  ensureDocWasFound,
  ensureMergePatchAvoidsSystemFields,
  executeValidator,
  isOpIdInDocument,
  selectDocTypeFromArray,
  updateSystemFieldsOnDocument
} = require('../docTypes')
const {
  canPatch,
  ensurePermission
} = require('../roleTypes')

const patchDocument = async ({ roleNames, roleTypes, safeDocStore, validatorCache, docTypes, docTypeName, id, reqVersion, opId, mergePatch, docStoreOptions }) => {
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.object(validatorCache)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.string(id)
  check.assert.maybe.string(reqVersion)
  check.assert.string(opId)
  check.assert.object(mergePatch)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, 'update.patch', r => canPatch(r, docTypeName))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  const doc = await safeDocStore.fetch(docType.name, id, combinedDocStoreOptions)

  ensureDocWasFound(docType.name, id, doc)
  ensureDocHasSystemFields(doc)

  const opIdAlreadyExists = isOpIdInDocument(doc, opId)

  if (!opIdAlreadyExists) {
    validatorCache.ensureDocTypeMergePatch(docType.name, mergePatch)
    ensureMergePatchAvoidsSystemFields(mergePatch)

    applyMergePatch(doc, mergePatch)
    updateSystemFieldsOnDocument(docType, doc, opId)

    validatorCache.ensureDocTypeFields(docType.name, doc)
    executeValidator(docType, doc)

    await safeDocStore.upsert(docTypeName, doc, reqVersion || doc.docVersion, combinedDocStoreOptions)
  }
}

module.exports = patchDocument
