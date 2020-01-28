module.exports = {
  name: 'sysUserIdentity',
  title: 'System User Identity',
  description: 'A string of 256 characters or less with at least one alphanumeric character that identifies a user.',
  examples: ['valid', 'a'.repeat(256)],
  invalidExamples: [123, null, true, {}, [], '', ' ', '  ', '!!', 'a'.repeat(257)],
  jsonSchema: {
    type: 'string',
    maxLength: 256,
    pattern: '\\w'
  }
}
