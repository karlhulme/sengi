module.exports = {
  name: 'float',
  title: 'Floating Point Number',
  description: 'A number with an integral and decimal part.',
  examples: [-34.56, -1, 0, 1, 1456.24],
  invalidExamples: ['a string', '', null, true, {}, []],
  jsonSchema: {
    type: 'number'
  }
}
