import check from 'check-types'

/**
 * Returns true if the given role allows the given operation
 * to be carried out on documents of the given doc type.
 * @param {Object} roleType A role type.
 * @param {String} docTypeName The name of a doc type.
 * @param {String} operationName The name of an operation.
 */
export const canOperate = (roleType, docTypeName, operationName) => {
  check.assert.object(roleType)
  check.assert.string(docTypeName)
  check.assert.string(operationName)

  const hasPermission = (roleType.docPermissions === true) ||
    (roleType.docPermissions[docTypeName] === true) ||
    (typeof roleType.docPermissions[docTypeName] === 'object' && roleType.docPermissions[docTypeName].update === true) ||
    (typeof roleType.docPermissions[docTypeName] === 'object' && typeof roleType.docPermissions[docTypeName].update === 'object' && roleType.docPermissions[docTypeName].update.operations.includes(operationName))

  return hasPermission
}
