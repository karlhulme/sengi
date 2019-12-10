module.exports = {
  name: 'string',
  title: 'String',
  description: 'A string of zero or more characters.',
  examples: ['any string', '', ' '],
  invalidExamples: [123, null, true, {}, []],
  jsonSchema: {
    type: 'string'
  }
}
