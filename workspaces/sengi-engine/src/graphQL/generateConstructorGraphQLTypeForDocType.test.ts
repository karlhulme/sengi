import { expect, test } from '@jest/globals'
import { generateConstructorGraphQLTypeForDocType } from './generateConstructorGraphQLTypeForDocType'
import { createJsonotron, createPizzaDocType } from './shared.test'

test('Generate constructor GraphQL type for doc type.', () => {
  const jsonotron = createJsonotron()
  const docType = createPizzaDocType()

  const gql = generateConstructorGraphQLTypeForDocType(jsonotron, docType)
  expect(gql).toEqual(expect.stringContaining('input PizzaConstructorProps {'))
  expect(gql).toEqual(expect.stringContaining('size: String!'))
  expect(gql).toEqual(expect.stringContaining('deliveryInstructions: [String]'))
  expect(gql).toEqual(expect.stringContaining('pizzaName: String'))
  expect(gql).not.toEqual(expect.stringContaining('inventor: String!'))
  expect(gql).toEqual(expect.stringContaining('toppings: [String]'))
  expect(gql).not.toEqual(expect.stringContaining('toppingCount: String'))
  expect(gql).not.toEqual(expect.stringContaining('toppingsInCaps: [String]'))  
})

test('Generate empty constructor GraphQL string for doc type with parameterless constructor.', () => {
  const jsonotron = createJsonotron()
  const docType = createPizzaDocType()
  docType.ctor.parameters = {}
  docType.fields.pizzaName.canUpdate = false
  docType.fields.toppings.canUpdate = false

  const gql = generateConstructorGraphQLTypeForDocType(jsonotron, docType)
  expect(gql).toEqual('')
})
