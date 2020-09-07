/* eslint-env jest */
import { canPatch } from './canPatch'

const admin = {
  docPermissions: true
}

const wholeDocType = {
  docPermissions: {
    places: true
  }
}

const allUpdatesPermission = {
  docPermissions: {
    places: {
      update: true
    }
  }
}

const specificPermission = {
  docPermissions: {
    places: {
      update: {
        patch: true
      }
    }
  }
}

const noDocType = {
  docPermissions: {}
}

const deniedAllUpdatesPermission = {
  docPermissions: {
    places: {
      update: false
    }
  }
}

const deniedSpecificPermission = {
  docPermissions: {
    places: {
      update: {
        patch: false
      }
    }
  }
}

test('Determine that a role with relevant doc permissions can be used to patch documents.', () => {
  expect(canPatch(admin, 'places')).toEqual(true)
  expect(canPatch(wholeDocType, 'places')).toEqual(true)
  expect(canPatch(allUpdatesPermission, 'places')).toEqual(true)
  expect(canPatch(specificPermission, 'places')).toEqual(true)
})

test('Determine that a role without relevant doc permissions cannot be used to patch documents.', () => {
  expect(canPatch(noDocType, 'places')).toEqual(false)
  expect(canPatch(deniedAllUpdatesPermission, 'places')).toEqual(false)
  expect(canPatch(deniedSpecificPermission, 'places')).toEqual(false)
})
