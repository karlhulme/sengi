/* eslint-env jest */
const { JsonotronUnrecognisedRoleTypeNameError } = require('../errors')
const selectRoleTypeFromArray = require('./selectRoleTypeFromArray')

const roleTypes = [{
  name: 'role1'
}, {
  name: 'role2'
}]

test('Get the role type from the list.', () => {
  expect(selectRoleTypeFromArray('role1', roleTypes)).toEqual(roleTypes[0])
  expect(selectRoleTypeFromArray('role2', roleTypes)).toEqual(roleTypes[1])
})

test('Fail to get an invalid role type.', () => {
  expect(() => selectRoleTypeFromArray('role3', roleTypes)).toThrow(JsonotronUnrecognisedRoleTypeNameError)
  expect(() => selectRoleTypeFromArray('role3', roleTypes)).toThrow(/role3/)
})
