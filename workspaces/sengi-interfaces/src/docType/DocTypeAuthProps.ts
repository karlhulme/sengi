import { DocPatch } from '../doc/DocPatch'

/**
 * Represents the properties passed to an authorisation function.
 */
export interface DocTypeAuthProps<Doc, User> {
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
   * A list of the fields that are read, set or updated as a consequence
   * of executing the request.
   */
  fieldNames: string[]

  /**
   * Populated if there is a document that exists prior to the
   * completion of the request.
   */
  doc?: Doc

  /**
   * Populated for patch requests.
   */
  patch?: DocPatch
}
