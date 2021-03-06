/* eslint-disable @typescript-eslint/no-explicit-any */
import Ajv, { AnySchema } from 'ajv'
import { 
  AnyDocType,
  ConstructDocumentProps,
  ConstructDocumentResult,
  DeletedDocCallback,
  DeleteDocumentProps,
  DeleteDocumentResult,
  DocRecord,
  DocStore,
  DocStoreDeleteByIdResultCode,
  DocStoreUpsertResultCode,
  DocType,
  NewDocumentProps,
  NewDocumentResult,
  OperateOnDocumentProps,
  OperateOnDocumentResult,
  PatchDocumentProps,
  PatchDocumentResult,
  PreSaveDocCallback,
  PreSelectDocsCallback,
  QueryDocumentsProps,
  QueryDocumentsResult,
  ReplaceDocumentProps,
  ReplaceDocumentResult,
  RoleType,
  SavedDocCallback,
  SelectDocumentsByFilterProps,
  SelectDocumentsByFilterResult,
  SelectDocumentsByIdsProps,
  SelectDocumentsByIdsResult,
  SelectDocumentsProps,
  SelectDocumentsResult,
  SengiCallbackError
 } from 'sengi-interfaces'
import {
  ensureUpsertSuccessful,
  SafeDocStore
} from '../docStore'
import {
  ensureCreatePermission,
  ensureDeletePermission,
  ensureOperatePermission,
  ensurePatchPermission,
  ensureQueryPermission,
  ensureReplacePermission,
  ensureSelectPermission
} from '../roleTypes'
import {
  appendDocOpId,
  ensureCanDeleteDocuments,
  ensureCanFetchWholeCollection,
  ensureCanReplaceDocuments,
  ensureDoc,
  ensureDocWasFound,
  executeConstructor,
  parseFilter,
  executeOperation,
  executePatch,
  executePreSave,
  executeValidator,
  isOpIdInDocument,
  selectDocTypeFromArray,
  parseQuery,
  coerceQuery,
  ensureNewDocIdsMatch
} from '../docTypes'

/**
 * The properties that are used to manage the construction of a Sengi.
 */
export interface SengiConstructorProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult> {
  schemas?: AnySchema[]
  docTypes?: DocType<any, DocStoreOptions, Filter, Query, QueryResult>[]
  roleTypes?: RoleType[]
  docStore?: DocStore<DocStoreOptions, Filter, Query, QueryResult>
  log?: boolean
  onSavedDoc?: SavedDocCallback<RequestProps, any, DocStoreOptions, Filter, Query, QueryResult>
  onDeletedDoc?: DeletedDocCallback<RequestProps, any, DocStoreOptions, Filter, Query, QueryResult>
  onPreSaveDoc?: PreSaveDocCallback<RequestProps, any, DocStoreOptions, Filter, Query, QueryResult>
  onPreSelectDocs?: PreSelectDocsCallback<RequestProps, any, DocStoreOptions, Filter, Query, QueryResult>
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
  private onPreSelectDocs?: PreSelectDocsCallback<RequestProps, any, DocStoreOptions, Filter, Query, QueryResult>

  /**
   * Creates a new Sengi engine based on a set of doc types and role types.
   * @param props The constructor properties.
   */
  constructor (props: SengiConstructorProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult>) {
    this.ajv = new Ajv({
      ownProperties: true,
      schemas: props.schemas || []
    })
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
    this.onPreSelectDocs = props.onPreSelectDocs
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
   * Creates a new document by invoking a constructor.
   * @param props A property bag.
   */
   async createDocument (props: ConstructDocumentProps<RequestProps, DocStoreOptions>): Promise<ConstructDocumentResult> {
    this.logRequest(`CREATE ${props.docTypeName}`)
    ensureCreatePermission(props.roleNames, this.roleTypes, props.docTypeName)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    const combinedDocStoreOptions = { ...docType.docStoreOptions, ...props.docStoreOptions }
    const existsResult = await this.safeDocStore.exists(docType.name, docType.pluralName, props.id, combinedDocStoreOptions, {})
  
    if (!existsResult.found) {
      const doc = executeConstructor(this.ajv, docType, props.constructorName, props.constructorParams)

      doc.id = props.id
      doc.docType = docType.name
      doc.docOpIds = []

      executePreSave(docType, doc)
      ensureDoc(this.ajv, docType, doc)
      executeValidator(docType, doc)
    
      await this.invokePreSaveDocCallback(props.roleNames, combinedDocStoreOptions, docType, doc, props.reqProps, true)
      await this.safeDocStore.upsert(docType.name, docType.pluralName, doc, combinedDocStoreOptions, {})
      await this.invokeSavedDocCallback(props.roleNames, combinedDocStoreOptions, docType, doc, props.reqProps, true)
    }
    
    return { isNew: !existsResult.found }
  }

  /**
   * Deletes an existing document.
   * @param props A property bag.
   */
  async deleteDocument (props: DeleteDocumentProps<RequestProps, DocStoreOptions>): Promise<DeleteDocumentResult> {
    this.logRequest(`DELETE ${props.docTypeName} ${props.id}`)
    ensureDeletePermission(props.roleNames, this.roleTypes, props.docTypeName)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    ensureCanDeleteDocuments(docType)
  
    const combinedDocStoreOptions = { ...docType.docStoreOptions, ...props.docStoreOptions }
    const deleteByIdResult = await this.safeDocStore.deleteById(docType.name, docType.pluralName, props.id, combinedDocStoreOptions, {})
    const isDeleted = deleteByIdResult.code === DocStoreDeleteByIdResultCode.DELETED
  
    if (isDeleted) {
      await this.invokeDeletedDocCallback(props.roleNames, combinedDocStoreOptions, docType, props.id, props.reqProps)
    }
  
    return { isDeleted }
  }

  /**
   * Adds a new document to a collection by supplying all the data.
   * @param props A property bag.
   */
  async newDocument (props: NewDocumentProps<RequestProps, DocStoreOptions>): Promise<NewDocumentResult> {
    this.logRequest(`NEW ${props.docTypeName}`)
    ensureCreatePermission(props.roleNames, this.roleTypes, props.docTypeName)
    ensureNewDocIdsMatch(props.id, props.doc.id as string)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    const combinedDocStoreOptions = { ...docType.docStoreOptions, ...props.docStoreOptions }
    const existsResult = await this.safeDocStore.exists(docType.name, docType.pluralName, props.id, combinedDocStoreOptions, {})
  
    if (!existsResult.found) {
      const doc = props.doc

      doc.id = props.id
      doc.docType = docType.name
      doc.docOpIds = []

      executePreSave(docType, doc)
      ensureDoc(this.ajv, docType, doc)
      executeValidator(docType, doc)
    
      await this.invokePreSaveDocCallback(props.roleNames, combinedDocStoreOptions, docType, doc, props.reqProps, true)
      await this.safeDocStore.upsert(docType.name, docType.pluralName, doc, combinedDocStoreOptions, {})
      await this.invokeSavedDocCallback(props.roleNames, combinedDocStoreOptions, docType, doc, props.reqProps, true)
    }
    
    return { isNew: !existsResult.found }
  }

  /**
   * Operates on an existing document.
   * @param props A property bag.
   */
  async operateOnDocument (props: OperateOnDocumentProps<RequestProps, DocStoreOptions>): Promise<OperateOnDocumentResult> {
    this.logRequest(`OPERATE (${props.operationName}) ${props.docTypeName} ${props.id}`)
    ensureOperatePermission(props.roleNames, this.roleTypes, props.docTypeName, props.operationName)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    const combinedDocStoreOptions = { ...docType.docStoreOptions, ...props.docStoreOptions }
    const fetchResult = await this.safeDocStore.fetch(docType.name, docType.pluralName, props.id, combinedDocStoreOptions, {})

    const doc = ensureDocWasFound(docType.name, props.id, fetchResult.doc)
    const opIdAlreadyExists = isOpIdInDocument(doc, props.operationId)

    if (!opIdAlreadyExists) {
      executeOperation(this.ajv, docType, props.operationName, props.operationParams, doc)
      appendDocOpId(docType, doc, props.operationId)

      executePreSave(docType, doc)
      ensureDoc(this.ajv, docType, doc)
      executeValidator(docType, doc)

      await this.invokePreSaveDocCallback(props.roleNames, combinedDocStoreOptions, docType, doc, props.reqProps, false)
      const upsertResult = await this.safeDocStore.upsert(docType.name, docType.pluralName, doc, combinedDocStoreOptions, { reqVersion: props.reqVersion || (doc.docVersion as string) })
      ensureUpsertSuccessful(upsertResult, Boolean(props.reqVersion))
      await this.invokeSavedDocCallback(props.roleNames, combinedDocStoreOptions, docType, doc, props.reqProps, false)
    }
    
    return { isUpdated: !opIdAlreadyExists }
  }

  /**
   * Patches an existing document with a merge patch.
   * @param props A property bag.
   */
  async patchDocument (props: PatchDocumentProps<RequestProps, DocStoreOptions>): Promise<PatchDocumentResult> {
    this.logRequest(`PATCH ${props.docTypeName} ${props.id}`)
    ensurePatchPermission(props.roleNames, this.roleTypes, props.docTypeName)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    const combinedDocStoreOptions = { ...docType.docStoreOptions, ...props.docStoreOptions }
    const fetchResult = await this.safeDocStore.fetch(docType.name, docType.pluralName, props.id, combinedDocStoreOptions, {})
  
    const doc = ensureDocWasFound(docType.name, props.id, fetchResult.doc)
    const opIdAlreadyExists = isOpIdInDocument(doc, props.operationId)
  
    if (!opIdAlreadyExists) {
      executePatch(docType, doc, props.patch)
      appendDocOpId(docType, doc, props.operationId)

      executePreSave(docType, doc)
      ensureDoc(this.ajv, docType, doc)
      executeValidator(docType, doc)

      this.invokePreSaveDocCallback(props.roleNames, combinedDocStoreOptions, docType, doc, props.reqProps, false)
      const upsertResult = await this.safeDocStore.upsert(docType.name, docType.pluralName, doc, combinedDocStoreOptions, { reqVersion: props.reqVersion || (doc.docVersion as string) })
      ensureUpsertSuccessful(upsertResult, Boolean(props.reqVersion))
      this.invokeSavedDocCallback(props.roleNames, combinedDocStoreOptions, docType, doc, props.reqProps, false)
    }

    return { isUpdated: !opIdAlreadyExists }
  }

  /**
   * Executes a query across a set of documents.
   * @param props A property bag.
   */
  async queryDocuments (props: QueryDocumentsProps<RequestProps, DocStoreOptions>): Promise<QueryDocumentsResult> {
    this.logRequest(`QUERY (${props.queryName}) ${props.docTypeName}`)
    ensureQueryPermission(props.roleNames, this.roleTypes, props.docTypeName, props.queryName)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    const query = parseQuery(this.ajv, docType, props.queryName, props.queryParams)

    const combinedDocStoreOptions = { ...docType.docStoreOptions, ...props.docStoreOptions }
    const queryResult = await this.safeDocStore.query(docType.name, docType.pluralName, query, combinedDocStoreOptions, {})

    const responseData = coerceQuery(this.ajv, docType, props.queryName, queryResult.data)
  
    return { data: responseData }
  }

  /**
   * Replaces (or inserts) a document.
   * Unlike the newDocument function, this function will replace an existing document.
   * @param props A property bag.
   */
  async replaceDocument (props: ReplaceDocumentProps<RequestProps, DocStoreOptions>): Promise<ReplaceDocumentResult> {
    this.logRequest(`REPLACE ${props.docTypeName}`)
    ensureReplacePermission(props.roleNames, this.roleTypes, props.docTypeName)
    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    ensureCanReplaceDocuments(docType)
  
    const doc = props.doc

    executePreSave(docType, doc)
    ensureDoc(this.ajv, docType, doc)
    executeValidator(docType, doc)

    const combinedDocStoreOptions = { ...docType.docStoreOptions, ...props.docStoreOptions }

    await this.invokePreSaveDocCallback(props.roleNames, combinedDocStoreOptions, docType, doc, props.reqProps, null)
    const upsertResult = await this.safeDocStore.upsert(docType.name, docType.pluralName, doc, combinedDocStoreOptions, {})
    const isNew = upsertResult.code === DocStoreUpsertResultCode.CREATED
    await this.invokeSavedDocCallback(props.roleNames, combinedDocStoreOptions, docType, doc, props.reqProps, isNew)

    return { isNew }
  }

  /**
   * Selects a set of documents using a filter.
   * @param props A property bag.
   */
  async selectDocumentsByFilter (props: SelectDocumentsByFilterProps<RequestProps, DocStoreOptions>): Promise<SelectDocumentsByFilterResult> {
    this.logRequest(`SELECT (${props.filterName}) ${props.docTypeName}`)
    ensureSelectPermission(props.roleNames, this.roleTypes, props.docTypeName, props.fieldNames)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    const filter = parseFilter(this.ajv, docType, props.filterName, props.filterParams)

    const combinedDocStoreOptions = { ...docType.docStoreOptions, ...props.docStoreOptions }
    await this.invokePreSelectDocsCallback(props.roleNames, combinedDocStoreOptions, docType, props.reqProps, props.fieldNames)

    const queryResult = await this.safeDocStore.selectByFilter(docType.name, docType.pluralName, props.fieldNames, filter, combinedDocStoreOptions, {
      limit: props.limit,
      offset: props.offset
    })
    
    return { docs: queryResult.docs }
  }

  /**
   * Selects a set of documents using an array of document ids.
   * @param props A property bag.
   */
  async selectDocumentsByIds (props: SelectDocumentsByIdsProps<RequestProps, DocStoreOptions>): Promise<SelectDocumentsByIdsResult> {
    this.logRequest(`SELECT (IDS) ${props.docTypeName} ${props.ids}`)
    ensureSelectPermission(props.roleNames, this.roleTypes, props.docTypeName, props.fieldNames)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
  
    const combinedDocStoreOptions = { ...docType.docStoreOptions, ...props.docStoreOptions }
    await this.invokePreSelectDocsCallback(props.roleNames, combinedDocStoreOptions, docType, props.reqProps, props.fieldNames)

    const queryResult = await this.safeDocStore.selectByIds(docType.name, docType.pluralName, props.fieldNames, props.ids, combinedDocStoreOptions, {})
  
    return { docs: queryResult.docs }
  }

  /**
   * Selects all documents of a specified doc type.
   * @param props A property bag.
   */
  async selectDocuments (props: SelectDocumentsProps<RequestProps, DocStoreOptions>): Promise<SelectDocumentsResult> {
    this.logRequest(`SELECT (TYPE) ${props.docTypeName}`)
    ensureSelectPermission(props.roleNames, this.roleTypes, props.docTypeName, props.fieldNames)

    const docType = selectDocTypeFromArray(this.docTypes, props.docTypeName)
    ensureCanFetchWholeCollection(docType)
  
    const combinedDocStoreOptions = { ...docType.docStoreOptions, ...props.docStoreOptions }
    await this.invokePreSelectDocsCallback(props.roleNames, combinedDocStoreOptions, docType, props.reqProps, props.fieldNames)

    const queryResult = await this.safeDocStore.selectAll(docType.name, docType.pluralName, props.fieldNames, combinedDocStoreOptions, {
      limit: props.limit,
      offset: props.offset
    })
  
    return { docs: queryResult.docs }
  }

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
   * Invokes the onDeletedDoc callback if one has been supplied.
   * @param roleNames The rolenames associated with the request.
   * @param docStoreOptions A set of doc store options.
   * @param docType A document type.
   * @param id The id of the document that was deleted.
   * @param reqProps The properties associated with the original request.
   */
  private async invokeDeletedDocCallback (roleNames: string[], docStoreOptions: DocStoreOptions, docType: AnyDocType, id: string, reqProps: RequestProps) {
    await this.invokeCallback('onDeletedDoc', async () => {
      if (this.onDeletedDoc) {
        await this.onDeletedDoc({ roleNames, docStoreOptions, docType, id, reqProps })
      }
    })
  }

  /**
   * Invokes the onPreSelectDocs callback if one has been supplied.
   * @param roleNames The rolenames associated with the request.
   * @param docStoreOptions A set of doc store options.
   * @param docType A document type.
   * @param reqProps The properties associated with the original request.
   * @param fieldNames An array of requested field names.
   */
   private async invokePreSelectDocsCallback (roleNames: string[], docStoreOptions: DocStoreOptions, docType: AnyDocType, reqProps: RequestProps, fieldNames: string[]) {
    await this.invokeCallback('onPreSelectDocs', async () => {
      if (this.onPreSelectDocs) {
        await this.onPreSelectDocs({ roleNames, docStoreOptions, docType, reqProps, fieldNames })
      }
    })
  }

  /**
   * Invokes the onPreSaveDoc callback if one has been supplied.
   * @param roleNames The rolenames associated with the request.
   * @param docStoreOptions A set of doc store options.
   * @param docType A document type.
   * @param doc The doc that is about to be saved.
   * @param reqProps The properties associated with the original request.
   * @param isNew True if the document does not exist.  This will always be
   * false for replaceDocuments as it is not known if the document exists
   * when this event is raised.
   */
   private async invokePreSaveDocCallback (roleNames: string[], docStoreOptions: DocStoreOptions, docType: AnyDocType, doc: DocRecord, reqProps: RequestProps, isNew: boolean|null) {
    await this.invokeCallback('onPreSaveDoc', async () => {
      if (this.onPreSaveDoc) {
        await this.onPreSaveDoc({ roleNames, docStoreOptions, docType, doc, reqProps, isNew })
      }
    })
  }

  /**
   * Invokes the onSavedDoc callback if one has been supplied.
   * @param roleNames The rolenames associated with the request.
   * @param docStoreOptions A set of doc store options.
   * @param docType A document type.
   * @param doc The doc that was saved.
   * @param reqProps The properties associated with the original request.
   * @param isNew True if the document was created as a result of this operation.
   */
  private async invokeSavedDocCallback (roleNames: string[], docStoreOptions: DocStoreOptions, docType: AnyDocType, doc: DocRecord, reqProps: RequestProps, isNew: boolean) {
    await this.invokeCallback('onSavedDoc', async () => {
      if (this.onSavedDoc) {
        await this.onSavedDoc({ roleNames, docStoreOptions, docType, doc, reqProps, isNew })
      }
    })
  }
}
