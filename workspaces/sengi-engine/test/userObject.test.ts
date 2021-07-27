import { test, expect, jest } from '@jest/globals'
import { DocStoreUpsertResultCode, SengiUserValidationFailedError } from 'sengi-interfaces'
import { asError } from '../src/utils'
import { createSengiWithMockStore, defaultRequestProps } from './shared.test'

const newCar = {
  manufacturer: 'ford',
  model: 'ka',
  registration: 'HG12 3AB'
}

test('Supplying a valid user object is accepted.', async () => {
  const { sengi } = createSengiWithMockStore({
    exists: jest.fn(async() => ({ found: false })),
    upsert: jest.fn(async () => ({ code: DocStoreUpsertResultCode.CREATED }))
  })

  await expect(sengi.newDocument({
    ...defaultRequestProps,
    user: { userId: 'testUser', username: 'valid-string' },
    docTypeName: 'car',
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    doc: newCar 
  })).resolves.toEqual({ isNew: true })
})

test('Supplying a invalid user object causes an error.', async () => {
  const { sengi } = createSengiWithMockStore({
    exists: jest.fn(async() => ({ found: false })),
    upsert: jest.fn(async () => ({ code: DocStoreUpsertResultCode.CREATED }))
  })

  await expect(sengi.newDocument({
    ...defaultRequestProps,
    user: { userId: 123, username: 'invalid: not-a-string' },
    docTypeName: 'car',
    id: 'd7fe060b-2d03-46e2-8cb5-ab18380790d1',
    doc: newCar 
  })).rejects.toThrow(asError(SengiUserValidationFailedError))
})
