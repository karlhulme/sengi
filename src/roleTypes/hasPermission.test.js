/* eslint-env jest */
import { hasPermission } from './hasPermission'

const roleTypes = [{
  name: 'admin',
  docPermissions: true
}, {
  name: 'none',
  docPermissions: false
}]

const permissionFunc = r => r.docPermissions

test('Permission is found any if role grants permission.', () => {
  expect(hasPermission(['admin'], roleTypes, permissionFunc)).toEqual(true)
  expect(hasPermission(['admin', 'none'], roleTypes, permissionFunc)).toEqual(true)
  expect(hasPermission(['none', 'admin', 'invalid'], roleTypes, permissionFunc)).toEqual(true)
})

test('Permission is not found if role does not grant permission.', () => {
  expect(hasPermission(['none'], roleTypes, permissionFunc)).toEqual(false)
  expect(hasPermission(['invalid', 'none'], roleTypes, permissionFunc)).toEqual(false)
})
