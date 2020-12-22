import { RoleTypeDocPermissionSet, RoleTypeDocUpdatePermissionSet } from 'sengi-interfaces'

/**
 * Returns true if operate permission exists on the permission set
 * for the requested operation.
 * @param permissionSet A permission set.
 * @param operationName The name of an operation.
 */
export function canOperate (permissionSet: RoleTypeDocPermissionSet, operationName: string): boolean {
  if (typeof permissionSet.update === 'boolean') {
    return permissionSet.update
  } else if (typeof permissionSet.update === 'object') {
    const updatePermissionSet = permissionSet.update as RoleTypeDocUpdatePermissionSet
    return updatePermissionSet.operations.includes(operationName)
  } else {
    return false
  }
}
