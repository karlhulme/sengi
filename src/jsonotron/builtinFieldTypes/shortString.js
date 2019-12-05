module.exports = {
  name: 'shortString',
  title: 'Short String',
  description: 'A string of 20 characters or less with at least one alphanumeric character.',
  examples: ['valid', 'abcdefghijklmnopqrst'],
  invalidExamples: [123, null, true, {}, [], '', ' ', '  ', '!!', 'abcdefghijklmnopqrstu'],
  jsonSchema: {
    type: 'string',
    maxLength: 20,
    pattern: '\\w'
  }
}
