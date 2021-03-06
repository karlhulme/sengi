import { RoleTypeDocSelectPermissionSet } from './RoleTypeDocSelectPermissionSet'
import { RoleTypeDocUpdatePermissionSet } from './RoleTypeDocUpdatePermissionSet'

/**
 * Represents a set of permissions for a document type.
 */
export interface RoleTypeDocPermissionSet {
  /**
   * The permissions granted for selecting.
   */
  select?: boolean|RoleTypeDocSelectPermissionSet

  /**
   * The permissions granted for updating.
   */
  update?: boolean|RoleTypeDocUpdatePermissionSet

  /**
   * Specifies if a new document may be created.
   */
  create?: boolean

  /**
   * Specifies if a document may be deleted.
   */
  delete?: boolean

  /**
   * Specifies if a document may be replaced.
   */
  replace?: boolean
}
