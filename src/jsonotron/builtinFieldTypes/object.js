module.exports = {
  name: 'object',
  title: 'Object',
  description: 'A plain object.',
  examples: [{}, { hello: 'world' }],
  invalidExamples: [-1, 0, 999999, null, true, 'a house', []],
  jsonSchema: {
    type: 'object'
  }
}
