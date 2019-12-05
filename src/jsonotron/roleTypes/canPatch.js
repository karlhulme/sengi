const check = require('check-types')

/**
 * Returns true if the given role type allows
 * documents of the given doc type name to be patched.
 * @param {Object} roleType A role type.
 * @param {String} docTypeName The name of a doc type.
 */
const canPatch = (roleType, docTypeName) => {
  check.assert.object(roleType)
  check.assert.string(docTypeName)

  const hasPermission = (roleType.docPermissions === true) ||
    (roleType.docPermissions[docTypeName] === true) ||
    (typeof roleType.docPermissions[docTypeName] === 'object' && roleType.docPermissions[docTypeName].update === true) ||
    (typeof roleType.docPermissions[docTypeName] === 'object' && typeof roleType.docPermissions[docTypeName].update === 'object' && roleType.docPermissions[docTypeName].update.patch === true)

  return hasPermission
}

module.exports = canPatch
