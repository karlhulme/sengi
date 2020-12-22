import { RoleTypeDocPermissionSet } from 'sengi-interfaces'

/**
 * Returns true if delete permission exists on the permission set.
 * @param permissionSet A permission set.
 */
export function canDelete (permissionSet: RoleTypeDocPermissionSet): boolean {
  return permissionSet.delete === true
}
