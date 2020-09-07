import check from 'check-types'

/**
 * Returns true if the given role type allows
 * documents of the given doc type name to be deleted.
 * @param {Object} roleType A role type.
 * @param {String} docTypeName The name of a doc type.
 */
export const canDelete = (roleType, docTypeName) => {
  check.assert.object(roleType)
  check.assert.string(docTypeName)

  const hasPermission = (roleType.docPermissions === true) ||
    (roleType.docPermissions[docTypeName] === true) ||
    (typeof roleType.docPermissions[docTypeName] === 'object' && roleType.docPermissions[docTypeName].delete === true)

  return hasPermission
}
