module.exports = {
  name: 'longString',
  title: 'Long String',
  description: 'A string of 250 characters or less with at least one alphanumeric character.',
  examples: ['valid', 'a'.repeat(250)],
  invalidExamples: [123, null, true, {}, [], '', ' ', '  ', '!!', 'b'.repeat(251)],
  jsonSchema: {
    type: 'string',
    maxLength: 250,
    pattern: '\\w'
  }
}
