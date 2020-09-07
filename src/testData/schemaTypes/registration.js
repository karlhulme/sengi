export const registration = {
  name: 'registration',
  title: 'Registration',
  paragraphs: ['A vehicle registration.'],
  examples: [{ value: 'HG23 6JK' }],
  validTestCases: ['HG23 6JK'],
  invalidTestCases: [123, null, true, {}, [], 'invalid', 'hg23 6jk'],
  jsonSchema: {
    type: 'string',
    pattern: '^[A-Z]{2}[0-9]{2} [0-9]{1}[A-Z]{2}$'
  }
}
