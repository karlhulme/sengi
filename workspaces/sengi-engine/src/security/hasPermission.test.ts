import { expect, test } from '@jest/globals'
import { hasPermission } from './hasPermission'
import { canCreate } from './canCreate'

test('Permission is confirmed if client has system wide permission.', () => {
  expect(hasPermission({
    name: 'test',
    docPermissions: true
  }, 'testDocType', canCreate)).toEqual(true)
})

test('Permission is confirmed if client has doc wide permission.', () => {
  expect(hasPermission({
    name: 'test',
    docPermissions: {
      testDocType: true
    }
  }, 'testDocType', canCreate)).toEqual(true)
})

test('Permission is found if client has operation specific permission.', () => {
  expect(hasPermission({
    name: 'test',
    docPermissions: {
      testDocType: {
        create: true
      }
    }
  }, 'testDocType', canCreate)).toEqual(true)
})

test('Permission is not found if client does not have any permissions.', () => {
  expect(hasPermission({
    name: 'test',
    docPermissions: false
  }, 'testDocType', canCreate)).toEqual(false)
})

test('Permission is not found if client does not have any permissions on the doc type.', () => {
  expect(hasPermission({
    name: 'test',
    docPermissions: {
      testDocType: false
    }
  }, 'testDocType', canCreate)).toEqual(false)
})

test('Permission is not found if client does not have any operation specific permission.', () => {
  expect(hasPermission({
    name: 'test',
    docPermissions: {
      testDocType: {
        create: false
      }
    }
  }, 'testDocType', canCreate)).toEqual(false)
})
