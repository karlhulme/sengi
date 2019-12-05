module.exports = {
  name: 'dateTimeUtc',
  title: 'Date & Time UTC',
  description: 'A string with the date and time components arranged using the YYYY-MM-DDTHH:mm:ssZ pattern.  For example 15th May 1950 at 6:04pm would be recorded as 1950-05-15T18:04:00Z.',
  examples: ['2014-09-15T23:14:25Z', '2025-10-30T02:59:10Z'],
  invalidExamples: [-1, 0, 999999, null, true, 'a house', {}, [], '2014-22-25T23:14:25Z', '2014-09-75T23:14:25Z', '2014-09-75T23:84:25Z', '2014-02-31T13:00:00Z', '2014-02-31T13:00:00+01:00'],
  jsonSchema: {
    type: 'string',
    format: 'custom-utc-date-time'
  }
}
