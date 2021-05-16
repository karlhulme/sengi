/* eslint-disable @typescript-eslint/no-explicit-any */
import Ajv from 'ajv'
import { 
  ConstructDocumentProps,
  ConstructDocumentResult,
  DeletedDocCallback,
  DocStore,
  DocType,
  PreQueryDocsCallback,
  PreSaveDocCallback,
  RoleType,
  SavedDocCallback,
  SengiCallbackError
 } from 'sengi-interfaces'
 import { SafeDocStore } from '../docStore'
import { ensureCreatePermission } from '../roleTypes'
import { executeConstructor } from './executeConstructor'
import { selectDocTypeFromArray } from './selectDocTypeFromArray'

/**
 * The properties that are used to manage the construction of a Sengi.
 */
export interface SengiConstructorProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult> {
  docTypes?: DocType<any, DocStoreOptions, Filter, Query, QueryResult>[]
  roleTypes?: RoleType[]
  docStore?: DocStore<DocStoreOptions, Filter, Query, QueryResult>
  log?: boolean
  onSavedDoc?: SavedDocCallback<RequestProps, any, DocStoreOptions, Filter, Query, QueryResult>
  onDeletedDoc?: DeletedDocCallback<RequestProps, any, DocStoreOptions, Filter, Query, QueryResult>
  onPreSaveDoc?: PreSaveDocCallback<RequestProps, any, DocStoreOptions, Filter, Query, QueryResult>
  onPreQueryDocs?: PreQueryDocsCallback<RequestProps, any, DocStoreOptions, Filter, Query, QueryResult>
}

/**
 * A sengi engine for processing selection, querying and upsertion of docs
 * to a No-SQL, document based database or backing store.
 */
export class Sengi<RequestProps, DocStoreOptions, Filter, Query, QueryResult> {
  private ajv: Ajv
  private docTypes: DocType<any, DocStoreOptions, Filter, Query, QueryResult>[]
  private roleTypes: RoleType[]
  private safeDocStore: SafeDocStore<DocStoreOptions, Filter, Query, QueryResult>
  private log: boolean

  private onSavedDoc?: SavedDocCallback<RequestProps, any, DocStoreOptions, Filter, Query, QueryResult>
  private onDeletedDoc?: DeletedDocCallback<RequestProps, any, DocStoreOptions, Filter, Query, QueryResult>
  private onPreSaveDoc?: PreSaveDocCallback<RequestProps, any, DocStoreOptions, Filter, Query, QueryResult>
  private onPreQueryDocs?: PreQueryDocsCallback<RequestProps, any, DocStoreOptions, Filter, Query, QueryResult>

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
   * Invokes the given callback function, wrapping any errors in a SengiCallbackError.
   * @param name The name of the callback.
   * @param callback A function that executes a callback.
   */
  private async invokeCallback (name: string, callback: () => Promise<void>) {
    try {
      await callback()
    } catch (err) {
      throw new SengiCallbackError(name, err)
    }
  }

  /**
   * Creates a new Sengi engine based on a set of doc types and role types.
   * @param props The constructor properties.
   */
  constructor (props: SengiConstructorProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult>) {
    this.ajv = new Ajv()
    this.docTypes = props.docTypes || []
    this.roleTypes = props.roleTypes || []
    this.log = Boolean(props.log)

    if (!props.docStore) {
      throw new Error('Must supply a docStore.')
    }

    this.safeDocStore = new SafeDocStore(props.docStore)

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
   * Creates a new document by supplying all the data.
   * @param props A property bag.
   */
  async newDocument (props: ConstructDocumentProps<RequestProps, DocStoreOptions>): Promise<ConstructDocumentResult> {
    this.logRequest(`NEW ${props.docTypeName}`)
    ensureCreatePermission(props.roleNames, this.roleTypes, props.docTypeName)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    const combinedDocStoreOptions = { ...docType.docStoreOptions, ...props.docStoreOptions }
    const existsResult = await this.safeDocStore.exists(docType.name, docType.pluralName, props.id, combinedDocStoreOptions, {})
  
    if (!existsResult.found) {
      // const doc = executeConstructor()
      executeConstructor(this.ajv, docType, props.constructorName, props.constructorParams)

      // const ctorDeclaredParams = extractConstructorDeclaredParams(docType, props.constructorParams)
      // ensureConstructorParams(this.jsonotron, this.validateCache, docType, props.constructorParams)

      // const ctorMergeParams = extractConstructorMergeParams(docType, props.constructorParams)
      // ensurePatch(this.jsonotron, this.validateCache, docType, ctorMergeParams)

      // applyPatch(doc, ctorMergeParams)
  
      // addSystemFieldValuesToNewDocument(doc, docType.name, props.id)
  
      // executePreSave(docType, doc)
  
      // updateCalcsOnDocument(docType, doc)
  
      // ensureDoc(this.jsonotron, this.validateCache, docType, doc)
      // executeValidator(docType, doc)
  
      // this.invokeCallback('onPreSaveDoc', async () => {
      //   if (this.onPreSaveDoc) {
      //     await this.onPreSaveDoc({
      //       roleNames: props.roleNames,
      //       docStoreOptions: combinedDocStoreOptions,
      //       docType: docType as DocType<unknown, DocStoreOptions, Filter, Query, QueryResult>,
      //       doc,
      //       reqProps: props.reqProps,
      //       isNew: true
      //     })
      //   }
      // })

      // await this.safeDocStore.upsert(docType.name, docType.pluralName, doc, combinedDocStoreOptions, {})
  
      // await this.invokeSavedDocCallback({
      //   roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew: true
      // })
  
      return { isNew: true }
    } else {
      return { isNew: false }
    }
  }

  // /**
  //  * Deletes an existing document.
  //  * @param props A property bag.
  //  */
  // async deleteDocument (props: DeleteDocumentProps): Promise<DeleteDocumentResult> {
  //   this.logRequest(`DELETE ${props.docTypeName} ${props.id}`)
  //   ensureDeletePermission(props.roleNames, this.roleTypes, props.docTypeName)

  //   const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
  //   ensureCanDeleteDocuments(docType)
  
  //   const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
  //   const deleteByIdResult = await this.safeDocStore.deleteById(docType.name, docType.pluralName, props.id, combinedDocStoreOptions, {})
  //   const isDeleted = deleteByIdResult.code === DocStoreDeleteByIdResultCode.DELETED
  
  //   if (isDeleted) {
  //     await this.invokeDeletedDocCallback({
  //       roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, id: props.id, reqProps: props.reqProps
  //     })
  //   }
  
  //   return { isDeleted }
  // }

  // /**
  //  * Operates on an existing document.
  //  * @param props A property bag.
  //  */
  // async operateOnDocument (props: OperateOnDocumentProps): Promise<OperateOnDocumentResult> {
  //   this.logRequest(`OPERATE (${props.operationName}) ${props.docTypeName} ${props.id}`)
  //   ensureOperatePermission(props.roleNames, this.roleTypes, props.docTypeName, props.operationName)

  //   const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
  //   ensureOperationName(docType, props.operationName)
  //   const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
  //   const fetchResult = await this.safeDocStore.fetch(docType.name, docType.pluralName, props.id, combinedDocStoreOptions, {})

  //   const doc = ensureDocWasFound(docType.name, props.id, fetchResult.doc)

  //   const opIdAlreadyExists = isOpIdInDocument(doc, props.operationId)

  //   if (!opIdAlreadyExists) {
  //     ensureOperationParams(this.jsonotron, this.validateCache, docType, props.operationName, props.operationParams)

  //     executePreSave(docType, doc)

  //     const mergePatch = executeOperation(docType, doc, props.operationName, props.operationParams)
  //     const safeMergePatch = trimInternalPatch(docType, mergePatch)

  //     applyPatch(doc, safeMergePatch)
  //     applySystemFieldValuesToUpdatedDocument(docType, doc, props.operationId, 'operation', props.operationName)
  //     updateCalcsOnDocument(docType, doc)

  //     ensureDoc(this.jsonotron, this.validateCache, docType, doc)
  //     executeValidator(docType, doc)

  //     await this.invokePreSaveDocCallback({
  //       roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew: false
  //     })

  //     const upsertResult = await this.safeDocStore.upsert(docType.name, docType.pluralName, doc, combinedDocStoreOptions, { reqVersion: props.reqVersion || (doc.docVersion as string) })
  //     ensureUpsertSuccessful(upsertResult, Boolean(props.reqVersion))

  //     await this.invokeSavedDocCallback({
  //       roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew: false
  //     })

  //     return { isUpdated: true }
  //   } else {
  //     return { isUpdated: false }
  //   }
  // }

  // /**
  //  * Patches an existing document with a merge patch.
  //  * @param props A property bag.
  //  */
  // async patchDocument (props: PatchDocumentProps): Promise<PatchDocumentResult> {
  //   this.logRequest(`PATCH ${props.docTypeName} ${props.id}`)
  //   ensurePatchPermission(props.roleNames, this.roleTypes, props.docTypeName)

  //   const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
  //   const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
  //   const fetchResult = await this.safeDocStore.fetch(docType.name, docType.pluralName, props.id, combinedDocStoreOptions, {})
  
  //   const doc = ensureDocWasFound(docType.name, props.id, fetchResult.doc)
  
  //   const operationIdAlreadyExists = isOpIdInDocument(doc, props.operationId)
  
  //   if (!operationIdAlreadyExists) {
  //     ensurePatch(this.jsonotron, this.validateCache, docType, props.patch)
  
  //     executePreSave(docType, doc)
  
  //     applyPatch(doc, props.patch)
  //     applySystemFieldValuesToUpdatedDocument(docType, doc, props.operationId, 'patch')
  //     updateCalcsOnDocument(docType, doc)
  
  //     ensureDoc(this.jsonotron, this.validateCache, docType, doc)
  //     executeValidator(docType, doc)
  
  //     await this.invokePreSaveDocCallback({
  //       roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew: false
  //     })

  //     const upsertResult = await this.safeDocStore.upsert(docType.name, docType.pluralName, doc, combinedDocStoreOptions, { reqVersion: props.reqVersion || (doc.docVersion as string) })
  //     ensureUpsertSuccessful(upsertResult, Boolean(props.reqVersion))
  
  //     await this.invokeSavedDocCallback({
  //       roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew: false
  //     })
  
  //     return { isUpdated: true }
  //   } else {
  //     return { isUpdated: false }
  //   }
  // }

  // /**
  //  * Queries for a set of documents using a filter.
  //  * @param props A property bag.
  //  */
  // async queryDocumentsByFilter (props: QueryDocumentsByFilterProps): Promise<QueryDocumentsByFilterResult> {
  //   this.logRequest(`QUERY (${props.filterName}) ${props.docTypeName}`)
  //   ensureQueryPermission(props.roleNames, this.roleTypes, props.docTypeName, props.fieldNames)

  //   const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
  //   ensureFilterName(docType, props.filterName)
  
  //   const retrievalFieldNames = determineFieldNamesForRetrieval(docType, props.fieldNames)
  //   const deprecations = getDeprecationsForRetrievalFieldNames(docType, retrievalFieldNames)

  //   ensureFilterParams(this.jsonotron, this.validateCache, docType, props.filterName, props.filterParams)
  //   const filterExpression = evaluateFilter(docType, props.filterName, props.filterParams)
  
  //   const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
  //   const queryResult = await this.safeDocStore.queryByFilter(docType.name, docType.pluralName, retrievalFieldNames, filterExpression, combinedDocStoreOptions, {
  //     limit: props.limit,
  //     offset: props.offset
  //   })
  
  //   const docs = queryResult.docs
  //   docs.forEach(d => applyDeclaredFieldDefaultsToDocument(docType, d, retrievalFieldNames))
  //   docs.forEach(d => applyCalculatedFieldValuesToDocument(docType, d, props.fieldNames))
  //   docs.forEach(d => removeSurplusFieldsFromDocument(d, props.fieldNames))
  
  //   await this.invokePreQueryDocsCallback({
  //     roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, reqProps: props.reqProps, fieldNames: props.fieldNames, retrievalFieldNames
  //   })
  
  //   return { deprecations, docs }
  // }

  // /**
  //  * Queries for a set of documents using an array of document ids.
  //  * @param props A property bag.
  //  */
  // async queryDocumentsByIds (props: QueryDocumentsByIdsProps): Promise<QueryDocumentsByIdsResult> {
  //   this.logRequest(`QUERY (IDS) ${props.docTypeName} ${props.ids}`)
  //   ensureQueryPermission(props.roleNames, this.roleTypes, props.docTypeName, props.fieldNames)

  //   const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
  
  //   const retrievalFieldNames = determineFieldNamesForRetrieval(docType, props.fieldNames)
  //   const deprecations = getDeprecationsForRetrievalFieldNames(docType, retrievalFieldNames)
  //   const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
  //   const queryResult = await this.safeDocStore.queryByIds(docType.name, docType.pluralName, retrievalFieldNames, props.ids, combinedDocStoreOptions, {})
  
  //   const docs = queryResult.docs
  //   docs.forEach(d => applyDeclaredFieldDefaultsToDocument(docType, d, retrievalFieldNames))
  //   docs.forEach(d => applyCalculatedFieldValuesToDocument(docType, d, props.fieldNames))
  //   docs.forEach(d => removeSurplusFieldsFromDocument(d, props.fieldNames))
  
  //   await this.invokePreQueryDocsCallback({
  //     roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, reqProps: props.reqProps, fieldNames: props.fieldNames, retrievalFieldNames
  //   })
  
  //   return { deprecations, docs }
  // }

  // /**
  //  * Queries for all documents of a specified doc type.
  //  * @param props A property bag.
  //  */
  // async queryDocuments (props: QueryDocumentsProps): Promise<QueryDocumentsResult> {
  //   this.logRequest(`QUERY (TYPE) ${props.docTypeName}`)
  //   ensureQueryPermission(props.roleNames, this.roleTypes, props.docTypeName, props.fieldNames)

  //   const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
  //   ensureCanFetchWholeCollection(docType)
  
  //   const retrievalFieldNames = determineFieldNamesForRetrieval(docType, props.fieldNames)
  //   const deprecations = getDeprecationsForRetrievalFieldNames(docType, retrievalFieldNames)
  //   const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
  //   const queryResult = await this.safeDocStore.queryAll(docType.name, docType.pluralName, retrievalFieldNames, combinedDocStoreOptions, {
  //     limit: props.limit,
  //     offset: props.offset
  //   })
  
  //   const docs = queryResult.docs
  //   docs.forEach(d => applyDeclaredFieldDefaultsToDocument(docType, d, retrievalFieldNames))
  //   docs.forEach(d => applyCalculatedFieldValuesToDocument(docType, d, props.fieldNames))
  //   docs.forEach(d => removeSurplusFieldsFromDocument(d, props.fieldNames))
  
  //   await this.invokePreQueryDocsCallback({
  //     roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, reqProps: props.reqProps, fieldNames: props.fieldNames, retrievalFieldNames
  //   })
  
  //   return { deprecations, docs }
  // }

  // /**
  //  * Replaces (or inserts) a document, without using the doc type constructor.
  //  * @param props A property bag.
  //  */
  // async replaceDocument (props: ReplaceDocumentProps): Promise<ReplaceDocumentResult> {
  //   this.logRequest(`REPLACE ${props.docTypeName}`)
  //   ensureReplacePermission(props.roleNames, this.roleTypes, props.docTypeName)

  //   const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
  //   ensureCanReplaceDocuments(docType)
  
  //   const combinedDocStoreOptions = createDocStoreOptions(docType, props.docStoreOptions)
  //   executePreSave(docType, props.doc)
  
  //   const doc = props.doc
  //   updateCalcsOnDocument(docType, doc)
  
  //   ensureDoc(this.jsonotron, this.validateCache, docType, doc)
  //   executeValidator(docType, doc)
  
  //   await this.invokePreSaveDocCallback({
  //     roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew: null
  //   })

  //   const upsertResult = await this.safeDocStore.upsert(docType.name, docType.pluralName, doc, combinedDocStoreOptions, {})
  //   ensureUpsertSuccessful(upsertResult, false)
  //   const isNew = upsertResult.code === DocStoreUpsertResultCode.CREATED
  
  //   await this.invokeSavedDocCallback({
  //     roleNames: props.roleNames, docStoreOptions: combinedDocStoreOptions, docType, doc, reqProps: props.reqProps, isNew
  //   })
    
  //   return { isNew }
  // }
}
