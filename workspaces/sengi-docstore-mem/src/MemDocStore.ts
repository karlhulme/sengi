/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  Doc, DocFragment, DocStore, DocStoreDeleteByIdProps, DocStoreDeleteByIdResult, DocStoreDeleteByIdResultCode,
  DocStoreExistsProps, DocStoreExistsResult, DocStoreFetchProps, DocStoreFetchResult, DocStoreQueryProps,
  DocStoreQueryResult, DocStoreUpsertProps, DocStoreUpsertResult, DocStoreUpsertResultCode, SengiCommandFailedError
} from 'sengi-interfaces'
import { DocStoreCommandProps } from 'sengi-interfaces/types/docStore/DocStoreCommandProps'
import { DocStoreCommandResult } from 'sengi-interfaces/types/docStore/DocStoreCommandResult'

/**
 * The parameters for constructing a MemDocStore.
 */
interface MemDocStoreConstructorProps {
  /**
   * An array of documents to use as the initial contents of the document store.
   */
  docs: Doc[]

  /**
   * A function that returns a unique string.
   */
  generateDocVersionFunc: () => string
}

type MemDocStoreOptions = Record<string, unknown>
type MemDocStoreFilter = (d: Doc) => boolean
type MemDocStoreCommand = string
interface MemDocStoreCommandResult { count?: number }

/**
 * An in-memory document store.
 */
export class MemDocStore implements DocStore<MemDocStoreOptions, MemDocStoreFilter, MemDocStoreCommand, MemDocStoreCommandResult> {
  /**
   * An array of documents.
   */
  docs: Doc[]

  /**
   * A function that creates a unique document version number.
   */
  generateDocVersionFunc: () => string

  /**
   * Splices the given docs array so as to honour the offset and limit arguments.
   * @param docs An array of documents.
   * @param limit The maximum number of documents to return.
   * @param offset The number of documents to skip.
   */
  private spliceArrayForLimitAndOffset (docs: DocFragment[], limit?: number, offset?: number): void {
    if (limit && limit > 0 && offset && offset > 0) {
      docs.splice(0, offset)
      docs.splice(limit)
    } else if (limit && limit > 0) {
      docs.splice(limit)
    }
  }

  /**
   * Return a new array of docs whereby each document
   * only contains the fields in the given fieldNames array.
   * @param docs An array of docs.
   * @param fieldNames An array of field names.
   */
  private buildQueryResult (docs: Doc[], fieldNames: string[]): DocStoreQueryResult {
    const results = []

    for (let i = 0; i < docs.length; i++) {
      const result: DocFragment = {}

      for (const fieldName of fieldNames) {
        result[fieldName] = docs[i][fieldName]
      }

      results.push(result)
    }

    return { docs: JSON.parse(JSON.stringify(results)) }
  }

  /**
   * Constructs a new instance of the in-memory document store.
   * @param props The constructor properties.
   */
  constructor (props: MemDocStoreConstructorProps) {
    this.docs = props.docs
    this.generateDocVersionFunc = props.generateDocVersionFunc
  }

  /**
   * Executes a command against the document store.
   * @param docTypeName The name of a doc type.
   * @param docTypePluralName The plural name of a doc type.
   * @param command A command to execute.
   * @param options A set of options supplied with the original request
   * and options defined on the document type.
   * @param props Properties that define how to carry out this action.
   */
  async command (docTypeName: string, docTypePluralName: string, command: MemDocStoreCommand, options: MemDocStoreOptions, props: DocStoreCommandProps): Promise<DocStoreCommandResult<MemDocStoreCommandResult>> {
    if (command === 'count') {
      return {
        commandResult: { count: this.docs.filter(d => d.docType === docTypeName).length }
      }
    } else return {
      commandResult: {}
    }
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
  async deleteById (docTypeName: string, docTypePluralName: string, id: string, options: MemDocStoreOptions, props: DocStoreDeleteByIdProps): Promise<DocStoreDeleteByIdResult> {
    const index = this.docs.findIndex(d => d.docType === docTypeName && d.id === id)

    if (index > -1) {
      this.docs.splice(index, 1)
      return { code: DocStoreDeleteByIdResultCode.DELETED }
    } else {
      return { code: DocStoreDeleteByIdResultCode.NOT_FOUND }
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
  async exists (docTypeName: string, docTypePluralName: string, id: string, options: MemDocStoreOptions, props: DocStoreExistsProps): Promise<DocStoreExistsResult> {
    return { found: this.docs.findIndex(d => d.docType === docTypeName && d.id === id) > -1 }
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
  async fetch (docTypeName: string, docTypePluralName: string, id: string, options: MemDocStoreOptions, props: DocStoreFetchProps): Promise<DocStoreFetchResult> {
    const doc = this.docs.find(d => d.docType === docTypeName && d.id === id)
    return { doc: doc ? JSON.parse(JSON.stringify(doc)) : null }
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
  async queryAll (docTypeName: string, docTypePluralName: string, fieldNames: string[], options: MemDocStoreOptions, props: DocStoreQueryProps): Promise<DocStoreQueryResult> {
    const matchedDocs = this.docs.filter(d => d.docType === docTypeName)
    this.spliceArrayForLimitAndOffset(matchedDocs, props.limit, props.offset)  
    return this.buildQueryResult(matchedDocs, fieldNames)
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
  async queryByFilter (docTypeName: string, docTypePluralName: string, fieldNames: string[], filterExpression: MemDocStoreFilter, options: MemDocStoreOptions, props: DocStoreQueryProps): Promise<DocStoreQueryResult> {
    const filterFunc = filterExpression as (d: Doc) => boolean
    const matchedDocs = this.docs.filter(d => d.docType === docTypeName && filterFunc(d))
    this.spliceArrayForLimitAndOffset(matchedDocs, props.limit, props.offset)    
    return this.buildQueryResult(matchedDocs, fieldNames)
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
  async queryByIds (docTypeName: string, docTypePluralName: string, fieldNames: string[], ids: string[], options: MemDocStoreOptions, props: DocStoreQueryProps): Promise<DocStoreQueryResult> {
    const matchedDocs = this.docs.filter(d => d.docType === docTypeName && ids.includes(d.id as string))
    return this.buildQueryResult(matchedDocs, fieldNames)
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
  async upsert (docTypeName: string, docTypePluralName: string, doc: Doc, options: MemDocStoreOptions, props: DocStoreUpsertProps): Promise<DocStoreUpsertResult> {
    const docCopy = JSON.parse(JSON.stringify(doc))
    docCopy.docVersion = this.generateDocVersionFunc()
  
    const index = this.docs.findIndex(d => d.docType === docTypeName && d.id === docCopy.id)
    
    if (props.reqVersion && (index === -1 || this.docs[index].docVersion !== props.reqVersion)) {
      return { code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE }
    } else {
      if (index > -1) {
        this.docs.splice(index, 1, docCopy)
        return { code: DocStoreUpsertResultCode.REPLACED }
      } else {
        this.docs.push(docCopy)
        return { code: DocStoreUpsertResultCode.CREATED }
      }
    }
  }
}
