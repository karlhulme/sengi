import { RoleType, RoleTypeDocPermissionSet } from 'sengi-interfaces'

/**
 * Returns true if one of the held roles allows
 * the action tested by permissionFunc to be actioned.
 * @param roleNames An array of held roles.
 * @param roleTypes An array of role types.
 * @param docTypeName The name of a document type.
 * @param permissionFunc A function that accepts a role type
 * and returns true if a permission is held.
 */
export function hasPermission (roleNames: string[], roleTypes: RoleType[], docTypeName: string, permissionFunc: (r: RoleTypeDocPermissionSet) => boolean): boolean {
  for (const roleType of roleTypes) {
    if (roleNames.includes(roleType.name)) {
      // check for a global permission
      if (typeof roleType.docPermissions === 'boolean') {
        if (roleType.docPermissions === true) {
          return true
        }
      }
      
      // check for a docType-wide permission
      if (typeof roleType.docPermissions === 'object' && typeof roleType.docPermissions[docTypeName] === 'boolean') {
        if (roleType.docPermissions[docTypeName] === true) {
          return true
        }
      }

      // check for a docType specific permission
      if (typeof roleType.docPermissions === 'object' && typeof roleType.docPermissions[docTypeName] === 'object') {
        if (permissionFunc(roleType.docPermissions[docTypeName] as RoleTypeDocPermissionSet)) {
          return true
        }
      }
    }
  }

  return false
}
