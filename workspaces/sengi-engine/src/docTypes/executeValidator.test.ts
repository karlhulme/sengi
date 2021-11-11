import { expect, test } from '@jest/globals'
import { DocBase, DocRecord, DocType, SengiDocTypeValidateFunctionError } from 'sengi-interfaces'
import { asError } from '../utils'
import { executeValidator } from './executeValidator'

interface ExampleDoc extends DocBase {
  propA: string
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, unknown, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    validate: (doc: ExampleDoc) => {
      if (doc.propA === 'fail') {
        return 'doc-rejected'
      }
    }
  }

  return docType
}

test('Executing a validator against valid data raises no errors.', () => {
  expect(() => executeValidator(createDocType(), {})).not.toThrow()
})

test('Executing a validator on a doc type that does not define a validator function raises no errors.', () => {
  const docType = createDocType()
  delete docType.validate
  expect(() => executeValidator(docType, {})).not.toThrow()
})

test('Executing a validator on a doc type that returns an error will be wrapped in a validation error.', () => {
  const doc: DocRecord = { propA: 'fail' }
  expect(() => executeValidator(createDocType(), doc)).toThrow(asError(SengiDocTypeValidateFunctionError))
  expect(() => executeValidator(createDocType(), doc)).toThrow(/doc-rejected/)
})
