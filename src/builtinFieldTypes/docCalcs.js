module.exports = {
  name: 'docCalcs',
  title: 'Document Calculations',
  description: 'The values of the calculated fields as determined on the last update.',
  examples: [{
    calc1: { value: 123 },
    calc2: { value: 'abc' },
    calc3: { value: [] }
  }],
  invalidExamples: [123, null, true, []],
  jsonSchema: {
    type: 'object',
    additionalProperties: {
      type: 'object',
      additionalProperties: false,
      properties: {
        value: {}
      }
    }
  }
}
