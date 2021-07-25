import { DocPatch } from '../doc/DocPatch'

/**
 * Represents the properties passed to an authorisation function.
 */
export interface DocTypeAuthProps<Doc, User> {
  /**
   * The document that is the subject of the authorisation request.
   */
   doc: Doc

  /**
   * The user that made the request.
   */
  user: User

  /**
   * The type of request.
   */
  requestType: 'delete'|'new'|'patch'|'replace'|'selectDocs'|'selectByFilter'|'selectByIds'

  /**
   * True if the request type involves reading data.
   */
  isRead: boolean

  /**
   * True if the request type involves writing data.
   */
  isWrite: boolean

  /**
   * The list of fields to be read or written as a result of the request.
   */
  fieldNames: string[]

  /**
   * The patch to be applied to the document, populated if
   * the request type is 'patch'.
   */
  patch?: DocPatch
}
