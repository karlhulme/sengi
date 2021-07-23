import { DocBase } from '../doc'
import { DocType } from '../docType'

/**
 * Defines the properties passed to the pre save doc callback.
 */
export interface PreSaveDocCallbackProps<RequestProps, Doc extends DocBase, DocStoreOptions, Filter, Query, QueryResult> {
  /**
   * The name of the client that invoked the operation.
   */
  clientName: string

  /**
   * The resolved set of document store options.
   */
  docStoreOptions: DocStoreOptions

  /**
   * The document type associated with the document to be saved.
   */
  docType: DocType<Doc, DocStoreOptions, Filter, Query, QueryResult>

  /**
   * Any properties passed along with the request.
   */
  reqProps: RequestProps

  /**
   * The document that is about to be saved.
   */
  doc: Doc

  /**
   * True if the document is new, otherwise this document is being updated.
   */
  isNew: boolean|null
}

/**
 * Defines the callback that is raised just before a document is saved.
 */
 export type PreSaveDocCallback<RequestProps, Doc extends DocBase, DocStoreOptions, Filter, Query, QueryResult> = (props: PreSaveDocCallbackProps<RequestProps, Doc, DocStoreOptions, Filter, Query, QueryResult>) => Promise<void>
