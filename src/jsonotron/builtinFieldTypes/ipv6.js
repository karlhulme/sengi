module.exports = {
  name: 'ipv6',
  title: 'IP Version 6',
  description: 'A string of digits that identify a computer on a network in IP v6 format.',
  examples: ['::1', 'FE80:CD00:0000:0CDE:1257:0000:211E:729C'],
  invalidExamples: [123, null, true, {}, [], 'ZZZZ:CD00:0000:0CDE:1257:0000:211E:729C'],
  jsonSchema: {
    type: 'string',
    format: 'ipv6'
  }
}
