import check from 'check-types'
import {
  applyDocHeaderToDocument,
  applyMergePatch,
  applySystemFieldValuesToUpdatedDocument,
  createDocStoreOptions,
  ensureDocWasFound,
  ensureOperationName,
  ensureOperationMergePatchAvoidsSystemFields,
  executeOperation,
  executePreSave,
  executeValidator,
  isOpIdInDocument,
  selectDocTypeFromArray,
  updateCalcsOnDocument
} from '../docTypes'
import { canOperate, ensurePermission } from '../roleTypes'
import { ensureDocTypeInstance, ensureDocTypeOperationParams } from '../validation'
import { invokeCallback } from './invokeCallback'

export const operateOnDocument = async ({ userIdentity, roleNames, roleTypes, safeDocStore, sengiValidation, docTypes, docTypeName, id, reqVersion, operationId, operationName, operationParams, onPreSaveDoc, onUpdateDoc, reqProps, reqDateTime, docStoreOptions }) => {
  check.assert.string(userIdentity)
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.object(sengiValidation)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.string(id)
  check.assert.maybe.string(reqVersion)
  check.assert.string(operationId)
  check.assert.string(operationName)
  check.assert.maybe.object(operationParams)
  check.assert.maybe.function(onPreSaveDoc)
  check.assert.maybe.function(onUpdateDoc)
  check.assert.maybe.object(reqProps)
  check.assert.string(reqDateTime)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, `update.${operationName}`,
    r => canOperate(r, docTypeName, operationName))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  ensureOperationName(docType, operationName)
  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  const doc = await safeDocStore.fetch(docType.name, docType.pluralName, id, combinedDocStoreOptions)

  ensureDocWasFound(docType.name, id, doc)
  applyDocHeaderToDocument(doc, userIdentity, reqDateTime)

  const opIdAlreadyExists = isOpIdInDocument(doc, operationId)

  if (!opIdAlreadyExists) {
    ensureDocTypeOperationParams(sengiValidation, docType.name, operationName, operationParams)

    executePreSave(docType, doc)

    const mergePatch = executeOperation(docType, doc, operationName, operationParams)

    if (onPreSaveDoc) {
      await invokeCallback('onPreSaveDoc', onPreSaveDoc, { roleNames, reqProps, docType, doc, mergePatch })
    }

    ensureOperationMergePatchAvoidsSystemFields(docType.name, operationName, mergePatch)
    applyMergePatch(doc, mergePatch)
    applySystemFieldValuesToUpdatedDocument(docType, doc, operationId, userIdentity, reqDateTime, 'operation', operationName)
    updateCalcsOnDocument(docType, doc)

    ensureDocTypeInstance(sengiValidation, docType.name, doc)
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
