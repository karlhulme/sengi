/* eslint-env jest */
import * as mdl from './index'

test('A createSengi function is exported from the module.', () => {
  expect(mdl).toHaveProperty('createSengi')
})
