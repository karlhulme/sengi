/**
 * Defines the properties that are required to delete a document.
 */
 export interface DeleteDocumentProps<RequestProps, DocStoreOptions> {
  /**
   * The api key associated with the request.
   */
   apiKey: string

  /**
   * The name of the document type that is targeted by the request.
   */
  docTypeName: string

  /**
   * The id of a document.
   */
  id: string

  /**
   * The properties passed with the request.
   */
  reqProps: RequestProps

  /**
   * The document store options passed with the request.
   */
  docStoreOptions: DocStoreOptions
}
