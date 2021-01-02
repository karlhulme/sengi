import { test, expect } from '@jest/globals'
import fs from 'fs'
import { testDocTypes } from './docTypes'
import { testRoleTypes } from './roleTypes'
import { Sengi, SengiConstructorProps } from '../src'
import { DocStore, DocStoreDeleteByIdResultCode, DocStoreUpsertResultCode } from 'sengi-interfaces'

interface SengiTestObjects {
  sengi: Sengi
  sengiCtorOverrides: Record<string, unknown>
  docStore: DocStore
}

export const createSengiWithMockStore = (docStoreOverrides?: Record<string, unknown>, sengiCtorOverrides?: Record<string, unknown>): SengiTestObjects => {
  const dayOfWeekType = fs.readFileSync('./test/testTypeSystem/dayOfWeek.yaml', 'utf-8')
  const mediumStringType = fs.readFileSync('./test/testTypeSystem/mediumString.yaml', 'utf-8')
  const positiveIntegerType = fs.readFileSync('./test/testTypeSystem/positiveInteger.yaml', 'utf-8')
  const shortStringType = fs.readFileSync('./test/testTypeSystem/shortString.yaml', 'utf-8')

  const docStore: DocStore = Object.assign({
    deleteById: async () => ({ code: DocStoreDeleteByIdResultCode.NOT_FOUND }),
    exists: async () => ({ found: false }),
    fetch: async () => ({ doc: null }),
    queryAll: async () => ({ docs: [] }),
    queryByFilter: async () => ({ docs: [] }),
    queryByIds: async () => ({ docs: [] }),
    upsert: async () => ({ code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE })
  }, docStoreOverrides)

  const sengi = new Sengi(Object.assign({
    docTypes: testDocTypes,
    roleTypes: testRoleTypes,
    jsonotronTypes: [dayOfWeekType, mediumStringType, positiveIntegerType, shortStringType],
    docStore
  }, sengiCtorOverrides) as unknown as SengiConstructorProps)

  return {
    sengi,
    sengiCtorOverrides: sengiCtorOverrides || {},
    docStore
  }
}

export const defaultRequestProps = {
  roleNames: ['admin'],
  reqProps: { foo: 'bar' },
  docStoreOptions: { custom: 'prop' }
}

test('createSengiWithMockStore creates a valid sengi object.', async () => {
  const objects = createSengiWithMockStore({})
  expect(objects.sengi).toBeDefined()
  expect(objects.sengiCtorOverrides).toBeDefined()
  expect(objects.docStore).toBeDefined()
})
