import { DocType } from '../docType'

/**
 * Defines the properties passed to the delete callback.
 */
export interface DeletedDocCallbackProps<RequestProps, Doc, DocStoreOptions, Filter, CommandResult, Command> {
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
   * The id of the document was that deleted.
   */
  id: string
}

/**
 * Defines the callback that is raised when a document is deleted.
 */
export type DeletedDocCallback<RequestProps, Doc, DocStoreOptions, Filter, CommandResult, Command> = (props: DeletedDocCallbackProps<RequestProps, Doc, DocStoreOptions, Filter, CommandResult, Command>) => Promise<void>
