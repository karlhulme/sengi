/* eslint-env jest */
import { canCreate } from './canCreate'

const admin = {
  docPermissions: true
}

const wholeDocType = {
  docPermissions: {
    places: true
  }
}

const specificPermission = {
  docPermissions: {
    places: {
      create: true
    }
  }
}

const noDocType = {
  docPermissions: {}
}

const deniedPermission = {
  docPermissions: {
    places: {
      create: false
    }
  }
}

test('Determine that a role with relevant doc permissions can be used to create documents.', () => {
  expect(canCreate(admin, 'places')).toEqual(true)
  expect(canCreate(wholeDocType, 'places')).toEqual(true)
  expect(canCreate(specificPermission, 'places')).toEqual(true)
})

test('Determine that a role without relevant doc permissions cannot be used to create documents.', () => {
  expect(canCreate(noDocType, 'places')).toEqual(false)
  expect(canCreate(deniedPermission, 'places')).toEqual(false)
})
