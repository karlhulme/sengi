import check from 'check-types'
import { SengiCallbackError } from '../errors'

/**
 * Invokes the given function with the given parameters.  If the
 * given function throws an error then it will be wrapped in a
 * SengiCallbackError with the original error inside.
 * @param {String} callbackName The name of the callback.
 * @param {Function} func A function.
 * @param  {...any} params An array of parameters.
 */
export const invokeCallback = async (callbackName, func, ...params) => {
  check.assert.string(callbackName)
  check.assert.function(func)
  check.assert.array(params)

  try {
    await Promise.resolve(func(...params))
  } catch (err) {
    throw new SengiCallbackError(callbackName, err)
  }
}
