import { expect, test } from '@jest/globals'
import { RoleType } from 'sengi-interfaces'
import { ensureCreatePermission, ensureDeletePermission, ensureOperatePermission,
  ensurePatchPermission, ensureQueryPermission, ensureReplacePermission } from './ensurePermissions'

const roleTypes: RoleType[] = [{
  name: 'admin',
  docPermissions: {
    testDocType: {
      create: true,
      delete: true,
      query: {
        fields: ['a', 'b'],
        fieldsTreatment: 'include'
      },
      update: {
        operations: ['someOp'],
        patch: true
      },
      replace: true
    }
  }
}, {
  name: 'none',
  docPermissions: false
}]

test('Can verify create permission.', () => {
  expect(() => ensureCreatePermission(['admin'], roleTypes,'testDocType')).not.toThrow()
  expect(() => ensureCreatePermission(['none'], roleTypes, 'testDocType')).toThrow()
})

test('Can verify delete permission.', () => {
  expect(() => ensureDeletePermission(['admin'], roleTypes,'testDocType')).not.toThrow()
  expect(() => ensureDeletePermission(['none'], roleTypes, 'testDocType')).toThrow()
})

test('Can verify operate permission.', () => {
  expect(() => ensureOperatePermission(['admin'], roleTypes,'testDocType', 'someOp')).not.toThrow()
  expect(() => ensureOperatePermission(['none'], roleTypes, 'testDocType', 'someOp')).toThrow()
})

test('Can verify patch permission.', () => {
  expect(() => ensurePatchPermission(['admin'], roleTypes,'testDocType')).not.toThrow()
  expect(() => ensurePatchPermission(['none'], roleTypes, 'testDocType')).toThrow()
})

test('Can verify query permission.', () => {
  expect(() => ensureQueryPermission(['admin'], roleTypes,'testDocType', ['a', 'b'])).not.toThrow()
  expect(() => ensureQueryPermission(['none'], roleTypes, 'testDocType', ['a', 'b'])).toThrow()
})

test('Can verify replace permission.', () => {
  expect(() => ensureReplacePermission(['admin'], roleTypes,'testDocType')).not.toThrow()
  expect(() => ensureReplacePermission(['none'], roleTypes, 'testDocType')).toThrow()
})
