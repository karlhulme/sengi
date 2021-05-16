import { expect, test } from '@jest/globals'
import { RoleType } from 'sengi-interfaces'
import { hasPermission } from './hasPermission'
import { canCreate } from './canCreate'

const roleTypes: RoleType[] = [{
  name: 'admin',
  docPermissions: true
}, {
  name: 'none',
  docPermissions: false
}, {
  name: 'docWide',
  docPermissions: {
    testDocType: true
  }
}, {
  name: 'docWideReject',
  docPermissions: {
    testDocType: false
  }
}, {
  name: 'specific',
  docPermissions: {
    testDocType: {
      create: true
    }
  }
}, {
  name: 'specificReject',
  docPermissions: {
    testDocType: {
      create: false
    }
  }
}]

test('Permission is found any if role grants permission.', () => {
  expect(hasPermission(['admin'], roleTypes, 'testDocType', canCreate)).toEqual(true)
  expect(hasPermission(['admin', 'none'], roleTypes, 'testDocType', canCreate)).toEqual(true)
  expect(hasPermission(['none', 'admin', 'invalid'], roleTypes, 'testDocType', canCreate)).toEqual(true)
  expect(hasPermission(['docWide'], roleTypes, 'testDocType', canCreate)).toEqual(true)
  expect(hasPermission(['specific'], roleTypes, 'testDocType', canCreate)).toEqual(true)
})

test('Permission is not found if role does not grant permission.', () => {
  expect(hasPermission(['none'], roleTypes, 'testDocType', canCreate)).toEqual(false)
  expect(hasPermission(['invalid', 'none'], roleTypes, 'testDocType', canCreate)).toEqual(false)
  expect(hasPermission(['docWideReject'], roleTypes, 'testDocType', canCreate)).toEqual(false)
  expect(hasPermission(['specificReject'], roleTypes, 'testDocType', canCreate)).toEqual(false)
})
