module.exports = {
  name: 'positiveFloatOrZero',
  title: 'Positive Floating Point Number or Zero',
  description: 'A number with an integral and decimal part that is greater than or equal to zero.',
  examples: [0, 0.001, 1, 1456.24],
  invalidExamples: ['a string', '', null, true, {}, [], -34.56, -1],
  jsonSchema: {
    type: 'number',
    minimum: 0
  }
}
