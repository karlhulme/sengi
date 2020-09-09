/* eslint-env jest */
import * as mdl from './index'

test('A Sengi (class) function is exported from the module.', () => {
  expect(mdl).toHaveProperty('Sengi')
})

test('The errors are exported from the module.', () => {
  expect(mdl).toHaveProperty('SengiCallbackError')
  expect(mdl).toHaveProperty('SengiDocumentNotFoundError')
  expect(mdl).toHaveProperty('SengiDocTypeInstanceValidationFailedError')
})
