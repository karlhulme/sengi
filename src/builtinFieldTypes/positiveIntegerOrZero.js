module.exports = {
  name: 'positiveIntegerOrZero',
  title: 'Positive Integer or Zero',
  description: 'A whole number that is equal to zero or greater.',
  examples: [0, 1, 25],
  invalidExamples: ['a string', '', null, true, {}, [], -25],
  jsonSchema: {
    type: 'integer',
    minimum: 0
  }
}
