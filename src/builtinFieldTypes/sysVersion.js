module.exports = {
  name: 'sysVersion',
  title: 'System Version',
  description: 'A code that uniquely identifies an instance of a document.',
  examples: ['abcd'],
  invalidExamples: [123, null, true, {}, []],
  jsonSchema: {
    type: 'string',
    maxLength: 40,
    pattern: '\\w'
  }
}
