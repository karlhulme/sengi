/* eslint-env jest */
const canOperate = require('./canOperate')

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
        operations: ['otherOp1', 'testOp', 'otherOp2']
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
        operations: ['otherOp1', 'otherOp2']
      }
    }
  }
}

test('Determine that a role with relevant doc permissions can be used to run an operation.', () => {
  expect(canOperate(admin, 'places', 'testOp')).toEqual(true)
  expect(canOperate(wholeDocType, 'places', 'testOp')).toEqual(true)
  expect(canOperate(allUpdatesPermission, 'places', 'testOp')).toEqual(true)
  expect(canOperate(specificPermission, 'places', 'testOp')).toEqual(true)
})

test('Determine that a role without relevant doc permissions cannot be used to run an operation.', () => {
  expect(canOperate(noDocType, 'places', 'testOp')).toEqual(false)
  expect(canOperate(deniedAllUpdatesPermission, 'places', 'testOp')).toEqual(false)
  expect(canOperate(deniedSpecificPermission, 'places', 'testOp')).toEqual(false)
})
