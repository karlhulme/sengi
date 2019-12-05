/* eslint-env jest */
const { createTestRequest } = require('./shared.test')
const {
  JsonotronActionForbiddenByPolicyError,
  JsonotronInsufficientPermissionsError
} = require('../errors')
const queryDocuments = require('./queryDocuments')

test('Query all document of a type in collection.', async () => {
  const result = await queryDocuments({
    ...createTestRequest(),
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id']
  })

  expect(result).toEqual({
    docs: [
      { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0' },
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9' },
      { id: '9070692f-b12c-4bbc-9888-5704fe5bc480' }
    ]
  })
})

test('Query all document of a type in collection without an onFieldsQueried delegate.', async () => {
  await expect(queryDocuments({
    ...createTestRequest(),
    onFieldsQueried: null,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id']
  })).resolves.not.toThrow()
})

test('Query all documents of a type with declared, calculated and default fields.', async () => {
  const result = await queryDocuments({
    ...createTestRequest(),
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'shortName', 'allowMarketing', 'fullAddress']
  })

  expect(result).toEqual({
    docs: [
      { id: 'c75321e5-5c8a-49f8-a525-f0f472fb5fa0', shortName: 'Max', allowMarketing: 'no', fullAddress: '24 Ryan Gardens\nFerndown\nBH23 9KL' },
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', shortName: 'Maisie', allowMarketing: 'yes', fullAddress: '30 Ryan Gardens\nFerndown\nBH23 4FG' },
      { id: '9070692f-b12c-4bbc-9888-5704fe5bc480', shortName: 'Dave', allowMarketing: 'no', fullAddress: '11 Arcadia Close\nSalisbury\nGU23 5GH' }
    ]
  })
})

test('Fail to query all documents of type if permissions insufficient.', async () => {
  await expect(queryDocuments({
    ...createTestRequest(),
    roleNames: ['invalid'],
    docTypeName: 'person',
    fieldNames: ['id']
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})

test('Fail to query all document of a type in collection if fetchWholeCollection is not allowed.', async () => {
  await expect(queryDocuments({
    ...createTestRequest(),
    roleNames: ['admin'],
    docTypeName: 'car',
    fieldNames: ['id']
  })).rejects.toThrow(JsonotronActionForbiddenByPolicyError)
})
