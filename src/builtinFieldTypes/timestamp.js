module.exports = {
  name: 'timestamp',
  title: 'Timestamp',
  description: 'The number of milliseconds that have elapsed since 00:00:00 Thursday, 1 January 1970.',
  examples: [0, 123, 12345678],
  invalidExamples: [-25, null, true, 'string', {}, []],
  jsonSchema: {
    type: 'number',
    minimum: 0
  }
}
