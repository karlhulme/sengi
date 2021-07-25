import { test, expect } from '@jest/globals'
import { Client, DocStore, DocStoreDeleteByIdResultCode, DocStoreUpsertResultCode, DocType, DocTypeConstructor, DocTypeOperation } from 'sengi-interfaces'
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

export interface AuthUser {
  userId?: string
  username?: string
}

export function createCarDocType (): DocType<Car, TestDocStoreOptions, AuthUser, string, string, number> {
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
        implementation: props => ({
          manufacturer: 'tesla',
          model: 'T',
          registration: props.parameters
        })
      } as DocTypeConstructor<Car, AuthUser, string>
    },
    filters: {
      byModel: {
        parametersJsonSchema: {
          type: 'string'
        },
        parse: props => `MODEL=${props.parameters}`
      }
    },
    operations: {
      upgradeModel: {
        parametersJsonSchema: {
          type: 'number'
        },
        implementation: props => {
          props.doc.model = props.doc.model + props.parameters
        }
      } as DocTypeOperation<Car, AuthUser, string>
    },
    queries: {
      count: {
        parametersJsonSchema: {
          type: 'string'
        },
        parse: props => `COUNT ${props.parameters}`,
        responseJsonSchema: {
          type: 'number'
        },
        coerce: result => result
      }
    },
    preSave: props => {
      if (props.doc.originalOwner) {
        delete props.doc.originalOwner
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

function createAdminClient (): Client {
  return {
    name: 'admin',
    docPermissions: true,
    apiKeys: ['adminKey']
  }
}

function createNoneClient (): Client {
  return {
    name: 'none',
    docPermissions: false,
    apiKeys: ['noneKey']
  }
}

export function createMockStore (docStoreOverrides?: Record<string, unknown>): DocStore<TestDocStoreOptions, string, string, number> {
  return Object.assign({
    deleteById: async () => ({ code: DocStoreDeleteByIdResultCode.NOT_FOUND }),
    exists: async () => ({ found: false }),
    fetch: async () => ({ doc: null }),
    query: async () => ({ data: 0 }),
    selectAll: async () => ({ docs: [] }),
    selectByFilter: async () => ({ docs: [] }),
    selectByIds: async () => ({ docs: [] }),
    upsert: async () => ({ code: DocStoreUpsertResultCode.VERSION_NOT_AVAILABLE })
  }, docStoreOverrides)
}

export interface TestRequestProps {
  foo?: string
}

interface SengiTestObjects {
  sengi: Sengi<TestRequestProps, TestDocStoreOptions, AuthUser, string, string, number>
  sengiCtorOverrides: Record<string, unknown>
  docStore: DocStore<TestDocStoreOptions, string, string, number>
  carDocType: DocType<Car, TestDocStoreOptions, AuthUser, string, string, number>
  adminClient: Client
}

export const createSengiWithMockStore = (docStoreOverrides?: Record<string, unknown>, sengiCtorOverrides?: Record<string, unknown>): SengiTestObjects => {
  const docStore = createMockStore(docStoreOverrides)

  const carDocType = createCarDocType()
  
  const adminClient = createAdminClient()
  const noneClient = createNoneClient()

  const sengi = new Sengi<TestRequestProps, TestDocStoreOptions, AuthUser, string, string, number>(Object.assign({
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
    clients: [adminClient, noneClient],
    docStore
  }, sengiCtorOverrides) as unknown as SengiConstructorProps<TestRequestProps, TestDocStoreOptions, AuthUser, string, string, number>)

  return {
    sengi,
    sengiCtorOverrides: sengiCtorOverrides || {},
    docStore,
    carDocType,
    adminClient
  }
}

export const defaultRequestProps = {
  docTypeName: 'car',
  apiKey: 'adminKey',
  reqProps: { foo: 'bar' },
  docStoreOptions: { custom: 'prop' },
  user: {}
}

test('createSengiWithMockStore creates a valid sengi object.', async () => {
  const objects = createSengiWithMockStore({})
  expect(objects.sengi).toBeDefined()
  expect(objects.sengiCtorOverrides).toBeDefined()
  expect(objects.docStore).toBeDefined()
})
