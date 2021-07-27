import { test, expect } from '@jest/globals'
import express, { Express, json } from 'express'
import { MemDocStore } from 'sengi-docstore-mem'
import { createSengiExpress } from '../src'
import { DocRecord, DocType, Client, DocTypeConstructor } from 'sengi-interfaces'
import { MemDocStoreFilter, MemDocStoreOptions, MemDocStoreQuery, MemDocStoreQueryResult } from 'sengi-docstore-mem/src'

function createAdminClient (): Client {
  return {
    name: 'admin',
    docPermissions: true,
    apiKeys: ['adminKey']
  }
}

function createGuestClient (): Client {
  return {
    name: 'guest',
    docPermissions: false,
    apiKeys: ['guestKey']
  }
}

export interface Film {
  id?: string
  docType?: string
  docOpIds?: string[]
  docVersion?: string
  filmTitle?: string
  durationInMinutes?: number
  castMembers?: string[]
  totalCastSize?: number
}

export interface ExampleUser {
  name: string
}

function createFilmDocType (): DocType<Film, MemDocStoreOptions, ExampleUser, MemDocStoreFilter, MemDocStoreQuery, MemDocStoreQueryResult> {
  return {
    name: 'film',
    pluralName: 'films',
    jsonSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string' },
        docType: { type: 'string' },
        docOpIds: { type: 'array', items: { type: 'string' } },
        docVersion: { type: 'string' },
        filmTitle: { type: 'string' },
        durationInMinutes: { type: 'number' },
        castMembers: { type: 'array', items: { type: 'string' } },
        totalCastSize: { type: 'number' }
      },
      required: ['id', 'docType', 'docOpIds', 'filmTitle']
    },
    readonlyFieldNames: ['durationInMinutes'],
    policy: {
      canDeleteDocuments: true,
      canReplaceDocuments: true,
      canFetchWholeCollection: true,
      maxOpIds: 5
    },
    constructors: {
      makeShort: {
        parametersJsonSchema: {
          type: 'object',
          properties: {
            title: { type: 'string' }
          },
          required: ['title']
        },
        implementation: props => ({
          filmTitle: props.parameters.title,
          durationInMinutes: 15
        })
      } as DocTypeConstructor<Film, ExampleUser, Record<string, string>>
    },
    filters: {
      byDuration: {
        parametersJsonSchema: {
          type: 'object',
          properties: {
            minDuration: { type: 'number' }
          },
          required: ['minDuration']
        },
        parse: props => (film: Film) => (film.durationInMinutes || 0) > props.parameters.minDuration
      },
      byEmptyCast: {
        parametersJsonSchema: {},
        parse: () => (film: Film) => (film.totalCastSize || 0) === 0
      }
    },
    operations: {
      addCastMember: {
        parametersJsonSchema: {
          type: 'object',
          properties: {
            actor: { type: 'string' }
          },
          required: ['actor']
        },
        implementation: props => {
          if (!Array.isArray(props.doc.castMembers)) {
            props.doc.castMembers = []
          }

          props.doc.castMembers.push(props.parameters.actor)
        }
      }
    },
    queries: {
      count: {
        parametersJsonSchema: {},
        parse: () => ({ count: true }),
        responseJsonSchema: {
          type: 'object',
          properties: {
            count: { type: 'number' }
          },
          required: ['count']
        },
        coerce: result => ({ count: result.count || -1 })
      },
      countWithParam: {
        parametersJsonSchema: {
          type: 'object',
          properties: {
            dummy: { type: 'string' }
          }
        },
        parse: () => ({ count: true }),
        responseJsonSchema: {
          type: 'object',
          properties: {
            count: { type: 'number' }
          },
          required: ['count']
        },
        coerce: result => ({ count: result.count || -1 })
      }
    },
    validate: doc => {
      if (doc.filmTitle?.startsWith('The')) {
        throw new Error('Films must have imaginative names.')
      }
    }
  }
}

interface TestableApp {
  filmDocType: DocType<Film, MemDocStoreOptions, ExampleUser, MemDocStoreFilter, MemDocStoreQuery, MemDocStoreQueryResult>
  adminClient: Client
  testableApp: Express
  docs: DocRecord[]
}

export function createTestableApp (): TestableApp {
  const docs: DocRecord[] = [{
    id: 'ba8f06b4-9b41-4e71-849c-484433afee79',
    docType: 'film',
    docVersion: 'xyz',
    docOpIds: ['0000d8e8-70b5-4968-8fc8-f9ef8b150000'],
    filmTitle: 'Die Hard',
    durationInMinutes: 105,
    castMembers: [],
    totalCastSize: 0
  }, {
    id: '8c6e2aa0-b88d-4d14-966e-da8d3941d13c',
    docType: 'film',
    docVersion: 'xyz',
    docOpIds: [],
    filmTitle: 'Home Alone',
    durationInMinutes: 91,
    castMembers: ['Bob Hope'],
    totalCastSize: 1
  }]
  const memDocStore = new MemDocStore({ docs, generateDocVersionFunc: () => 'xxxx' })

  const filmDocType = createFilmDocType()

  const adminClient = createAdminClient()
  const guestClient = createGuestClient()

  const sengiExpress = createSengiExpress({
    docTypes: [filmDocType],
    clients: [adminClient, guestClient],
    docStore: memDocStore,
    newUuid: () => '00000000-0000-0000-0000-000000000001',
    userSchema: { type: 'object' }
  })

  const testableApp = express()
  testableApp.use(json())
  testableApp.use('/root', sengiExpress)

  return {
    filmDocType,
    adminClient,
    testableApp,
    docs
  }
}

test('Testable app can be created.', () => {
  const { testableApp, docs } = createTestableApp()
  expect(testableApp).toBeDefined()
  expect(docs).toBeDefined()
})
