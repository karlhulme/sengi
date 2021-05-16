/**
 * Defines the properties that are required to create a document using a constructor.
 */
export interface ConstructDocumentProps<RequestProps, DocStoreOptions> {
  /**
   * The names of the roles that are associaed with the request.
   */
  roleNames: string[]

  /**
   * The name of the document type that is targeted by the request.
   */
  docTypeName: string

  /**
   * The id of a document.
   */
  id: string

  /**
   * The name of the constructor to use.
   */
  constructorName: string

  /**
   * A set of constructor parameters.
   */
  constructorParams: unknown

  /**
   * The properties passed with the request.
   */
  reqProps: RequestProps

  /**
   * The document store options passed with the request.
   */
  docStoreOptions: DocStoreOptions
}
