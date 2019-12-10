module.exports = {
  name: 'time',
  title: 'Time',
  description: 'A string with the time components arranged using the HH:mm:ss pattern.  For example 6:04pm would be recorded as 18:04:00.',
  examples: ['23:14:25', '02:59:10'],
  invalidExamples: [-1, 0, 999999, null, true, 'a house', {}, [], '33:14:25', '23:84:25', '23:24:95', '29:30:00', '8:00:00'],
  jsonSchema: {
    type: 'string',
    format: 'time'
  }
}
