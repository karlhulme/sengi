import { expect, test } from '@jest/globals'
import { generateOperationGraphQLTypeForDocType } from './generateOperationGraphQLTypeForDocType'
import { createJsonotron, createPizzaDocType } from './shared.test'

test('Generate operation GraphQL type for operation on doc type.', () => {
  const jsonotron = createJsonotron()
  const docType = createPizzaDocType()

  const gql = generateOperationGraphQLTypeForDocType(jsonotron, docType, 'addTopping')
  expect(gql).toEqual(expect.stringContaining('input PizzaAddToppingProps {'))
  expect(gql).toEqual(expect.stringContaining('toppingName: String'))
  expect(gql).toEqual(expect.stringContaining('quantity: [String]'))
})

test('Generate empty GraphQL string for unknown operation on doc type.', () => {
  const jsonotron = createJsonotron()
  const docType = createPizzaDocType()

  const gql = generateOperationGraphQLTypeForDocType(jsonotron, docType, 'unknown')
  expect(gql).toEqual('')
})

test('Generate empty GraphQL string for operation with no parameters.', () => {
  const jsonotron = createJsonotron()
  const docType = createPizzaDocType()
  docType.operations.addTopping.parameters = {}

  const gql = generateOperationGraphQLTypeForDocType(jsonotron, docType, 'addTopping')
  expect(gql).toEqual('')
})
