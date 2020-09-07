import check from 'check-types'
import { JsonotronInsufficientPermissionsError } from '../jsonotron-errors'
import { hasPermission } from './hasPermission'

/**
 * Raises an error if the given permissionFunc fails to find
 * a matching permission on any of the given role names.
 * @param {Array} roeNames An array of held roles.
 * @param {Array} roleTypes An array of role types.
 * @param {String} docTypeName The name of a doc type.
 * This value is used in the error message on failure.
 * @param {String} action The action that is being tested.
 * This value is used in the error message on failure.
 * @param {Func} permissionFunc A function that accepts a role type
 * and returns true if a permission is held.
 */
export const ensurePermission = (roleNames, roleTypes, docTypeName, action, permissionFunc) => {
  check.assert.array.of.string(roleNames)
  check.assert.array.of.object(roleTypes)
  check.assert.function(permissionFunc)
  check.assert.string(docTypeName)
  check.assert.string(action)

  if (!hasPermission(roleNames, roleTypes, permissionFunc)) {
    throw new JsonotronInsufficientPermissionsError(roleNames, docTypeName, action)
  }
}
