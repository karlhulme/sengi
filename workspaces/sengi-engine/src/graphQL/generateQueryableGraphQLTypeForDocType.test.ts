import { expect, test } from '@jest/globals'
import { generateQueryableGraphQLTypeForDocType } from './generateQueryableGraphQLTypeForDocType'
import { createAdminRoleType, createJsonotron, createLimitedRoleType, createPizzaDocType } from './shared.test'

test('Generate queryable GraphQL type for doc type for admin role.', () => {
  const jsonotron = createJsonotron()
  const docType = createPizzaDocType()
  const roleTypes = [
    createAdminRoleType(),
    Object.assign(createAdminRoleType(), { docPermissions: { pizza: true } }),
    Object.assign(createAdminRoleType(), { docPermissions: { pizza: { query: true } } })
  ]

  for (const roleType of roleTypes) {
    const gql = generateQueryableGraphQLTypeForDocType(jsonotron, docType, [roleType], '')
    expect(gql).toEqual(expect.stringContaining('type Pizza {'))

    expect(gql).toEqual(expect.stringContaining('id: String!'))
    expect(gql).toEqual(expect.stringContaining('docType: String!'))
    expect(gql).toEqual(expect.stringContaining('docOps: [String]!'))
    expect(gql).toEqual(expect.stringContaining('docVersion: String!'))

    expect(gql).toEqual(expect.stringContaining('pizzaName: String!'))
    expect(gql).toEqual(expect.stringContaining('inventor: String!'))
    expect(gql).toEqual(expect.stringContaining('toppings: [String]'))
    expect(gql).toEqual(expect.stringContaining('toppingCount: String'))
    expect(gql).toEqual(expect.stringContaining('toppingsInCaps: [String]'))  
  }
})

test('Generate queryable GraphQL type for doc type for whitelisted role.', () => {
  const jsonotron = createJsonotron()
  const docType = createPizzaDocType()
  const roleTypes = [
    createLimitedRoleType(),
    Object.assign(createLimitedRoleType(), { docPermissions: { pizza: { query: { fieldsTreatment: 'blacklist', fields: ['inventor', 'toppings', 'toppingCount', 'toppingsInCaps'] } } } })
  ]

  for (const roleType of roleTypes) {
    const gql = generateQueryableGraphQLTypeForDocType(jsonotron, docType, [roleType], 'Limited')
    expect(gql).toEqual(expect.stringContaining('type PizzaLimited {'))

    expect(gql).toEqual(expect.stringContaining('id: String!'))
    expect(gql).toEqual(expect.stringContaining('docType: String!'))
    expect(gql).toEqual(expect.stringContaining('docOps: [String]!'))
    expect(gql).toEqual(expect.stringContaining('docVersion: String!'))

    expect(gql).toEqual(expect.stringContaining('pizzaName: String!'))
    expect(gql).not.toEqual(expect.stringContaining('inventor: String!'))
    expect(gql).not.toEqual(expect.stringContaining('toppings: [String]'))
    expect(gql).not.toEqual(expect.stringContaining('toppingCount: String'))
    expect(gql).not.toEqual(expect.stringContaining('toppingsInCaps: [String]'))
  }
})

test('Generate empty GraphQL string for doc type for no accessible fields.', () => {
  const jsonotron = createJsonotron()
  const docType = createPizzaDocType()
  const roleTypes = [
    Object.assign(createAdminRoleType(), { docPermissions: false }),
    Object.assign(createLimitedRoleType(), { docPermissions: { pizza: { query: false } } })
  ]

  for (const roleType of roleTypes) {
    const gql = generateQueryableGraphQLTypeForDocType(jsonotron, docType, [roleType], 'Limited')
    expect(gql).toEqual('')
  }
})
