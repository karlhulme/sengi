/* eslint-env jest */
import * as mdl from './index'

test('A createJsonotron function is exported from the module.', () => {
  expect(mdl).toHaveProperty('createJsonotron')
})
