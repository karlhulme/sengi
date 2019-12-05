/* eslint-env jest */
const builtinDocTypes = require('../builtinDocTypes')
const builtinFieldTypes = require('../builtinFieldTypes')
const createCustomisedAjv = require('./createCustomisedAjv')
const initValidatorCache = require('./initValidatorCache')

test('Initialised validator cache has field type value validators defined.', () => {
  const validatorCache = initValidatorCache(createCustomisedAjv(), builtinDocTypes, builtinFieldTypes)

  expect(validatorCache).toBeDefined()
  expect(validatorCache.fieldTypeValueValidatorExists('shortString'))
  expect(validatorCache.fieldTypeValueValidatorExists('integer'))
  expect(validatorCache.fieldTypeValueValidatorExists('paymentCardNo'))
  expect(validatorCache.fieldTypeValueValidatorExists('timeZone'))
})
