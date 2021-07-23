import { DocPatch } from '../doc'

/**
 * Defines the properties that are required to patch a document.
 */
 export interface PatchDocumentProps<RequestProps, DocStoreOptions> {
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
   * The id of the operation.
   */
  operationId: string

  /**
   * The patch to be applied.
   */
  patch: DocPatch

  /**
   * The properties passed with the request.
   */
  reqProps: RequestProps

  /**
   * The document store options passed with the request.
   */
  docStoreOptions: DocStoreOptions

  /**
   * The required version of the document.  If specified, then this
   * property defines the version of the document that must be
   * found in the collection otherwise the operation will not be applied.
   */
  reqVersion?: string
}
