/* eslint-env jest */
const ensurePermission = require('./ensurePermission')
const { JsonotronInsufficientPermissionsError } = require('jsonotron-errors')

const roleTypes = [{
  name: 'admin',
  docPermissions: true
}, {
  name: 'none',
  docPermissions: false
}]

const permissionFunc = (r, docTypeName) => r.docPermissions

test('Permission is found any if role grants permission.', () => {
  expect(() => ensurePermission(['admin'], roleTypes, 'testDocType', 'create', permissionFunc)).not.toThrow()
  expect(() => ensurePermission(['admin', 'none'], roleTypes, 'testDocType', 'create', permissionFunc)).not.toThrow()
  expect(() => ensurePermission(['none', 'admin', 'invalid'], roleTypes, 'testDocType', 'create', permissionFunc)).not.toThrow()
})

test('Error is raised if permission is not found.', () => {
  expect(() => ensurePermission(['none'], roleTypes, 'testDocType', 'create', permissionFunc)).toThrow(JsonotronInsufficientPermissionsError)
  expect(() => ensurePermission(['invalid', 'none'], roleTypes, 'testDocType', 'create', permissionFunc)).toThrow(JsonotronInsufficientPermissionsError)
})
