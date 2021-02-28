import {
  EnumType,
  Jsonotron,
  JsonSchemaFormatValidatorFunc,
  Structure
} from 'jsonotron-js'
import { 
  CreateDocumentProps,
  CreateDocumentResult,
  DeletedDocCallback,
  DeletedDocCallbackProps,
  DeleteDocumentProps,
  DeleteDocumentResult,
  GetDocTypeAsGraphQLProps,
  DocStore,
  DocStoreDeleteByIdResultCode,
  DocStoreUpsertResultCode,
  DocType,
  OperateOnDocumentProps,
  OperateOnDocumentResult,
  PatchDocumentProps,
  PatchDocumentResult,
  PreQueryDocsCallback,
  PreQueryDocsCallbackProps,
  PreSaveDocCallback,
  PreSaveDocCallbackProps,
  QueryDocumentsByFilterProps,
  QueryDocumentsByFilterResult,
  QueryDocumentsByIdsProps,
  QueryDocumentsByIdsResult,
  QueryDocumentsProps,
  QueryDocumentsResult,
  ReplaceDocumentProps,
  ReplaceDocumentResult,
  RoleType,
  SerializableEnumTypeOverview,
  SerializableEnumType,
  SavedDocCallback,
  SavedDocCallbackProps,
  SengiCallbackError,
  SerializableDocTypeOverview,
  SerializableDocType
 } from 'sengi-interfaces'
 import { ensureUpsertSuccessful, SafeDocStore } from '../docStore'
 import {
   addSystemFieldValuesToNewDocument,
   applyPatch,
   createDocStoreOptions,
   executeConstructor,
   extractConstructorDeclaredParams,
   extractConstructorMergeParams,
   executePreSave,
   executeValidator,
   updateCalcsOnDocument,
   applySystemFieldValuesToUpdatedDocument,
   isOpIdInDocument,
   executeOperation,
   trimInternalPatch,
   determineFieldNamesForRetrieval,
   getDeprecationsForRetrievalFieldNames,
   applyDeclaredFieldDefaultsToDocument,
   applyCalculatedFieldValuesToDocument,
   removeSurplusFieldsFromDocument,
   evaluateFilter,
   convertDocTypeToSerializableDocType
  } from '../docTypes'
 import {
   ensureCreatePermission,
   ensureDeletePermission,
   ensureOperatePermission,
   ensurePatchPermission,
   ensureQueryPermission,
   ensureReplacePermission 
} from '../roleTypes'
 import {
   ensureCanDeleteDocuments,
   ensureCanFetchWholeCollection,
   ensureCanReplaceDocuments,
   ensureConstructorParams,
   ensureDoc,
   ensureDocWasFound,
   ensureFilterName,
   ensureFilterParams,
   ensureOperationName,
   ensureOperationParams,
   ensurePatch,
   selectDocTypeFromArray
} from '../requestValidation'
import {
  generateConstructorGraphQLTypeForDocType,
  generateOperationGraphQLTypeForDocType,
  generatePatchGraphQLTypeForDocType,
  generateQueryableGraphQLTypeForDocType,
  generateRuntimeEnumTypeItemGraphQLType
} from '../graphQL'

export interface SengiConstructorProps {
  jsonotronTypes?: string[]
  jsonotronFormatValidators?: Record<string, JsonSchemaFormatValidatorFunc>
  docTypes?: DocType[]
  roleTypes?: RoleType[]
  docStore?: DocStore
  log?: boolean
  onSavedDoc?: SavedDocCallback
  onDeletedDoc?: DeletedDocCallback
  onPreSaveDoc?: PreSaveDocCallback
  onPreQueryDocs?: PreQueryDocsCallback
}

 /**
  * Entry point to the sengi engine for processing docs.
  */
export class Sengi {
  private docTypes: DocType[]
  private roleTypes: RoleType[]
  private enumTypes: EnumType[]
  private safeDocStore: SafeDocStore
  private jsonotron: Jsonotron
  private validateCache: Record<string, Structure> = {}
  private log: boolean

  private onSavedDoc?: SavedDocCallback
  private onDeletedDoc?: DeletedDocCallback
  private onPreSaveDoc?: PreSaveDocCallback
  private onPreQueryDocs?: PreQueryDocsCallback

  /**
   * Log a request to the console.
   * @param request A string that represents the request.
   */
  private logRequest (request: string) {
    if (this.log) {
      console.log(request)
    }
  }

  /**
   * Raises the onPreSaveDoc callback if one was registered in the constructor.
   * @param props The properties to be passed to the callback.
   */
  private async invokePreSaveDocCallback (props: PreSaveDocCallbackProps) {
    try {
      if (this.onPreSaveDoc) {
        await this.onPreSaveDoc(props)
      }
    } catch (err) {
      throw new SengiCallbackError('onPreSaveDoc', err)
    }
  }

  /**
   * Raises the onSavedDov callback if one was registered in the constructor.
   * @param props The properties to be passed to the callback.
   */
  private async invokeSavedDocCallback (props: SavedDocCallbackProps) {
    try {
      if (this.onSavedDoc) {
        await this.onSavedDoc(props)
      }
    } catch (err) {
      throw new SengiCallbackError('onSavedDoc', err)
    }
  }

  /**
   * Raises the onDeletedDoc callback if one was registered in the constructor.
   * @param props The properties to be passed to the callback.
   */
  private async invokeDeletedDocCallback (props: DeletedDocCallbackProps) {
    try {
      if (this.onDeletedDoc) {
        await this.onDeletedDoc(props)
      }
    } catch (err) {
      throw new SengiCallbackError('onDeletedDoc', err)
    }
  }

  /**
   * Raises the onPreQueryDocs callback if one was registered in the constructor.
   * @param props The properties to be passed to the callback.
   */
  private async invokePreQueryDocsCallback (props: PreQueryDocsCallbackProps) {
    try {
      if (this.onPreQueryDocs) {
        await this.onPreQueryDocs(props)
      }
    } catch (err) {
      throw new SengiCallbackError('onPreQueryDocs', err)
    }
  }

  /**
   * Creates a new Sengi engine.
   * This requires a set of doc and role types,
   * a Jsonotron type system and a document store.
   * @param props The constructor properties.
   */
  constructor (props: SengiConstructorProps) {
    this.docTypes = props.docTypes || []
    this.roleTypes = props.roleTypes || []
    this.log = Boolean(props.log)

    if (!props.docStore) {
      throw new Error('Must supply a docStore.')
    }

    this.safeDocStore = new SafeDocStore(props.docStore)

    this.jsonotron = new Jsonotron({ types: props.jsonotronTypes, jsonSchemaFormatValidators: props.jsonotronFormatValidators })
    this.enumTypes = this.jsonotron.getEnumTypes()

    this.onSavedDoc = props.onSavedDoc
    this.onDeletedDoc = props.onDeletedDoc
    this.onPreSaveDoc = props.onPreSaveDoc
    this.onPreQueryDocs = props.onPreQueryDocs
  }

  /**
   * Returns the singular doc type name for the given plural name.
   * @param docTypePluralName The plural name of a doc type.
   */
  getDocTypeNameFromPluralName (docTypePluralName: string): string|null {
    const docType = this.docTypes.find(d => d.pluralName === docTypePluralName)

    if (docType) {
      return docType.name
    } else {
      return null
    }
  }

  /**
   * Returns the plural doc type name for the given singular name.
   * @param docTypeName The name of a doc type.
   */
  getDocTypePluralNameFromName (docTypeName: string): string|null {
    const docType = this.docTypes.find(d => d.name === docTypeName)

    if (docType) {
      return docType.pluralName
    } else {
      return null
    }
  }

  /**
   * Returns an array of enum type overviews.
   */
  getEnumTypes (): SerializableEnumTypeOverview[] {
    return this.enumTypes.map(e => ({
      domain: e.domain,
      system: e.system,
      name: e.name,
      title: e.title
    }))
  }

  /**
   * Returns the enum type identified by the given fully qualified enum type name, or null if not found.
   * @param fullyQualifiedEnumTypeName An enum type name that includes the domain and system.
   */
  getEnumType (fullyQualifiedEnumTypeName: string): SerializableEnumType|null {
    const enumType = this.enumTypes.find(e => `${e.domain}/${e.system}/${e.name}` === fullyQualifiedEnumTypeName)

    if (enumType) {
      return {
        domain: enumType.domain,
        system: enumType.system,
        name: enumType.name,
        title: enumType.title,
        documentation: enumType.documentation,
        items: enumType.items.map(item => ({
          text: item.text,
          value: item.value,
          deprecated: item.deprecated,
          symbol: item.symbol,
          documentation: item.documentation
        }))
      }
    } else {
      return null
    }
  }

  /**
   * Returns an array of the doc types.
   */
  getDocTypes (): SerializableDocTypeOverview[] {
    return this.docTypes.map(d => ({
      name: d.name,
      pluralName: d.pluralName,
      title: d.title,
      pluralTitle: d.pluralTitle,
      summary: d.summary
    }))
  }

  /**
   * Returns the serializable parts of a doc type.
   * @param docTypeName The name of a document type.
   */
  getDocType (docTypeName: string): SerializableDocType|null {
    const docType = this.docTypes.find(d => d.name === docTypeName)

    if (docType) {
      return convertDocTypeToSerializableDocType(this.jsonotron, docType)
    } else {
      return null
    }
  }

  /**
   * @deprecated
   * Returns a GraphQL definition string for an enum type item.
   */
  getEnumTypeItemAsGraphQL (): string {
    return generateRuntimeEnumTypeItemGraphQLType()
  }

  /**
   * @deprecated
   * Returns a Graph QL definition string for the named doc type
   * and the set of queryable role types. 
   * @param props A property bag that describes what to generate.
   */
  getDocTypeAsGraphQL (props: GetDocTypeAsGraphQLProps): string {
    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)

    const queryGqls = props.roleTypeSets.map(roleTypeSet => {
      const roleTypes = this.roleTypes.filter(r => roleTypeSet.roleTypeNames.includes(r.name))
      return generateQueryableGraphQLTypeForDocType(this.jsonotron, docType, roleTypes, roleTypeSet.suffix)
    })

    const constructorGql = generateConstructorGraphQLTypeForDocType(this.jsonotron, docType)

    const patchGql = generatePatchGraphQLTypeForDocType(this.jsonotron, docType)

    const operationGqls = Object.keys(docType.operations)
      .map(operationName => generateOperationGraphQLTypeForDocType(this.jsonotron, docType, operationName))

    return `${queryGqls.join('\n\n')}\n\n${constructorGql}\n\n${patchGql}\n\n${operationGqls.join('\n\n')}`
  }

  /**
   * Creates a new document using a doc type constructor.
   * @param props A property bag.
   */
  async createDocument (props: CreateDocumentProps): Promise<CreateDocumentResult> {
    this.logRequest(`CREATE ${props.docTypeName}`)
    ensureCreatePermission(props.roleNames, this.roleTypes, props.docTypeName)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
    const existsResult = await this.safeDocStore.exists(docType.name, docType.pluralName, props.id, combinedDocStoreOptions, {})
  
    if (!existsResult.found) {
      const ctorDeclaredParams = extractConstructorDeclaredParams(docType, props.constructorParams)
      ensureConstructorParams(this.jsonotron, this.validateCache, docType, props.constructorParams)
      const doc = executeConstructor(docType, ctorDeclaredParams)
  
      const ctorMergeParams = extractConstructorMergeParams(docType, props.constructorParams)
      ensurePatch(this.jsonotron, this.validateCache, docType, ctorMergeParams)
      applyPatch(doc, ctorMergeParams)
  
      addSystemFieldValuesToNewDocument(doc, docType.name, props.id)
  
      executePreSave(docType, doc)
  
      updateCalcsOnDocument(docType, doc)
  
      ensureDoc(this.jsonotron, this.validateCache, docType, doc)
      executeValidator(docType, doc)
  
      await this.invokePreSaveDocCallback({
        roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew: true
      })

      await this.safeDocStore.upsert(docType.name, docType.pluralName, doc, combinedDocStoreOptions, {})
  
      await this.invokeSavedDocCallback({
        roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew: true
      })
  
      return { isNew: true }
    } else {
      return { isNew: false }
    }
  }

  /**
   * Deletes an existing document.
   * @param props A property bag.
   */
  async deleteDocument (props: DeleteDocumentProps): Promise<DeleteDocumentResult> {
    this.logRequest(`DELETE ${props.docTypeName} ${props.id}`)
    ensureDeletePermission(props.roleNames, this.roleTypes, props.docTypeName)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    ensureCanDeleteDocuments(docType)
  
    const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
    const deleteByIdResult = await this.safeDocStore.deleteById(docType.name, docType.pluralName, props.id, combinedDocStoreOptions, {})
    const isDeleted = deleteByIdResult.code === DocStoreDeleteByIdResultCode.DELETED
  
    if (isDeleted) {
      await this.invokeDeletedDocCallback({
        roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, id: props.id, reqProps: props.reqProps
      })
    }
  
    return { isDeleted }
  }

  /**
   * Operates on an existing document.
   * @param props A property bag.
   */
  async operateOnDocument (props: OperateOnDocumentProps): Promise<OperateOnDocumentResult> {
    this.logRequest(`OPERATE (${props.operationName}) ${props.docTypeName} ${props.id}`)
    ensureOperatePermission(props.roleNames, this.roleTypes, props.docTypeName, props.operationName)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    ensureOperationName(docType, props.operationName)
    const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
    const fetchResult = await this.safeDocStore.fetch(docType.name, docType.pluralName, props.id, combinedDocStoreOptions, {})

    const doc = ensureDocWasFound(docType.name, props.id, fetchResult.doc)

    const opIdAlreadyExists = isOpIdInDocument(doc, props.operationId)

    if (!opIdAlreadyExists) {
      ensureOperationParams(this.jsonotron, this.validateCache, docType, props.operationName, props.operationParams)

      executePreSave(docType, doc)

      const mergePatch = executeOperation(docType, doc, props.operationName, props.operationParams)
      const safeMergePatch = trimInternalPatch(docType, mergePatch)

      applyPatch(doc, safeMergePatch)
      applySystemFieldValuesToUpdatedDocument(docType, doc, props.operationId, 'operation', props.operationName)
      updateCalcsOnDocument(docType, doc)

      ensureDoc(this.jsonotron, this.validateCache, docType, doc)
      executeValidator(docType, doc)

      await this.invokePreSaveDocCallback({
        roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew: false
      })

      const upsertResult = await this.safeDocStore.upsert(docType.name, docType.pluralName, doc, combinedDocStoreOptions, { reqVersion: props.reqVersion || (doc.docVersion as string) })
      ensureUpsertSuccessful(upsertResult, Boolean(props.reqVersion))

      await this.invokeSavedDocCallback({
        roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew: false
      })

      return { isUpdated: true }
    } else {
      return { isUpdated: false }
    }
  }

  /**
   * Patches an existing document with a merge patch.
   * @param props A property bag.
   */
  async patchDocument (props: PatchDocumentProps): Promise<PatchDocumentResult> {
    this.logRequest(`PATCH ${props.docTypeName} ${props.id}`)
    ensurePatchPermission(props.roleNames, this.roleTypes, props.docTypeName)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
    const fetchResult = await this.safeDocStore.fetch(docType.name, docType.pluralName, props.id, combinedDocStoreOptions, {})
  
    const doc = ensureDocWasFound(docType.name, props.id, fetchResult.doc)
  
    const operationIdAlreadyExists = isOpIdInDocument(doc, props.operationId)
  
    if (!operationIdAlreadyExists) {
      ensurePatch(this.jsonotron, this.validateCache, docType, props.patch)
  
      executePreSave(docType, doc)
  
      applyPatch(doc, props.patch)
      applySystemFieldValuesToUpdatedDocument(docType, doc, props.operationId, 'patch')
      updateCalcsOnDocument(docType, doc)
  
      ensureDoc(this.jsonotron, this.validateCache, docType, doc)
      executeValidator(docType, doc)
  
      await this.invokePreSaveDocCallback({
        roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew: false
      })

      const upsertResult = await this.safeDocStore.upsert(docType.name, docType.pluralName, doc, combinedDocStoreOptions, { reqVersion: props.reqVersion || (doc.docVersion as string) })
      ensureUpsertSuccessful(upsertResult, Boolean(props.reqVersion))
  
      await this.invokeSavedDocCallback({
        roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew: false
      })
  
      return { isUpdated: true }
    } else {
      return { isUpdated: false }
    }
  }

  /**
   * Queries for a set of documents using a filter.
   * @param props A property bag.
   */
  async queryDocumentsByFilter (props: QueryDocumentsByFilterProps): Promise<QueryDocumentsByFilterResult> {
    this.logRequest(`QUERY (${props.filterName}) ${props.docTypeName}`)
    ensureQueryPermission(props.roleNames, this.roleTypes, props.docTypeName, props.fieldNames)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    ensureFilterName(docType, props.filterName)
  
    const retrievalFieldNames = determineFieldNamesForRetrieval(docType, props.fieldNames)
    const deprecations = getDeprecationsForRetrievalFieldNames(docType, retrievalFieldNames)

    ensureFilterParams(this.jsonotron, this.validateCache, docType, props.filterName, props.filterParams)
    const filterExpression = evaluateFilter(docType, props.filterName, props.filterParams)
  
    const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
    const queryResult = await this.safeDocStore.queryByFilter(docType.name, docType.pluralName, retrievalFieldNames, filterExpression, combinedDocStoreOptions, {
      limit: props.limit,
      offset: props.offset
    })
  
    const docs = queryResult.docs
    docs.forEach(d => applyDeclaredFieldDefaultsToDocument(docType, d, retrievalFieldNames))
    docs.forEach(d => applyCalculatedFieldValuesToDocument(docType, d, props.fieldNames))
    docs.forEach(d => removeSurplusFieldsFromDocument(d, props.fieldNames))
  
    await this.invokePreQueryDocsCallback({
      roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, reqProps: props.reqProps, fieldNames: props.fieldNames, retrievalFieldNames
    })
  
    return { deprecations, docs }
  }

  /**
   * Queries for a set of documents using an array of document ids.
   * @param props A property bag.
   */
  async queryDocumentsByIds (props: QueryDocumentsByIdsProps): Promise<QueryDocumentsByIdsResult> {
    this.logRequest(`QUERY (IDS) ${props.docTypeName} ${props.ids}`)
    ensureQueryPermission(props.roleNames, this.roleTypes, props.docTypeName, props.fieldNames)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
  
    const retrievalFieldNames = determineFieldNamesForRetrieval(docType, props.fieldNames)
    const deprecations = getDeprecationsForRetrievalFieldNames(docType, retrievalFieldNames)
    const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
    const queryResult = await this.safeDocStore.queryByIds(docType.name, docType.pluralName, retrievalFieldNames, props.ids, combinedDocStoreOptions, {})
  
    const docs = queryResult.docs
    docs.forEach(d => applyDeclaredFieldDefaultsToDocument(docType, d, retrievalFieldNames))
    docs.forEach(d => applyCalculatedFieldValuesToDocument(docType, d, props.fieldNames))
    docs.forEach(d => removeSurplusFieldsFromDocument(d, props.fieldNames))
  
    await this.invokePreQueryDocsCallback({
      roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, reqProps: props.reqProps, fieldNames: props.fieldNames, retrievalFieldNames
    })
  
    return { deprecations, docs }
  }

  /**
   * Queries for all documents of a specified doc type.
   * @param props A property bag.
   */
  async queryDocuments (props: QueryDocumentsProps): Promise<QueryDocumentsResult> {
    this.logRequest(`QUERY (TYPE) ${props.docTypeName}`)
    ensureQueryPermission(props.roleNames, this.roleTypes, props.docTypeName, props.fieldNames)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    ensureCanFetchWholeCollection(docType)
  
    const retrievalFieldNames = determineFieldNamesForRetrieval(docType, props.fieldNames)
    const deprecations = getDeprecationsForRetrievalFieldNames(docType, retrievalFieldNames)
    const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
    const queryResult = await this.safeDocStore.queryAll(docType.name, docType.pluralName, retrievalFieldNames, combinedDocStoreOptions, {
      limit: props.limit,
      offset: props.offset
    })
  
    const docs = queryResult.docs
    docs.forEach(d => applyDeclaredFieldDefaultsToDocument(docType, d, retrievalFieldNames))
    docs.forEach(d => applyCalculatedFieldValuesToDocument(docType, d, props.fieldNames))
    docs.forEach(d => removeSurplusFieldsFromDocument(d, props.fieldNames))
  
    await this.invokePreQueryDocsCallback({
      roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, reqProps: props.reqProps, fieldNames: props.fieldNames, retrievalFieldNames
    })
  
    return { deprecations, docs }
  }

  /**
   * Replaces (or inserts) a document, without using the doc type constructor.
   * @param props A property bag.
   */
  async replaceDocument (props: ReplaceDocumentProps): Promise<ReplaceDocumentResult> {
    this.logRequest(`REPLACE ${props.docTypeName}`)
    ensureReplacePermission(props.roleNames, this.roleTypes, props.docTypeName)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    ensureCanReplaceDocuments(docType)
  
    const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
    executePreSave(docType, props.doc)
  
    const doc = props.doc
    updateCalcsOnDocument(docType, doc)
  
    ensureDoc(this.jsonotron, this.validateCache, docType, doc)
    executeValidator(docType, doc)
  
    await this.invokePreSaveDocCallback({
      roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew: null
    })

    const upsertResult = await this.safeDocStore.upsert(docType.name, docType.pluralName, doc, combinedDocStoreOptions, {})
    ensureUpsertSuccessful(upsertResult, false)
    const isNew = upsertResult.code === DocStoreUpsertResultCode.CREATED
  
    await this.invokeSavedDocCallback({
      roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew
    })
    
    return { isNew }
  }
}
