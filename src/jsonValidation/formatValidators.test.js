/* eslint-env jest */
const { localDateTimeValidator, luhnValidator, utcDateTimeValidator } = require('./formatValidators')

test('Verify the local date/time validator.', () => {
  expect(localDateTimeValidator('2019-11-16T15:32:04+01:00')).toEqual(true)
  expect(localDateTimeValidator('1901-02-28T16:09:00-05:30')).toEqual(true)
  expect(localDateTimeValidator('2000-02-30T12:00:00Z')).toEqual(false)
  expect(localDateTimeValidator('1975-01-05T25:05:55+8:00')).toEqual(false)
  expect(localDateTimeValidator('1975-01-05T25:05:55+18:00')).toEqual(false)
})

test('Verify the luhn validator.', () => {
  expect(luhnValidator('4111111111111111')).toEqual(true)
  expect(luhnValidator('1234123412341234')).toEqual(false)
  expect(luhnValidator('a house')).toEqual(false)
})

test('Verify the utc date/time validator.', () => {
  expect(utcDateTimeValidator('2019-11-16T15:32:04Z')).toEqual(true)
  expect(utcDateTimeValidator('1901-02-28T16:09:00Z')).toEqual(true)
  expect(utcDateTimeValidator('2000-02-30T12:00:00Z')).toEqual(false)
  expect(utcDateTimeValidator('1975-01-05T25:05:55Z')).toEqual(false)
})
