import check from 'check-types'

/**
 * Returns true if the given role type allows
 * documents of the given doc type name to be created.
 * @param {Object} roleType A role type.
 * @param {String} docTypeName The name of a doc type.
 */
export const canCreate = (roleType, docTypeName) => {
  check.assert.object(roleType)
  check.assert.string(docTypeName)

  const hasPermission = (roleType.docPermissions === true) ||
    (roleType.docPermissions[docTypeName] === true) ||
    (typeof roleType.docPermissions[docTypeName] === 'object' && roleType.docPermissions[docTypeName].create === true)

  return hasPermission
}
