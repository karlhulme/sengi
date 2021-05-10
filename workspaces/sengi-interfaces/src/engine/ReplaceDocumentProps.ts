import { Doc } from '../doc'

/**
 * Defines the properties that are required to replace a document.
 */
 export interface ReplaceDocumentProps<RequestProps, DocStoreOptions> {
  /**
   * The names of the roles that are associaed with the request.
   */
  roleNames: string[]

  /**
   * The name of the document type that is targeted by the request.
   */
  docTypeName: string

  /**
   * A new document to be used in place of any existing document.
   */
  doc: Doc

  /**
   * The properties passed with the request.
   */
  reqProps: RequestProps

  /**
   * The document store options passed with the request.
   */
  docStoreOptions: DocStoreOptions
}
