import { expect, test } from '@jest/globals'
import { SerializableDocType } from 'sengi-interfaces'
import { generateTypedSengiClient } from './generateTypedSengiClient'

test('Produce a strongly typed sengi client.', () => {
  const testDocTypes: SerializableDocType[] = [
    {
      name: 'car',
      pluralName: 'cars',
      title: 'Car',
      pluralTitle: 'Cars',
      summary: 'A car',
      documentation: '',
      fields: {
        make: { type: 'https://jsonotron.org/jss/shortString', documentation: '', graphQlType: '' },
        model: { type: 'https://jsonotron.org/jss/mediumString', documentation: '', graphQlType: '' }
      },
      examples: [],
      calculatedFields: {},
      filters: {},
      aggregates: {},
      ctor: {
        title: '',
        documentation: '',
        examples: [],
        parameters: {}
      },
      operations: {}
    }
  ]

  const script = generateTypedSengiClient(testDocTypes)
  console.log(script)
  expect(script).toMatch(/export class TypedSengiClient/)
})
