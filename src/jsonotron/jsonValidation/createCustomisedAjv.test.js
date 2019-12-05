/* eslint-env jest */
const createCustomisedAjv = require('./createCustomisedAjv')

test('Can create a customised Ajv with bespoke keywords and formats.', () => {
  const ajv = createCustomisedAjv()
  expect(ajv).toBeDefined()
  expect(ajv.getKeyword('customTypeOf')).toBeTruthy()
})
