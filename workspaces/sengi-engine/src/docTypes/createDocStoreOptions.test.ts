import { expect, test } from '@jest/globals'
import { DocType } from 'sengi-interfaces'
import { createDocStoreOptions } from './createDocStoreOptions'
import { createCarDocType } from './shared.test'

function createDocType (): DocType {
  const docType = createCarDocType()

  docType.docStoreOptions = {
    propA: 'valueA'
  }

  return docType
}

test('Return doc store options combined with request options.', () => {
  expect(createDocStoreOptions(createDocType(), {})).toEqual({ propA: 'valueA' })
  expect(createDocStoreOptions(createDocType(), { propB: 'valueB' })).toEqual({ propA: 'valueA', propB: 'valueB' })
})
