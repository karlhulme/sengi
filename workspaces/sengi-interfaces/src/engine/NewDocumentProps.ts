import { DocRecord } from '../doc'

/**
 * Defines the properties that are required to create
 * a new document from a fragment.
 */
export interface NewDocumentProps<RequestProps, DocStoreOptions> {
  /**
   * The names of the roles that are associaed with the request.
   */
  roleNames: string[]

  /**
   * The name of the document type that is targeted by the request.
   */
  docTypeName: string

  /**
   * The new document.
   */
  doc: DocRecord

  /**
   * The properties passed with the request.
   */
  reqProps: RequestProps

  /**
   * The document store options passed with the request.
   */
  docStoreOptions: DocStoreOptions
}
