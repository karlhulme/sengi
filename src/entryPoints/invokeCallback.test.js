/* eslint-env jest */
const { JsonotronCallbackError } = require('../errors')
const invokeCallback = require('./invokeCallback')

test('A callback should be invoked with the given parameters.', async () => {
  const callback = jest.fn()
  expect(invokeCallback('myCallback', callback, 1, true, ['foo', 'bar'])).resolves.not.toThrow()
  expect(callback.mock.calls[0]).toEqual([1, true, ['foo', 'bar']])
})

test('An async callback should be invoked with the given parameters.', async () => {
  const callback = jest.fn(async () => {})
  expect(invokeCallback('myAsyncCallback', callback, 1, true, ['foo', 'bar'])).resolves.not.toThrow()
  expect(callback.mock.calls[0]).toEqual([1, true, ['foo', 'bar']])
})

test('A callback should be invoked even if there are no parameters.', () => {
  const callback = jest.fn()
  expect(invokeCallback('myCallback', callback)).resolves.not.toThrow()
  expect(callback.mock.calls[0]).toEqual([])
})

test('An async callback should be invoked even if there are no parameters.', () => {
  const callback = jest.fn(async () => {})
  expect(invokeCallback('myCallback', callback)).resolves.not.toThrow()
  expect(callback.mock.calls[0]).toEqual([])
})

test('A callback that throws an error should be wrapped in a JsonotronCallbackError.', () => {
  const callback = jest.fn(() => { throw new Error('the inner error') })
  expect(invokeCallback('myCallback', callback, 1, true, ['foo', 'bar'])).rejects.toThrow(JsonotronCallbackError)
})

test('An async callback that throws an error should be wrapped in a JsonotronCallbackError.', () => {
  const callback = jest.fn(async () => { throw new Error('the inner error') })
  expect(invokeCallback('myCallback', callback, 1, true, ['foo', 'bar'])).rejects.toThrow(JsonotronCallbackError)
})