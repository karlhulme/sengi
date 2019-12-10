/* eslint-env jest */
const mdl = require('./index')

test('A createJsonotron function is exported from the module.', () => {
  expect(mdl).toHaveProperty('createJsonotron')
})
