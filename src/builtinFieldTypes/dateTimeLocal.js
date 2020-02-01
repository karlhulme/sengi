module.exports = {
  name: 'dateTimeLocal',
  title: 'Date & Time Local',
  description: 'An object with properties for (a) the date and time, (b) the name of a timezone and (c) a timestamp of when the information was captured.\nThe dateTime property is a number with the date and time components arranged using the YYYYMMDDHHmmss pattern.\nThe timeZoneCode property is a world time zone abbreviation code.\nThe captured property is the number of milliseconds since the epoch when the local date-time value was captured.',
  examples: [
    { dateTime: '2010-02-04T05:30:12+01:00', timeZone: 'Europe/London', captured: 1563119540628 },
    { dateTime: '2011-04-30T16:41:00+00:00', timeZone: 'Europe/London', captured: 1563119547583 }
  ],
  invalidExamples: [
    null, true, 12, 'a string', [], {},
    { dateTime: '19500101123456', timeZone: 'Europe/London', captured: 1563119540628 },
    { dateTime: '2010-02-04T05:30:12+01:00', timeZone: 'madeup', captured: 1563119540628 },
    { dateTime: '2010-02-04T05:30:12+0:00', timeZone: 'Europe/London', captured: 1563119540628 },
    { dateTime: '2010-02-04T05:30:12Z', timeZone: 'Europe/London', captured: 1563119540628 }
  ],
  jsonSchema: definitionsPath => ({
    type: 'object',
    additionalProperties: false,
    properties: {
      dateTime: { type: 'string', format: 'custom-local-date-time' },
      timeZone: { $ref: `${definitionsPath}timeZone` },
      captured: { $ref: `${definitionsPath}timestamp` }
    },
    required: ['dateTime', 'timeZone', 'captured']
  }),
  referencedFieldTypes: ['timeZone', 'timestamp']
}
