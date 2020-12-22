import {
  DocStore, DocStoredField, DocStoreDeleteByIdProps, DocStoreDeleteByIdResult, DocStoreExistsResult,
  DocStoreFetchResult, DocStoreOptions, DocStoreQueryProps,
  DocStoreQueryResult, DocStoreUpsertProps, DocStoreUpsertResult,
  MissingDocStoreFunctionError, UnexpectedDocStoreError
} from 'sengi-interfaces'

/**
 * A Doc Store that wraps any errors so the source can be identified.
 */
export class SafeDocStore implements DocStore {
  /**
   * @param docStore A doc store to test.
   * @param functionName The name of a function that should be attached
   * to the given docStore.
   */
  private ensureDocStoreFunction (docStore: unknown, functionName: string): void {
    const record = docStore as Record<string, unknown>

    if (typeof record[functionName] !== 'function') {
      throw new MissingDocStoreFunctionError(functionName)
    }
  }

  /**
   * Constructs a new instance of the class.
   * @param docStore A doc store implementation.
   */
  constructor (readonly docStore: DocStore) {
    this.ensureDocStoreFunction(docStore, 'deleteById')
    this.ensureDocStoreFunction(docStore, 'exists')
    this.ensureDocStoreFunction(docStore, 'fetch')
    this.ensureDocStoreFunction(docStore, 'queryAll')
    this.ensureDocStoreFunction(docStore, 'queryByFilter')
    this.ensureDocStoreFunction(docStore, 'queryByIds')
    this.ensureDocStoreFunction(docStore, 'upsert')
  }

  /**
   * Delete a single document from the store using it's id.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param id The id of a document.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async deleteById (docTypeName: string, docTypePluralName: string, id: string, options: DocStoreOptions, props: DocStoreDeleteByIdProps): Promise<DocStoreDeleteByIdResult> {
    try {
      const result = await this.docStore.deleteById(docTypeName, docTypePluralName, id, options, props)
      return result
    } catch (err) {
      throw new UnexpectedDocStoreError('deleteById', err)
    }
  }

  /**
   * Determines if a document with the given id is in the datastore.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param id The id of a document.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async exists (docTypeName: string, docTypePluralName: string, id: string, options: Record<string, unknown>, props: Record<string, unknown>): Promise<DocStoreExistsResult> {
    try {
      const result = await this.docStore.exists(docTypeName, docTypePluralName, id, options, props)
      return result
    } catch (err) {
      throw new UnexpectedDocStoreError('exists', err)
    }
  }

  /**
   * Fetch a single document using it's id.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param id The id of a document.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async fetch (docTypeName: string, docTypePluralName: string, id: string, options: Record<string, unknown>, props: Record<string, unknown>): Promise<DocStoreFetchResult> {
    try {
      const result = await this.docStore.fetch(docTypeName, docTypePluralName, id, options, props)
      return result
    } catch (err) {
      throw new UnexpectedDocStoreError('fetch', err)
    }
  }

  /**
   * Query for all documents of a specified type.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param fieldNames An array of field names to include in the response.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async queryAll (docTypeName: string, docTypePluralName: string, fieldNames: string[], options: Record<string, unknown>, props: DocStoreQueryProps): Promise<DocStoreQueryResult> {
    try {
      const result = await this.docStore.queryAll(docTypeName, docTypePluralName, fieldNames, options, props)
      return result
    } catch (err) {
      throw new UnexpectedDocStoreError('queryAll', err)
    }
  }

  /**
   * Query for documents of a specified type that also match a filter.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param fieldNames An array of field names to include in the response.
   * @param filterExpression A filter expression that resulted from invoking the filter.
   * implementation on the doc type.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async queryByFilter (docTypeName: string, docTypePluralName: string, fieldNames: string[], filterExpression: unknown, options: Record<string, unknown>, props: DocStoreQueryProps): Promise<DocStoreQueryResult> {
    try {
      const result = await this.docStore.queryByFilter(docTypeName, docTypePluralName, fieldNames, filterExpression, options, props)
      return result
    } catch (err) {
      throw new UnexpectedDocStoreError('queryByFilter', err)
    }
  }

  /**
   * Query for documents of a specified type that also have one of the given ids.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param fieldNames An array of field names to include in the response.
   * @param ids An array of document ids.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async queryByIds (docTypeName: string, docTypePluralName: string, fieldNames: string[], ids: string[], options: Record<string, unknown>, props: DocStoreQueryProps): Promise<DocStoreQueryResult> {
    try {
      const result = await this.docStore.queryByIds(docTypeName, docTypePluralName, fieldNames, ids, options, props)
      return result
    } catch (err) {
      throw new UnexpectedDocStoreError('queryByIds', err)
    }
  }

  /**
   * Store a single document in the store, overwriting an existing if necessary.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param doc The document to store.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async upsert (docTypeName: string, docTypePluralName: string, doc: Record<string, DocStoredField>, options: Record<string, unknown>, props: DocStoreUpsertProps): Promise<DocStoreUpsertResult> {
    try {
      const result = await this.docStore.upsert(docTypeName, docTypePluralName, doc, options, props)
      return result
    } catch (err) {
      throw new UnexpectedDocStoreError('upsert', err)
    }
  }
}
