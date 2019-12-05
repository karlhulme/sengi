/* eslint-env jest */
const canDelete = require('./canDelete')

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
      delete: true
    }
  }
}

const noDocType = {
  docPermissions: {}
}

const deniedPermission = {
  docPermissions: {
    places: {
      delete: false
    }
  }
}

test('Determine that a role with relevant doc permissions can be used to delete documents.', () => {
  expect(canDelete(admin, 'places')).toEqual(true)
  expect(canDelete(wholeDocType, 'places')).toEqual(true)
  expect(canDelete(specificPermission, 'places')).toEqual(true)
})

test('Determine that a role without relevant doc permissions cannot be used to delete documents.', () => {
  expect(canDelete(noDocType, 'places')).toEqual(false)
  expect(canDelete(deniedPermission, 'places')).toEqual(false)
})
