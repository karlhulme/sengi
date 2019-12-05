module.exports = {
  name: 'registration',
  title: 'Registration',
  description: 'A vehicle registration.',
  examples: ['HG23 6JK'],
  invalidExamples: [123, null, true, {}, [], 'invalid', 'hg23 6jk'],
  jsonSchema: {
    type: 'string',
    pattern: '^[A-Z]{2}[0-9]{2} [0-9]{1}[A-Z]{2}$'
  }
}
