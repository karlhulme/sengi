import { RoleTypeDocPermissionSet } from 'sengi-interfaces'

/**
 * Returns true if replace permission exists on the permission set.
 * @param permissionSet A permission set.
 */
export function canReplace (permissionSet: RoleTypeDocPermissionSet): boolean {
  return permissionSet.replace === true
}
