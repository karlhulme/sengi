import { expect, test } from '@jest/globals'
import { AuthenticatedClient } from './AuthenticatedClient'
import {
  ensureCreatePermission, ensureDeletePermission, ensureOperatePermission,
  ensurePatchPermission, ensureSelectPermission, ensureReplacePermission, ensureQueryPermission
} from './ensurePermissions'

const adminAuthenticatedClient: AuthenticatedClient = {
  name: 'admin',
  docPermissions: {
    testDocType: {
      create: true,
      delete: true,
      select: {
        fields: ['a', 'b'],
        fieldsTreatment: 'include',
        queries: ['someQuery']
      },
      update: {
        operations: ['someOp'],
        patch: true
      },
      replace: true
    }
  } 
}

const guestAuthenticatedClient: AuthenticatedClient = {
  name: 'guest',
  docPermissions: false
}

test('Can verify create permission.', () => {
  expect(() => ensureCreatePermission(adminAuthenticatedClient, 'testDocType')).not.toThrow()
  expect(() => ensureCreatePermission(guestAuthenticatedClient, 'testDocType')).toThrow()
})

test('Can verify delete permission.', () => {
  expect(() => ensureDeletePermission(adminAuthenticatedClient, 'testDocType')).not.toThrow()
  expect(() => ensureDeletePermission(guestAuthenticatedClient, 'testDocType')).toThrow()
})

test('Can verify operate permission.', () => {
  expect(() => ensureOperatePermission(adminAuthenticatedClient, 'testDocType', 'someOp')).not.toThrow()
  expect(() => ensureOperatePermission(guestAuthenticatedClient, 'testDocType', 'someOp')).toThrow()
})

test('Can verify patch permission.', () => {
  expect(() => ensurePatchPermission(adminAuthenticatedClient, 'testDocType')).not.toThrow()
  expect(() => ensurePatchPermission(guestAuthenticatedClient, 'testDocType')).toThrow()
})

test('Can verify query permission.', () => {
  expect(() => ensureQueryPermission(adminAuthenticatedClient, 'testDocType', 'someQuery')).not.toThrow()
  expect(() => ensureQueryPermission(guestAuthenticatedClient, 'testDocType', 'someQuery')).toThrow()
})

test('Can verify replace permission.', () => {
  expect(() => ensureReplacePermission(adminAuthenticatedClient, 'testDocType')).not.toThrow()
  expect(() => ensureReplacePermission(guestAuthenticatedClient, 'testDocType')).toThrow()
})

test('Can verify select permission.', () => {
  expect(() => ensureSelectPermission(adminAuthenticatedClient, 'testDocType', ['a', 'b'])).not.toThrow()
  expect(() => ensureSelectPermission(guestAuthenticatedClient, 'testDocType', ['a', 'b'])).toThrow()
})
