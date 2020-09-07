import check from 'check-types'
import {
  addSystemFieldValuesToNewDocument,
  applyMergePatch,
  createDocStoreOptions,
  updateCalcsOnDocument,
  ensureMergePatchAvoidsSystemFields,
  executeConstructor,
  executePreSave,
  executeValidator,
  extractConstructorDeclaredParams,
  extractConstructorMergeParams,
  selectDocTypeFromArray
} from '../docTypes'
import {
  canCreate,
  ensurePermission
} from '../roleTypes'
import { ensureDocTypeConstructorParams, ensureDocTypePatch, ensureDocTypeInstance } from '../validation'
import { invokeCallback } from './invokeCallback'

export const createDocument = async ({ userIdentity, roleNames, roleTypes, safeDocStore, sengiValidation, docTypes, docTypeName, id, constructorParams, onPreSaveDoc, onCreateDoc, reqProps, reqDateTime, docStoreOptions }) => {
  check.assert.string(userIdentity)
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.object(sengiValidation)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.string(id)
  check.assert.maybe.object(constructorParams)
  check.assert.maybe.function(onPreSaveDoc)
  check.assert.maybe.function(onCreateDoc)
  check.assert.maybe.object(reqProps)
  check.assert.string(reqDateTime)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, 'create', r => canCreate(r, docTypeName))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  const alreadyExists = await safeDocStore.exists(docType.name, docType.pluralName, id, combinedDocStoreOptions)

  if (!alreadyExists) {
    const ctorDeclaredParams = extractConstructorDeclaredParams(docType, constructorParams)
    ensureDocTypeConstructorParams(sengiValidation, docType.name, constructorParams)
    const doc = executeConstructor(docType, ctorDeclaredParams)

    const ctorMergeParams = extractConstructorMergeParams(docType, constructorParams)
    ensureDocTypePatch(sengiValidation, docType.name, ctorMergeParams)
    ensureMergePatchAvoidsSystemFields(ctorMergeParams)
    applyMergePatch(doc, ctorMergeParams)

    addSystemFieldValuesToNewDocument(docType, doc, id, userIdentity, reqDateTime)

    executePreSave(docType, doc)

    if (onPreSaveDoc) {
      await invokeCallback('onPreSaveDoc', onPreSaveDoc, { roleNames, reqProps, docType, doc, mergePatch: null })
    }

    updateCalcsOnDocument(docType, doc)

    ensureDocTypeInstance(sengiValidation, docType.name, doc)
    executeValidator(docType, doc)

    await safeDocStore.upsert(docType.name, docType.pluralName, doc, null, false, combinedDocStoreOptions)

    if (onCreateDoc) {
      await invokeCallback('onCreateDoc', onCreateDoc, { roleNames, reqProps, docType, doc })
    }

    return { isNew: true }
  } else {
    return { isNew: false }
  }
}
