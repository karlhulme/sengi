import { expect, test } from '@jest/globals'
import { Jsonotron } from 'jsonotron-js'
import { DocType, RoleType } from 'sengi-interfaces'

const shortStringType = `---
kind: schema
domain: https://jsonotron.org
system: jss
name: shortString
title: Short String
documentation: A string of 20 characters or less.  An empty string is valid.
examples:
- value: A terse string
  documentation: A short text string.
validTestCases:
- my short string
invalidTestCases:
- 123
jsonSchema:
  type: string
  maxLength: 20
`

export function createJsonotron (): Jsonotron {
  return new Jsonotron({
    types: [shortStringType]
  })
}

export function createPizzaDocType (): DocType {
  return {
    name: 'pizza',
    title: 'Pizza',
    pluralName: 'pizza',
    pluralTitle: 'Pizzas',
    summary: 'A pizza',
    documentation: 'This is a pizza document type.',

    fields: {
      pizzaName: { type: 'shortString', isRequired: true, canUpdate: true, documentation: 'The name of the pizza.' },
      inventor: { type: 'shortString', isRequired: true, documentation: 'The name of the inventor.' },
      toppings: { type: 'https://jsonotron.org/jss/shortString', isArray: true, canUpdate: true, documentation: 'The toppings on the pizza.' }
    },
    examples: [],

    aggregates: {},
    calculatedFields: {
      toppingCount: {
        type: 'shortString',
        documentation: 'My topping count',
        inputFields: ['toppings'],
        value: inputs => (inputs.toppings as []).length.toString()
      },
      toppingsInCaps: {
        type: 'shortString',
        isArray: true,
        documentation: 'All toppings but in capitals',
        inputFields: ['toppings'],
        value: inputs => (inputs.toppings as string[]).map(t => t.toUpperCase())
      }
    },
    ctor: {
      title: 'New pizza',
      documentation: 'Create a new pizza',
      parameters: {
        size: { type: 'shortString', isArray: false, documentation: 'The size of the pizza', isRequired: true },
        deliveryInstructions: { type: 'shortString', isArray: true, documentation: 'The delivery instructions.' }
      },
      examples: [],
      implementation: () => ({})
    },
    filters: {},
    operations: {
      addTopping: {
        title: 'Add Topping',
        documentation: 'Add a new topping to the pizza.',
        examples: [],
        parameters: {
          toppingName: { type: 'shortString', documentation: 'The name of a topping', isRequired: true },
          quantity: { type: 'shortString', documentation: 'The quantity of toppings to add.', isArray: true }
        },
        implementation: () => ({})
      }
    },
    docStoreOptions: {},
    policy: {
      canDeleteDocuments: true,
      canFetchWholeCollection: true,
      canReplaceDocuments: true,
      maxOpsSize: 3
    }
  }
}

export function createAdminRoleType(): RoleType {
  return {
    name: 'admin',
    documentation: 'The admin account',
    title: 'Admin',
    docPermissions: true
  }
}

export function createLimitedRoleType(): RoleType {
  return {
    name: 'limited',
    documentation: 'The limited account',
    title: 'Limited',
    docPermissions: {
      pizza: {
        query: {
          fieldsTreatment: 'whitelist',
          fields: ['pizzaName']
        }
      }
    }
  }
}

test('Prevent warnings about no tests found in file.', () => {
  expect(typeof createPizzaDocType()).toEqual('object')
})
