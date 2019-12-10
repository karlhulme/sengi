const check = require('check-types')
const { JsonotronUnrecognisedRoleTypeNameError } = require('../errors')

/**
 * Returns the role with the given role name or raises
 * an error if it's not found.
 * @param {String} roleName The name of a role.
 * @param {Array} roleTypes An array of role names.
 */
const selectRoleTypeFromArray = (roleName, roleTypes) => {
  check.assert.string(roleName)
  check.assert.array.of.object(roleTypes)

  const roleType = roleTypes.find(r => r.name === roleName)

  if (!roleType) {
    throw new JsonotronUnrecognisedRoleTypeNameError(roleName)
  }

  return roleType
}

module.exports = selectRoleTypeFromArray
