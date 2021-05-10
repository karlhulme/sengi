import { DocType } from '../docType'

/**
 * Defines the properties passed to the saved doc callback.
 */
export interface SavedDocCallbackProps<RequestProps, Doc, DocStoreOptions, Filter, CommandResult, Command> {
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
   * The document that has been saved.
   */
  doc: Doc

  /**
   * True if the document is new, otherwise this document is being updated.
   */
  isNew: boolean|null
}

/**
 * Defines the callback that is raised when a document is saved.
 */
 export type SavedDocCallback<RequestProps, Doc, DocStoreOptions, Filter, CommandResult, Command> = (props: SavedDocCallbackProps<RequestProps, Doc, DocStoreOptions, Filter, CommandResult, Command>) => Promise<void>
