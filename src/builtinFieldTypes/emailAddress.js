module.exports = {
  name: 'emailAddress',
  title: 'Email Address',
  description: 'An email address.',
  examples: ['a.person@hostname.top.com', 'short_@hi.org'],
  invalidExamples: [123, null, true, {}, [], 'bloke@place.', 'person@here.co@'],
  jsonSchema: {
    type: 'string',
    format: 'email'
  }
}
