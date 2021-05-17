import { RoleTypeDocPermissionSet, RoleTypeDocSelectPermissionSet } from 'sengi-interfaces'

/**
 * Returns true if the requested field names can be honoured.
 * @param requestedFieldNames An array of requested field names.
 * @param whitelistedFieldNames An array of whitelisted field names from the role type.
 */
function determineIfReqFieldsConformsToWhitelist (requestedFieldNames: string[], whitelistedFieldNames: string[]): boolean {
  for (const reqFn of requestedFieldNames) {
    if (!whitelistedFieldNames.includes(reqFn)) {
      return false
    }
  }

  return true
}

/**
 * Returns true if the requested field names do not clash with the blacklisted field names.
 * @param requestedFieldNames An array of requested field names.
 * @param blacklistedFieldNames An array of blacklisted field names from the role type.
 */
function determineIfReqFieldsConformsToBlacklist (requestedFieldNames: string[], blacklistedFieldNames: string[]): boolean {
  for (const reqFn of requestedFieldNames) {
    if (blacklistedFieldNames.includes(reqFn)) {
      return false
    }
  }

  return true
}

/**
 * Returns true if query permission exists on the permission set
 * for the requested field names.
 * @param permissionSet A permission set.
 * @param fieldNames An array of field names.
 */
export function canSelect (permissionSet: RoleTypeDocPermissionSet, fieldNames: string[]): boolean {
  if (typeof permissionSet.select === 'boolean') {
    return permissionSet.select
  } else if (typeof permissionSet.select === 'object') {
    const selectPermissionSet = permissionSet.select as RoleTypeDocSelectPermissionSet
    
    if (selectPermissionSet.fieldsTreatment === 'exclude') {
      return determineIfReqFieldsConformsToBlacklist(fieldNames, selectPermissionSet.fields)
    } else {
      return determineIfReqFieldsConformsToWhitelist(fieldNames, selectPermissionSet.fields)
    }
  } else {
    return false
  }
}
