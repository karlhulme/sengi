module.exports = {
  name: 'integer',
  title: 'Integer',
  description: 'A whole number.',
  examples: [-25, 0, 25],
  invalidExamples: ['a string', '', null, true, {}, []],
  jsonSchema: {
    type: 'integer'
  }
}
