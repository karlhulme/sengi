/* eslint-env jest */
const { createTestRequest } = require('./shared.test')
const { JsonotronInsufficientPermissionsError } = require('../errors')
const queryDocumentsByFilter = require('./queryDocumentsByFilter')

test('Query by document filter.', async () => {
  const result = await queryDocumentsByFilter({
    ...createTestRequest(),
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    filterName: 'byPostCode',
    filterParams: {
      postCode: 'BH23 4FG'
    }
  })

  expect(result).toEqual({
    docs: [
      { id: '06151119-065a-4691-a7c8-2d84ec746ba9', fullName: 'Maisie Amillion' }
    ]
  })
})

test('Query by document filter without an onFieldQueried delegate.', async () => {
  await expect(queryDocumentsByFilter({
    ...createTestRequest(),
    onFieldsQueried: null,
    roleNames: ['admin'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    filterName: 'byPostCode',
    filterParams: {
      postCode: 'BH23 4FG'
    }
  })).resolves.not.toThrow()
})

test('Fail to query by document filter if permissions insufficient.', async () => {
  await expect(queryDocumentsByFilter({
    ...createTestRequest(),
    roleNames: ['invalid'],
    docTypeName: 'person',
    fieldNames: ['id', 'fullName'],
    filterName: 'byPostCode',
    filterParams: {
      postCode: 'BH23 4FG'
    }
  })).rejects.toThrow(JsonotronInsufficientPermissionsError)
})
