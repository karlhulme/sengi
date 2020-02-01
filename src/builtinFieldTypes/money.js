module.exports = {
  name: 'money',
  title: 'Money',
  description: 'A monetary amount with properties for (a) the integral amount of the currency, (b) the exponent to use when scaling the value by a factor of 10 and (c) the code of the currency.\nThe amount property is a whole number so the amount may need to scaled up or down by several factors of 10.  For example £11.25 would be stored as 1125.\nThe scaler property is a whole number indicating the scaling factor used to allow the amount to be stored as a whole number.  For example £11.25 would require a scaling factor of 2, interpreted as 11.25 * 10^2.\nThe currency property is a code that denotes a specific world currency.',
  examples: [{ amount: 1125, scaler: 2, currency: 'GBP' }],
  invalidExamples: [
    null, true, 12, 'a string', [], {},
    { amount: 11.25, scaler: 2, currency: 'GBP' },
    { amount: 1125, scaler: 2.5, currency: 'GBP' },
    { amount: 1125, scaler: 2, currency: 'invalid_currency_code' }
  ],
  jsonSchema: definitionsPath => ({
    type: 'object',
    additionalProperties: false,
    properties: {
      amount: { $ref: `${definitionsPath}integer` },
      scaler: { $ref: `${definitionsPath}integer` },
      currency: { $ref: `${definitionsPath}currencyCode` }
    },
    required: ['amount', 'scaler', 'currency']
  }),
  referencedFieldTypes: ['integer', 'currencyCode']
}
