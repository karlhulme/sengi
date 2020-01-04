const check = require('check-types')
const {
  applyMergePatch,
  createDocStoreOptions,
  ensureDocHasSystemFields,
  ensureDocWasFound,
  ensureOperationName,
  ensureOperationMergePatchAvoidsSystemFields,
  executeOperation,
  executeValidator,
  isOpIdInDocument,
  selectDocTypeFromArray,
  updateSystemFieldsOnDocument
} = require('../docTypes')
const { canOperate, ensurePermission } = require('../roleTypes')

const operateOnDocument = async ({ roleNames, roleTypes, safeDocStore, validatorCache, docTypes, docTypeName, id, reqVersion, operationId, operationName, operationParams, docStoreOptions }) => {
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.object(validatorCache)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.string(id)
  check.assert.maybe.string(reqVersion)
  check.assert.string(operationId)
  check.assert.string(operationName)
  check.assert.maybe.object(operationParams)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, `update.${operationName}`,
    r => canOperate(r, docTypeName, operationName))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  ensureOperationName(docType, operationName)
  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  const doc = await safeDocStore.fetch(docType.name, docType.pluralName, id, combinedDocStoreOptions)

  ensureDocWasFound(docType.name, id, doc)
  ensureDocHasSystemFields(doc)

  const opIdAlreadyExists = isOpIdInDocument(doc, operationId)

  if (!opIdAlreadyExists) {
    validatorCache.ensureDocTypeOperationParams(docType.name, operationName, operationParams)

    const mergePatch = executeOperation(docType, doc, operationName, operationParams)

    ensureOperationMergePatchAvoidsSystemFields(docType.name, operationName, mergePatch)
    applyMergePatch(doc, mergePatch)

    updateSystemFieldsOnDocument(docType, doc, operationId)
    validatorCache.ensureDocTypeFields(docType.name, doc)
    executeValidator(docType, doc)
    await safeDocStore.upsert(docType.name, docType.pluralName, doc, reqVersion || doc.docVersion, Boolean(reqVersion), combinedDocStoreOptions)
    return { isUpdated: true }
  } else {
    return { isUpdated: false }
  }
}

module.exports = operateOnDocument
