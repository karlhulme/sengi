module.exports = {
  name: 'mediumString',
  title: 'Medium String',
  description: 'A string of 50 characters or less with at least one alphanumeric character.',
  examples: ['valid', 'a'.repeat(50)],
  invalidExamples: [123, null, true, {}, [], '', ' ', '  ', '!!', 'a'.repeat(51)],
  jsonSchema: {
    type: 'string',
    maxLength: 50,
    pattern: '\\w'
  }
}
