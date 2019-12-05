module.exports = {
  name: 'jsonPointer',
  title: 'JSON Pointer',
  description: 'A JSON pointer.',
  examples: ['/root/tree/leaf', '/root/tree/1/leaf'],
  invalidExamples: [123, null, true, {}, [], 'invalid.path', '#/path'],
  jsonSchema: {
    type: 'string',
    format: 'json-pointer'
  }
}
