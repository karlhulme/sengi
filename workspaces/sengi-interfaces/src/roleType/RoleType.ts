import { RoleTypeDocPermissionSet } from './RoleTypeDocPermissionSet'

/**
 * Represents a role that describes a set of document permissions.
 */
export interface RoleType {
  /**
   * The name of the role.
   */
  name: string

  /**
   * The title of the role.
   */
  title: string

  /**
   * A description of the intended usage of the role.
   */
  summary: string

  /**
   * The permission sets awarded by this role.
   */
  docPermissions: boolean|Record<string, boolean|RoleTypeDocPermissionSet>
}
