import { DocBase } from '../doc'
import { DocType } from '../docType'

/**
 * Defines the properties passed to the saved doc callback.
 */
export interface SavedDocCallbackProps<RequestProps, Doc extends DocBase, DocStoreOptions, User, Filter, Query, QueryResult> {
  /**
   * The name of the client that invoked the operation.
   */
  clientName: string

  /**
   * The resolved set of document store options.
   */
  docStoreOptions: DocStoreOptions

  /**
   * The document type associated with the saved document.
   */
  docType: DocType<Doc, DocStoreOptions, User, Filter, Query, QueryResult>

  /**
   * Any properties passed along with the request.
   */
  reqProps: RequestProps

  /**
   * The document that has been saved.
   */
  doc: Doc

  /**
   * True if the document is new, otherwise this document is being updated.
   */
  isNew: boolean|null

  /**
   * The user that triggered the callback.
   */
  user: User
}

/**
 * Defines the callback that is raised when a document is saved.
 */
 export type SavedDocCallback<RequestProps, Doc extends DocBase, DocStoreOptions, User, Filter, Query, QueryResult> = (props: SavedDocCallbackProps<RequestProps, Doc, DocStoreOptions, User, Filter, Query, QueryResult>) => Promise<void>
