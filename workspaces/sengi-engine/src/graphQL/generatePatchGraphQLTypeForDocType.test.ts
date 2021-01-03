import { expect, test } from '@jest/globals'
import { generatePatchGraphQLTypeForDocType } from './generatePatchGraphQLTypeForDocType'
import { createJsonotron, createPizzaDocType } from './shared.test'

test('Generate patch GraphQL type for doc type.', () => {
  const jsonotron = createJsonotron()
  const docType = createPizzaDocType()

  const gql = generatePatchGraphQLTypeForDocType(jsonotron, docType)
  expect(gql).toEqual(expect.stringContaining('input PizzaPatchProps {'))
  expect(gql).toEqual(expect.stringContaining('pizzaName: String'))
  expect(gql).not.toEqual(expect.stringContaining('inventor: String!'))
  expect(gql).toEqual(expect.stringContaining('toppings: [String]'))
  expect(gql).not.toEqual(expect.stringContaining('toppingCount: String'))
  expect(gql).not.toEqual(expect.stringContaining('toppingsInCaps: [String]'))  
})

test('Generate empty GraphQL string for doc type with no fields.', () => {
  const jsonotron = createJsonotron()
  const docType = createPizzaDocType()
  docType.fields.pizzaName.canUpdate = false
  docType.fields.toppings.canUpdate = false

  const gql = generatePatchGraphQLTypeForDocType(jsonotron, docType)
  expect(gql).toEqual('')
})
