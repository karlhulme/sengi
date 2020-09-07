import check from 'check-types'

/**
 * Returns true if one of the held roles allows
 * the action tested by permissionFunc to be actioned.
 * @param {Array} roeNames An array of held roles.
 * @param {Array} roleTypes An array of role types.
 * @param {Func} permissionFunc A function that accepts a role type
 * and returns true if a permission is held.
 */
export const hasPermission = (roleNames, roleTypes, permissionFunc) => {
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.function(permissionFunc)

  for (const roleType of roleTypes) {
    if (roleNames.includes(roleType.name)) {
      if (permissionFunc(roleType)) {
        return true
      }
    }
  }

  return false
}
