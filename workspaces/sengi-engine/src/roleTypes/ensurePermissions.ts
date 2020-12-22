import { RoleType, SengiInsufficientPermissionsError } from 'sengi-interfaces'
import { canCreate } from './canCreate'
import { canDelete } from './canDelete'
import { canOperate } from './canOperate'
import { canPatch } from './canPatch'
import { canQuery } from './canQuery'
import { canReplace } from './canReplace'
import { hasPermission } from './hasPermission'

/**
 * Raises an error if given role names and role types do not
 * support the create action.
 * @param roleNames An array of held roles.
 * @param roleTypes An array of role types.
 * @param docTypeName The name of a doc type.
 */
export function ensureCreatePermission (roleNames: string[], roleTypes: RoleType[], docTypeName: string): void {
  if (!hasPermission(roleNames, roleTypes, docTypeName, canCreate)) {
    throw new SengiInsufficientPermissionsError(roleNames, docTypeName, 'create')
  }
}

/**
 * Raises an error if given role names and role types do not
 * support the delete action.
 * @param roleNames An array of held roles.
 * @param roleTypes An array of role types.
 * @param docTypeName The name of a doc type.
 */
export function ensureDeletePermission (roleNames: string[], roleTypes: RoleType[], docTypeName: string): void {
  if (!hasPermission(roleNames, roleTypes, docTypeName, canDelete)) {
    throw new SengiInsufficientPermissionsError(roleNames, docTypeName, 'delete')
  }
}

/**
 * Raises an error if given role names and role types do not
 * support the requested update action.
 * @param roleNames An array of held roles.
 * @param roleTypes An array of role types.
 * @param docTypeName The name of a doc type.
 * @param operationName The name of a doc type operation.
 */
export function ensureOperatePermission (roleNames: string[], roleTypes: RoleType[], docTypeName: string, operationName: string): void {
  if (!hasPermission(roleNames, roleTypes, docTypeName, r => canOperate(r, operationName))) {
    throw new SengiInsufficientPermissionsError(roleNames, docTypeName, 'update.' + operationName)
  }
}

/**
 * Raises an error if given role names and role types do not
 * support the patch action.
 * @param roleNames An array of held roles.
 * @param roleTypes An array of role types.
 * @param docTypeName The name of a doc type.
 */
export function ensurePatchPermission (roleNames: string[], roleTypes: RoleType[], docTypeName: string): void {
  if (!hasPermission(roleNames, roleTypes, docTypeName, canPatch)) {
    throw new SengiInsufficientPermissionsError(roleNames, docTypeName, 'patch')
  }
}

/**
 * Raises an error if given role names and role types do not
 * support the requested query action.
 * @param roleNames An array of held roles.
 * @param roleTypes An array of role types.
 * @param docTypeName The name of a doc type.
 * @param fieldNames An array of field names.
 */
export function ensureQueryPermission (roleNames: string[], roleTypes: RoleType[], docTypeName: string, fieldNames: string[]): void {
  if (!hasPermission(roleNames, roleTypes, docTypeName, r => canQuery(r, fieldNames))) {
    throw new SengiInsufficientPermissionsError(roleNames, docTypeName, `query (${fieldNames.join(', ')})`)
  }
}

/**
 * Raises an error if given role names and role types do not
 * support the replace action.
 * @param roleNames An array of held roles.
 * @param roleTypes An array of role types.
 * @param docTypeName The name of a doc type.
 */
export function ensureReplacePermission (roleNames: string[], roleTypes: RoleType[], docTypeName: string): void {
  if (!hasPermission(roleNames, roleTypes, docTypeName, canReplace)) {
    throw new SengiInsufficientPermissionsError(roleNames, docTypeName, 'replace')
  }
}
