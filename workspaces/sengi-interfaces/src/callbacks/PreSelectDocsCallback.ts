import { DocBase } from '../doc'
import { DocType } from '../docType'

/**
 * Defines the properties passed to the pre select docs callback.
 */
export interface PreSelectDocsCallbackProps<RequestProps, Doc extends DocBase, DocStoreOptions, Filter, Query, QueryResult> {
  /**
   * The names of the roles that were active.
   */
  roleNames: string[]

  /**
   * The resolved set of document store options.
   */
  docStoreOptions: DocStoreOptions

  /**
   * The document type associated with the documents being queried.
   */
  docType: DocType<Doc, DocStoreOptions, Filter, Query, QueryResult>

  /**
   * Any properties passed along with the request.
   */
  reqProps: RequestProps

  /**
   * The list of fields that have been requested by the client.
   */
  fieldNames: string[]
}

/**
 * Defines the callback that is raised just before a document collection is queried.
 */
 export type PreSelectDocsCallback<RequestProps, Doc extends DocBase, DocStoreOptions, Filter, Query, QueryResult> = (props: PreSelectDocsCallbackProps<RequestProps, Doc, DocStoreOptions, Filter, Query, QueryResult>) => Promise<void>
