import { RoleTypeDocPermissionSet, RoleTypeDocQueryPermissionSet } from 'sengi-interfaces'

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
export function canQuery (permissionSet: RoleTypeDocPermissionSet, fieldNames: string[]): boolean {
  if (typeof permissionSet.query === 'boolean') {
    return permissionSet.query
  } else if (typeof permissionSet.query === 'object') {
    const queryPermissionSet = permissionSet.query as RoleTypeDocQueryPermissionSet
    
    if (queryPermissionSet.fieldsTreatment === 'exclude') {
      return determineIfReqFieldsConformsToBlacklist(fieldNames, queryPermissionSet.fields)
    } else {
      return determineIfReqFieldsConformsToWhitelist(fieldNames, queryPermissionSet.fields)
    }
  } else {
    return false
  }
}
