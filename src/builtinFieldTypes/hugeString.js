module.exports = {
  name: 'hugeString',
  title: 'Huge String',
  description: 'A string of 4000 characters or less with at least one alphanumeric character.',
  examples: ['valid', 'a'.repeat(4000)],
  invalidExamples: [123, null, true, {}, [], '', ' ', '  ', '!!', 'b'.repeat(4001)],
  jsonSchema: {
    type: 'string',
    maxLength: 4000,
    pattern: '\\w'
  }
}
