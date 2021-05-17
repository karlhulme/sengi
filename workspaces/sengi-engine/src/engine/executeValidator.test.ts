import { expect, test } from '@jest/globals'
import { DocBase, DocRecord, DocType, SengiDocTypeValidateFunctionError } from 'sengi-interfaces'
import { executeValidator } from './executeValidator'
import { asError } from './shared.test'

interface ExampleDoc extends DocBase {
  propA: string
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    validate: (doc: ExampleDoc) => {
      if (doc.propA === 'fail') {
        throw new Error('validation')
      }
    }
  }

  return docType
}

test('Executing a validator against valid data raises no errors.', () => {
  expect(() => executeValidator(createDocType(), {})).not.toThrow()
})

test('Executing a validator function on a doc type that does not define one raises no errors.', () => {
  const docType = createDocType()
  delete docType.validate
  expect(() => executeValidator(docType, {})).not.toThrow()
})

test('Executing a validator function that raises errors will be wrapped.', () => {
  const doc: DocRecord = { propA: 'fail' }
  expect(() => executeValidator(createDocType(), doc)).toThrow(asError(SengiDocTypeValidateFunctionError))
  expect(() => executeValidator(createDocType(), doc)).toThrow(/Error: validation/)
})
