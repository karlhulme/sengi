const luhn = require('luhn')
const moment = require('moment')

/**
 * Returns true if the given string is a UTC date time
 * in the format of YYYY-MM-DD[T]HH:mm:ss[Z].  This format
 * must not include a timezone offset and instead will
 * end with a Z.
 * @param {String} v A string.
 */
const utcDateTimeValidator = v => moment(v, 'YYYY-MM-DD[T]HH:mm:ss[Z]', true).isValid()

/**
 * Returns true if the given string is a local date time
 * in the format of YYYY-MM-DD[T]HH:mm:ssZZ.  This format
 * must include a +/- timezone offset and not end with 'z' or Z.
 * @param {String} v A string.
 */
const localDateTimeValidator = v => moment(v, 'YYYY-MM-DD[T]HH:mm:ssZZ', true).isValid() && !v.toLowerCase().endsWith('z')

/**
 * Returns true if the given string is a card number
 * that satisfies the luhn algorithm.
 * @param {String} v A string.
 */
const luhnValidator = v => luhn.validate(v)

module.exports = {
  localDateTimeValidator,
  luhnValidator,
  utcDateTimeValidator
}
