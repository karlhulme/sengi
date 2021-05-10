/**
 * Defines the properties that are required to retrieve a set of
 * documents from a collection using a set of document ids.
 */
 export interface QueryDocumentsByIdsProps<RequestProps, DocStoreOptions> {
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
   * An array of document ids.
   */
  ids: string[]

  /**
   * The properties passed with the request.
   */
  reqProps: RequestProps

  /**
   * The document store options passed with the request.
   */
  docStoreOptions: DocStoreOptions
}
