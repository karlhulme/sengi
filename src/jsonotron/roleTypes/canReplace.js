const check = require('check-types')

/**
 * Returns true if the given role type allows
 * documents of the given doc type name to be replaced.
 * @param {Object} roleType A role type.
 * @param {String} docTypeName The name of a doc type.
 */
const canReplace = (roleType, docTypeName) => {
  check.assert.object(roleType)
  check.assert.string(docTypeName)

  const hasPermission = (roleType.docPermissions === true) ||
    (roleType.docPermissions[docTypeName] === true) ||
    (typeof roleType.docPermissions[docTypeName] === 'object' && roleType.docPermissions[docTypeName].replace === true)

  return hasPermission
}

module.exports = canReplace
