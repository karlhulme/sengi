const check = require('check-types')
const {
  applySystemFieldValuesToNewDocument,
  createDocStoreOptions,
  executeConstructor,
  executeValidator,
  selectDocTypeFromArray
} = require('../docTypes')
const {
  canCreate,
  ensurePermission
} = require('../roleTypes')

const createDocument = async ({ roleNames, roleTypes, safeDocStore, validatorCache, docTypes, docTypeName, id, constructorParams, docStoreOptions }) => {
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.object(safeDocStore)
  check.assert.object(validatorCache)
  check.assert.array.of.object(docTypes)
  check.assert.string(docTypeName)
  check.assert.string(id)
  check.assert.maybe.object(constructorParams)
  check.assert.maybe.object(docStoreOptions)

  ensurePermission(roleNames, roleTypes, docTypeName, 'create', r => canCreate(r, docTypeName))

  const docType = selectDocTypeFromArray(docTypes, docTypeName)
  const combinedDocStoreOptions = createDocStoreOptions(docType, docStoreOptions)
  const alreadyExists = await safeDocStore.exists(docTypeName, id, combinedDocStoreOptions)

  if (!alreadyExists) {
    const docType = selectDocTypeFromArray(docTypes, docTypeName)
    const ctorParamsValidator = validatorCache.getDocTypeConstructorParamsValidator(docType.name)
    const doc = executeConstructor(docType, constructorParams, ctorParamsValidator)
    applySystemFieldValuesToNewDocument(docType, doc, id)

    validatorCache.ensureDocTypeFields(docType.name, doc)
    executeValidator(docType, doc)

    await safeDocStore.upsert(docTypeName, doc, null, false, combinedDocStoreOptions)
  }
}

module.exports = createDocument
