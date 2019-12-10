module.exports = {
  name: 'positiveInteger',
  title: 'Positive Integer',
  description: 'A whole number that is equal to one or greater.',
  examples: [1, 25],
  invalidExamples: ['a string', '', null, true, {}, [], -25, 0],
  jsonSchema: {
    type: 'integer',
    minimum: 1
  }
}
