import { DocFragment } from '../doc'

/**
 * Defines the properties that are required to query a
 * document collection using a filter.
 */
 export interface QueryDocumentsByFilterProps<RequestProps, DocStoreOptions> {
  /**
   * The names of the roles that are associaed with the request.
   */
  roleNames: string[]

  /**
   * The name of the document type that is targeted by the request.
   */
  docTypeName: string

  /**
   * An array of fields to be returned with the query.
   */
  fieldNames: string[]

  /**
   * The name of the filter to apply.
   */
  filterName: string

  /**
   * The parameters to be passed to the filter.
   */
  filterParams: DocFragment

  /**
   * The properties passed with the request.
   */
  reqProps: RequestProps

  /**
   * The document store options passed with the request.
   */
  docStoreOptions: DocStoreOptions

  /**
   * The maximum number of documents to return.
   */
  limit?: number

  /**
   * The number of documents in the result set to skip
   * before returning documents to the client.
   */
  offset?: number
}
