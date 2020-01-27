const check = require('check-types')
const {
  applyMergePatch,
  applySystemFieldValuesToUpdatedDocument,
  createDocStoreOptions,
  ensureDocHasSystemFields,
  ensureDocWasFound,
  ensureMergePatchAvoidsSystemFields,
  executePreSave,
  executeValidator,
  isOpIdInDocument,
  selectDocTypeFromArray,
  updateCalcsOnDocument
} = require('../docTypes')
const {
  canPatch,
  ensurePermission
} = require('../roleTypes')
const invokeCallback = require('./invokeCallback')

const patchDocument = async ({ userIdentity, roleNames, roleTypes, safeDocStore, validatorCache, docTypes, docTypeName, id, reqVersion, operationId, mergePatch, onPreSaveDoc, onUpdateDoc, reqProps, reqDateTime, docStoreOptions }) => {
  check.assert.string(userIdentity)
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.object(validatorCache)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.string(id)
  check.assert.maybe.string(reqVersion)
  check.assert.string(operationId)
  check.assert.object(mergePatch)
  check.assert.maybe.function(onPreSaveDoc)
  check.assert.maybe.function(onUpdateDoc)
  check.assert.maybe.object(reqProps)
  check.assert.string(reqDateTime)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, 'update.patch', r => canPatch(r, docTypeName))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  const doc = await safeDocStore.fetch(docType.name, docType.pluralName, id, combinedDocStoreOptions)

  ensureDocWasFound(docType.name, id, doc)
  ensureDocHasSystemFields(doc)

  const operationIdAlreadyExists = isOpIdInDocument(doc, operationId)

  if (!operationIdAlreadyExists) {
    validatorCache.ensureDocTypeMergePatch(docType.name, mergePatch)

    executePreSave(docType, doc)

    if (onPreSaveDoc) {
      await invokeCallback('onPreSaveDoc', onPreSaveDoc, { roleNames, reqProps, docType, doc, mergePatch })
    }

    ensureMergePatchAvoidsSystemFields(mergePatch)
    applyMergePatch(doc, mergePatch)
    applySystemFieldValuesToUpdatedDocument(docType, doc, operationId, userIdentity, reqDateTime, 'patch')
    updateCalcsOnDocument(docType, doc)

    validatorCache.ensureDocTypeFields(docType.name, doc)
    executeValidator(docType, doc)

    await safeDocStore.upsert(docType.name, docType.pluralName, doc, reqVersion || doc.docVersion, Boolean(reqVersion), combinedDocStoreOptions)

    if (onUpdateDoc) {
      await invokeCallback('onUpdateDoc', onUpdateDoc, { roleNames, reqProps, docType, doc })
    }

    return { isUpdated: true }
  } else {
    return { isUpdated: false }
  }
}

module.exports = patchDocument
