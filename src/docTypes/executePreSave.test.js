/* eslint-env jest */
const {
  JsonotronPreSaveFailedError
} = require('../errors')
const executePreSave = require('./executePreSave')

test('Executing a valid pre-save function raises no errors.', () => {
  const docType = {
    name: 'example',
    fields: {
      result: {}
    },
    preSave: () => {}
  }
  const doc = {}
  expect(() => executePreSave(docType, doc)).not.toThrow()
})

test('Executing a pre-save function on a doc type that does not define one raises no errors.', () => {
  const docType = {
    name: 'example2',
    fields: {
      result: {}
    }
  }
  const doc = {}
  expect(() => executePreSave(docType, doc)).not.toThrow()
})

test('Executing a pre-save function that raises errors will be wrapped.', () => {
  const docType = {
    name: 'example3',
    fields: {
      result: {}
    },
    preSave: () => { throw new Error('failure') }
  }
  const doc = {}
  expect(() => executePreSave(docType, doc)).toThrow(JsonotronPreSaveFailedError)
  expect(() => executePreSave(docType, doc)).toThrow(/Pre-save/)
  expect(() => executePreSave(docType, doc)).toThrow(/failure/)
})
