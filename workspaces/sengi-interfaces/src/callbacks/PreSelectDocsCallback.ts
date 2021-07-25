import { DocBase } from '../doc'
import { DocType } from '../docType'

/**
 * Defines the properties passed to the pre select docs callback.
 */
export interface PreSelectDocsCallbackProps<RequestProps, Doc extends DocBase, DocStoreOptions, User, Filter, Query, QueryResult> {
  /**
   * The name of the client that invoked the operation.
   */
  clientName: string

  /**
   * The resolved set of document store options.
   */
  docStoreOptions: DocStoreOptions

  /**
   * The document type associated with the documents being queried.
   */
  docType: DocType<Doc, DocStoreOptions, User, Filter, Query, QueryResult>

  /**
   * Any properties passed along with the request.
   */
  reqProps: RequestProps

  /**
   * The list of fields that have been requested by the client.
   */
  fieldNames: string[]

  /**
   * The user that triggered the callback.
   */
  user: User
}

/**
 * Defines the callback that is raised just before a document collection is queried.
 */
 export type PreSelectDocsCallback<RequestProps, Doc extends DocBase, DocStoreOptions, User, Filter, Query, QueryResult> = (props: PreSelectDocsCallbackProps<RequestProps, Doc, DocStoreOptions, User, Filter, Query, QueryResult>) => Promise<void>
