module.exports = {
  name: 'docOpId',
  title: 'Document Operation ID',
  description: 'A universally unique 128 bit number formatted as 32 alphanumeric characters and defined by RFC 4122.',
  examples: ['123e4567-e89b-12d3-a456-426655440000'],
  invalidExamples: [123, null, true, {}, [], 'invalid', 'a123e4567-e89b-12d3-a456-426655440000', '123E4567-E89B-12D3-A456-426655440000'],
  jsonSchema: {
    type: 'string',
    pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  }
}
