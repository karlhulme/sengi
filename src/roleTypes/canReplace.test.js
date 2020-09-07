/* eslint-env jest */
import { canReplace } from './canReplace'

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
      replace: true
    }
  }
}

const noDocType = {
  docPermissions: {}
}

const deniedPermission = {
  docPermissions: {
    places: {
      replace: false
    }
  }
}

test('Determine that a role with relevant doc permissions can be used to replace documents.', () => {
  expect(canReplace(admin, 'places')).toEqual(true)
  expect(canReplace(wholeDocType, 'places')).toEqual(true)
  expect(canReplace(specificPermission, 'places')).toEqual(true)
})

test('Determine that a role without relevant doc permissions cannot be used to replace documents.', () => {
  expect(canReplace(noDocType, 'places')).toEqual(false)
  expect(canReplace(deniedPermission, 'places')).toEqual(false)
})
