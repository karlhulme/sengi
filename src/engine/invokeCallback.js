const check = require('check-types')
const { JsonotronCallbackError } = require('jsonotron-errors')

/**
 * Invokes the given function with the given parameters.  If the
 * given function throws an error then it will be wrapped in a
 * JsonotronCallbackError with the original error inside.
 * @param {String} callbackName The name of the callback.
 * @param {Function} func A function.
 * @param  {...any} params An array of parameters.
 */
const invokeCallback = async (callbackName, func, ...params) => {
  check.assert.string(callbackName)
  check.assert.function(func)
  check.assert.array(params)

  try {
    await Promise.resolve(func(...params))
  } catch (err) {
    throw new JsonotronCallbackError(callbackName, err)
  }
}

module.exports = invokeCallback
