import { DocType } from '../docType'

/**
 * Defines the properties passed to the pre query docs callback.
 */
export interface PreQueryDocsCallbackProps<RequestProps, Doc, DocStoreOptions, Filter, CommandResult, Command> {
  /**
   * The names of the roles that were active.
   */
  roleNames: string[]

  /**
   * The resolved set of document store options.
   */
  docStoreOptions: DocStoreOptions

  /**
   * The document type associated with the deleted document.
   */
  docType: DocType<Doc, DocStoreOptions, Filter, CommandResult, Command>

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
 export type PreQueryDocsCallback<RequestProps, Doc, DocStoreOptions, Filter, CommandResult, Command> = (props: PreQueryDocsCallbackProps<RequestProps, Doc, DocStoreOptions, Filter, CommandResult, Command>) => Promise<void>
