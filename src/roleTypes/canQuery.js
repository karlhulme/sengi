import check from 'check-types'
import { JsonotronInternalError } from '../jsonotron-errors'

/**
 * Returns true if the requested field names can be honoured.
 * @param {Array} requestedFieldNames An array of requested field names.
 * @param {Array} whitelistedFieldNames An array of whitelisted field names from the role type.
 */
const determineIfReqFieldsConformsToWhitelist = (requestedFieldNames, whitelistedFieldNames) => {
  for (const reqFn of requestedFieldNames) {
    if (!whitelistedFieldNames.includes(reqFn)) {
      return false
    }
  }

  return true
}

/**
 * Returns true if the requested field names do not clash with the blacklisted field names.
 * @param {Array} requestedFieldNames An array of requested field names.
 * @param {Array} blacklistedFieldNames An array of blacklisted field names from the role type.
 */
const determineIfReqFieldsConformsToBlacklist = (requestedFieldNames, blacklistedFieldNames) => {
  for (const reqFn of requestedFieldNames) {
    if (blacklistedFieldNames.includes(reqFn)) {
      return false
    }
  }

  return true
}

/**
 * Returns true if the given role allows
 * documents of the given doc type to be queried with the given field names.
 * @param {Object} roleType A role type.
 * @param {String} docTypeName The name of a doc type.
 * @param {Array} fieldNames An array of requested field names.
 */
export const canQuery = (roleType, docTypeName, fieldNames) => {
  check.assert.object(roleType)
  check.assert.string(docTypeName)
  check.assert.array.of.string(fieldNames)

  let hasPermission = (roleType.docPermissions === true) ||
    (roleType.docPermissions[docTypeName] === true) ||
    (typeof roleType.docPermissions[docTypeName] === 'object' && roleType.docPermissions[docTypeName].query === true)

  const hasQueryObject = typeof roleType.docPermissions[docTypeName] === 'object' &&
    typeof roleType.docPermissions[docTypeName].query === 'object'

  if (!hasPermission && hasQueryObject) {
    const fieldsTreatment = roleType.docPermissions[docTypeName].query.fieldsTreatment

    if (fieldsTreatment === 'whitelist') {
      hasPermission = determineIfReqFieldsConformsToWhitelist(fieldNames, roleType.docPermissions[docTypeName].query.fields)
    } else if (fieldsTreatment === 'blacklist') {
      hasPermission = determineIfReqFieldsConformsToBlacklist(fieldNames, roleType.docPermissions[docTypeName].query.fields)
    } else {
      throw new JsonotronInternalError(`Unrecognised fields treatment value: '${fieldsTreatment}'.`)
    }
  }

  return hasPermission
}
