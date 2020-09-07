import check from 'check-types'
import {
  createDocStoreOptions,
  ensureCanReplaceDocuments,
  ensureSystemFields,
  executePreSave,
  executeValidator,
  selectDocTypeFromArray,
  updateCalcsOnDocument
} from '../docTypes'
import {
  canReplace,
  ensurePermission
} from '../roleTypes'
import { ensureDocTypeInstance } from '../validation'
import { invokeCallback } from './invokeCallback'

export const replaceDocument = async ({ userIdentity, roleNames, roleTypes, safeDocStore, sengiValidation, docTypes, docTypeName, reqVersion, doc, onPreSaveDoc, onCreateDoc, onUpdateDoc, reqProps, reqDateTime, docStoreOptions }) => {
  check.assert.string(userIdentity)
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.object(sengiValidation)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.maybe.string(reqVersion)
  check.assert.object(doc)
  check.assert.maybe.function(onPreSaveDoc)
  check.assert.maybe.function(onCreateDoc)
  check.assert.maybe.function(onUpdateDoc)
  check.assert.maybe.object(reqProps)
  check.assert.string(reqDateTime)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, 'replace', r => canReplace(r, docTypeName))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  ensureCanReplaceDocuments(docType)

  ensureSystemFields(doc, userIdentity, reqDateTime)

  executePreSave(docType, doc)

  if (onPreSaveDoc) {
    await invokeCallback('onPreSaveDoc', onPreSaveDoc, { roleNames, reqProps, docType, doc, mergePatch: null })
  }

  updateCalcsOnDocument(docType, doc)

  ensureDocTypeInstance(sengiValidation, docType.name, doc)
  executeValidator(docType, doc)

  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  const isNew = await safeDocStore.upsert(docType.name, docType.pluralName, doc, reqVersion || null, Boolean(reqVersion), combinedDocStoreOptions)

  if (onCreateDoc && isNew) {
    await invokeCallback('onCreateDoc', onCreateDoc, { roleNames, reqProps, docType, doc })
  }

  if (onUpdateDoc && !isNew) {
    await invokeCallback('onUpdateDoc', onUpdateDoc, { roleNames, reqProps, docType, doc })
  }

  return { isNew }
}
