const Ajv = require('ajv')
const { typeOfValidatorGenerator } = require('./keywordValidatorGenerators')
const {
  localDateTimeValidator,
  luhnValidator,
  utcDateTimeValidator
} = require('./formatValidators')

/**
 * Creates an instance of AJV with full formatting and
 * the jsonotron specific formats.
 */
const createCustomisedAjv = () => {
  const ajv = new Ajv({
    format: 'full',
    ownProperties: true
  })

  ajv.addFormat('jsonotron-utc-date-time', { validate: utcDateTimeValidator })
  ajv.addFormat('jsonotron-local-date-time', { validate: localDateTimeValidator })
  ajv.addFormat('jsonotron-luhn-algorithm', { validate: luhnValidator })

  ajv.addKeyword('customTypeOf', { compile: typeOfValidatorGenerator })

  return ajv
}

module.exports = createCustomisedAjv
