import { test, expect } from '@jest/globals'
import { createSengiWithMockStore } from './shared.test'

test('Fetch the graph ql definition.', async () => {
  const { sengi } = createSengiWithMockStore()
  const gql = sengi.getDocTypeAsGraphQL({ docTypeName: 'person', roleTypeSets: [{ roleTypeNames: ['admin'], suffix: '' }] })
  expect(gql).toBeDefined()
  expect(gql).toEqual(expect.stringContaining('type Person {'))
  expect(gql).toEqual(expect.stringContaining('input PersonConstructorProps {'))
  expect(gql).toEqual(expect.stringContaining('input PersonPatchProps {'))
  expect(gql).toEqual(expect.stringContaining('input PersonReplaceFavouriteColorsProps {'))
  expect(gql).not.toEqual(expect.stringContaining('input PersonAttemptToChangeIdProps {'))
})
