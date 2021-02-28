import { expect, jest, test } from '@jest/globals'
import { DocStoreUpsertResultCode } from 'sengi-interfaces'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

const constructorParams = {
  shortName: 'Donald',
  fullName: 'Donald Fresh',
  dateOfBirth: '2000-01-02',
  askedAboutMarketing: 'yes'
}

test('Log requests to the console.', async () => {
  const { sengi } = createSengiWithMockStore({
    exists: jest.fn(async() => ({ found: false })),
    upsert: jest.fn(async () => ({ code: DocStoreUpsertResultCode.CREATED }))
  }, {
    log: true
  })

  const origFn = console.log

  try { 
    const newFn = jest.fn()
    console.log = newFn

    sengi.createDocument({
      ...defaultRequestProps,
      docTypeName: 'person',
      id: 'd7fe060b-1111-2222-3333-ab1838078473',
      constructorParams
    })

    expect(newFn.mock.calls.length).toEqual(1)
    expect(newFn.mock.calls[0]).toEqual([expect.stringContaining('CREATE person')])
  } finally {
    console.log = origFn
  }
})
