import { test, expect } from '@jest/globals'
import { DocStore, DocStoreDeleteByIdResultCode, DocStoreUpsertResultCode, DocType, RoleType } from 'sengi-interfaces'
import { Sengi, SengiConstructorProps } from '../src'

export interface TestDocStoreOptions {
  custom: string
}

export interface Car {
  id?: string
  docType?: string
  docOpIds?: string[]
  docVersion?: string
  manufacturer?: string
  model?: string
  registration?: string
  /**
   * @deprecated
   */
  originalOwner?: string
}

function createCarDocType (): DocType<Car, TestDocStoreOptions, string, string, number> {
  return {
    name: 'car',
    pluralName: 'cars',
    summary: 'A car',
    jsonSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string' },
        docType: { type: 'string' },
        docOpIds: { type: 'array', items: { type: 'string' } },
        docVersion: { type: 'string' },
        manufacturer: { type: 'string' },
        model: { type: 'string' },
        registration: { '$ref': 'https://testing.org/test/registration' },
        originalOwner: { type: 'string' }
      }
    },
    readonlyFieldNames: ['manufacturer'],
    policy: {
      canDeleteDocuments: true,
      canReplaceDocuments: true,
      canFetchWholeCollection: true,
      maxOpIds: 5
    },
    constructors: {
      regTesla: {
        parametersJsonSchema: {
          type: 'string'
        },
        implementation: (newReg: string) => ({
          manufacturer: 'tesla',
          model: 'T',
          registration: newReg
        })
      }
    },
    filters: {
      byModel: {
        parametersJsonSchema: {
          type: 'string'
        },
        parse: model => `MODEL=${model}`
      }
    },
    operations: {
      upgradeModel: {
        parametersJsonSchema: {
          type: 'number'
        },
        implementation: (doc, newVersion) => {
          doc.model = doc.model + newVersion
        }
      }
    },
    queries: {
      count: {
        parametersJsonSchema: {
          type: 'string'
        },
        parse: section => `COUNT ${section}`,
        responseJsonSchema: {
          type: 'number'
        },
        coerce: result => result
      }
    },
    preSave: doc => {
      if (doc.originalOwner) {
        delete doc.originalOwner
      }
    },
    validate: doc => {
      if (doc.registration && !(doc.registration as string).startsWith('HG')) {
        throw new Error('Unrecognised vehicle registration prefix.')
      }
    },
    docStoreOptions: {
      custom: 'prop'
    }
  }
}

function createAdminRoleType (): RoleType {
  return {
    name: 'admin',
    title: 'Admin',
    summary: '',
    docPermissions: true
  }
}

export interface TestRequestProps {
  foo?: string
}

interface SengiTestObjects {
  sengi: Sengi<TestRequestProps, TestDocStoreOptions, string, string, number>
  sengiCtorOverrides: Record<string, unknown>
  docStore: DocStore<TestDocStoreOptions, string, string, number>
  carDocType: DocType<Car, TestDocStoreOptions, string, string, number>
  adminRoleType: RoleType
}

export const createSengiWithMockStore = (docStoreOverrides?: Record<string, unknown>, sengiCtorOverrides?: Record<string, unknown>): SengiTestObjects => {
  const docStore: DocStore<TestDocStoreOptions, string, string, number> = Object.assign({
    deleteById: async () => ({ code: DocStoreDeleteByIdResultCode.NOT_FOUND }),
    exists: async () => ({ found: false }),
    fetch: async () => ({ doc: null }),
    query: async () => ({ data: 0 }),
    selectAll: async () => ({ docs: [] }),
    selectByFilter: async () => ({ docs: [] }),
    selectByIds: async () => ({ docs: [] }),
    upsert: async () => ({ code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE })
  }, docStoreOverrides)

  const carDocType = createCarDocType()
  const adminRoleType = createAdminRoleType()

  const sengi = new Sengi<TestRequestProps, TestDocStoreOptions, string, string, number>(Object.assign({
    schemas: [
      {
        '$id': 'https://testing.org/test/registration',
        '$schema': 'http://json-schema.org/draft-07/schema#',
        title: 'Registration',
        type: 'string',
        maxLength: 10
      }
    ],
    docTypes: [carDocType],
    roleTypes: [adminRoleType],
    docStore
  }, sengiCtorOverrides) as unknown as SengiConstructorProps<TestRequestProps, TestDocStoreOptions, string, string, number>)

  return {
    sengi,
    sengiCtorOverrides: sengiCtorOverrides || {},
    docStore,
    adminRoleType,
    carDocType
  }
}

export const defaultRequestProps = {
  docTypeName: 'car',
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
