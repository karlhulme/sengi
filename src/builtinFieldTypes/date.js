module.exports = {
  name: 'date',
  title: 'Date',
  description: 'A string with the date components arranged using the YYYY-MM-DD pattern.  For example 15th May 1950 would be recorded as 1950-05-15.',
  examples: ['2014-09-15', '2025-10-30'],
  invalidExamples: [-1, 0, 999999, null, true, 'a house', {}, [], '2014-22-25', '2014-09-75', '2014-02-31'],
  jsonSchema: {
    type: 'string',
    format: 'date'
  }
}
