import { expect, test } from '@jest/globals'
import { DocStoreUpsertResultCode, SengiConflictOnSaveError, SengiRequiredVersionNotAvailableError } from 'sengi-interfaces'
import { ensureUpsertSuccessful } from './ensureUpsertSuccessful'

test('Successful upserts are verified without errors being raised.', () => {
  expect(() => ensureUpsertSuccessful({ code: DocStoreUpsertResultCode.CREATED }, false)).not.toThrow()
  expect(() => ensureUpsertSuccessful({ code: DocStoreUpsertResultCode.REPLACED }, false)).not.toThrow()
  expect(() => ensureUpsertSuccessful({ code: DocStoreUpsertResultCode.CREATED }, true)).not.toThrow()
  expect(() => ensureUpsertSuccessful({ code: DocStoreUpsertResultCode.REPLACED }, true)).not.toThrow()
})

test('Conflict on save error raised if upsert fails due to required version being unavailable when reqVersion was NOT supplied externally.', () => {
  try {
    ensureUpsertSuccessful({ code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE }, false)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiConflictOnSaveError)
  }
})

test('Conflict on save error raised if upsert fails due to required version being unavailable when reqVersion WAS supplied externally.', () => {
  try {
    ensureUpsertSuccessful({ code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE }, true)
    throw new Error('fail')
  } catch (err) {
    expect(err).toBeInstanceOf(SengiRequiredVersionNotAvailableError)
  }
})
