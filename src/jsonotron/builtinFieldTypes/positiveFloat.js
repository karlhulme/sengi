module.exports = {
  name: 'positiveFloat',
  title: 'Positive Floating Point Number',
  description: 'A number with an integral and decimal part that is greater than zero.',
  examples: [0.001, 1, 1456.24],
  invalidExamples: ['a string', '', null, true, {}, [], -34.56, -1, 0],
  jsonSchema: {
    type: 'number',
    exclusiveMinimum: 0
  }
}
