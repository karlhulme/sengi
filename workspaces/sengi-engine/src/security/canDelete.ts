import { ClientDocPermissionSet } from 'sengi-interfaces'

/**
 * Returns true if delete permission exists on the permission set.
 * @param permissionSet A permission set.
 */
export function canDelete (permissionSet: ClientDocPermissionSet): boolean {
  return permissionSet.delete === true
}
