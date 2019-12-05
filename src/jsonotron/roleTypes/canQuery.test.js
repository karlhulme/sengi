/* eslint-env jest */
const canQuery = require('./canQuery')

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
      query: true
    }
  }
}

const specificPermissionWhitelist = {
  docPermissions: {
    places: {
      query: {
        fieldsTreatment: 'whitelist',
        fields: ['fieldA', 'fieldB', 'fieldC']
      }
    }
  }
}

const specificPermissionBlacklist = {
  docPermissions: {
    places: {
      query: {
        fieldsTreatment: 'blacklist',
        fields: ['fieldD', 'fieldE']
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
      query: false
    }
  }
}

const deniedSpecificPermissionWhitelist = {
  docPermissions: {
    places: {
      query: {
        fieldsTreatment: 'whitelist',
        fields: ['fieldA', 'fieldB']
      }
    }
  }
}

const deniedSpecificPermissionBlacklist = {
  docPermissions: {
    places: {
      query: {
        fieldsTreatment: 'blacklist',
        fields: ['fieldC', 'fieldD', 'fieldE']
      }
    }
  }
}

const invalidFieldsTreatment = {
  docPermissions: {
    places: {
      query: {
        fieldsTreatment: 'invalid',
        fields: ['fieldC', 'fieldD', 'fieldE']
      }
    }
  }
}

test('Determine that a role with relevant doc permissions can be used to query for required fields.', () => {
  expect(canQuery(admin, 'places', ['fieldA', 'fieldB', 'fieldC'])).toEqual(true)
  expect(canQuery(wholeDocType, 'places', ['fieldA', 'fieldB', 'fieldC'])).toEqual(true)
  expect(canQuery(allUpdatesPermission, 'places', ['fieldA', 'fieldB', 'fieldC'])).toEqual(true)
  expect(canQuery(specificPermissionWhitelist, 'places', ['fieldA', 'fieldB', 'fieldC'])).toEqual(true)
  expect(canQuery(specificPermissionBlacklist, 'places', ['fieldA', 'fieldB', 'fieldC'])).toEqual(true)
})

test('Determine that a role without relevant doc permissions cannot be used to query for required fields.', () => {
  expect(canQuery(noDocType, 'places', ['fieldA', 'fieldB', 'fieldC'])).toEqual(false)
  expect(canQuery(deniedAllUpdatesPermission, 'places', ['fieldA', 'fieldB', 'fieldC'])).toEqual(false)
  expect(canQuery(deniedSpecificPermissionWhitelist, 'places', ['fieldA', 'fieldB', 'fieldC'])).toEqual(false)
  expect(canQuery(deniedSpecificPermissionBlacklist, 'places', ['fieldA', 'fieldB', 'fieldC'])).toEqual(false)
})

test('Reject an invalid fields treatment value.', () => {
  expect(() => canQuery(invalidFieldsTreatment, 'places', ['fieldA', 'fieldB', 'fieldC'])).toThrow(/Unrecognised fields treatment/)
})
