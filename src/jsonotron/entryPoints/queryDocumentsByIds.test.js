/* eslint-env jest */
const { createTestRequest } = require('./shared.test')
const { JsonotronInsufficientPermissionsError } = require('../errors')
const queryDocumentsByIds = require('./queryDocumentsByIds')

test('Query by document ids.', async () => {
  const result = await queryDocumentsByIds({
    ...createTestRequest(),
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    ids: ['c75321e5-5c8a-49f8-a525-f0f472fb5fa0', '9070692f-b12c-4bbc-9888-5704fe5bc480']
  })

  expect(result).toEqual({
    docs: [
      { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0', fullName: 'Max Amillion' },
      { id: '9070692f-b12c-4bbc-9888-5704fe5bc480', fullName: 'David Marconi' }
    ]
  })
})

test('Query by document ids without an onFieldsQueried delegate.', async () => {
  await expect(queryDocumentsByIds({
    ...createTestRequest(),
    onFieldsQueried: null,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    ids: ['c75321e5-5c8a-49f8-a525-f0f472fb5fa0', '9070692f-b12c-4bbc-9888-5704fe5bc480']
  })).resolves.not.toThrow()
})

test('Fail to query by document ids if permissions insufficient.', async () => {
  await expect(queryDocumentsByIds({
    ...createTestRequest(),
    roleNames: ['invalid'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    ids: ['c75321e5-5c8a-49f8-a525-f0f472fb5fa0', '9070692f-b12c-4bbc-9888-5704fe5bc480']
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})
