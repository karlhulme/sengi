module.exports = {
  name: 'telephoneNo',
  title: 'Telephone Number',
  description: 'A telephone number with properties for (a) the international subscriber (dialling) code and (b) the national telephone number.',
  examples: [{ isd: '44', number: '1234567' }],
  invalidExamples: [
    null, true, 12, 'a string', [], {},
    { isd: '044', number: '1234567' },
    { isd: 44, number: '1234567' },
    { isd: '44', number: 1234567 }
  ],
  jsonSchema: {
    type: 'object',
    properties: {
      isd: { $ref: '#/definitions/callingCode' },
      number: { $ref: '#/definitions/shortString' }
    },
    required: ['isd', 'number']
  },
  referencedFieldTypes: ['callingCode', 'shortString']
}
