import { expect, test } from '@jest/globals'
import { DocBase, DocType, DocTypeOperation, DocTypeQuery, SengiAuthorisationFailedError } from 'sengi-interfaces'
import { asError } from '../utils'
import {
  ensureDocTypeCreateRequestAuthorised,
  ensureDocTypeDeleteRequestAuthorised,
  ensureDocTypePatchRequestAuthorised,
  ensureDocTypeQueryRequestAuthorised,
  ensureDocTypeReadRequestAuthorised,
  ensureDocTypeOperationRequestAuthorised
} from './ensureDocTypeRequestAuthorised'

interface ExampleDoc extends DocBase {
  propA: string
}

function createDocType () {
  const docType: DocType<ExampleDoc, unknown, unknown, unknown, unknown, unknown> = {
    name: 'test',
    pluralName: 'tests',
    jsonSchema: {},
    queries: {
      testQuery: {
        parametersJsonSchema: {},
        responseJsonSchema: {},
        coerce: () => ({ }),
        parse: () => ({ }),
        authorise: props => {
          if (props.parameters.foo === 'private') {
            return 'something'
          }
        }
      }
    },
    operations: {
      testOperation: {
        parametersJsonSchema: {},
        implementation: () => undefined,
        authorise: props => {
          if (props.originalDoc.propA === 'private') {
            return 'OpDenied'
          }
        }
      }
    },
    authoriseCreate: props => {
      if (props.newDoc.propA === 'private') {
        return 'ReadDenied'
      }
    },
    authoriseDelete: props => {
      if (props.doc.propA === 'private') {
        return 'CreateDenied'
      }
    },
    authorisePatch: props => {
      if (props.originalDoc.propA === 'private') {
        return 'PatchDenied'
      }
    },
    authoriseRead: props => {
      if (props.fieldNames.includes('private')) {
        return 'ReadDenied'
      }
    }
  }

  return docType
}

test('Silent return if auth method is not defined.', () => {
  const docType = createDocType()

  delete docType.operations?.testOperation.authorise
  delete docType.queries?.testQuery.authorise
  delete docType.authoriseCreate
  delete docType.authoriseDelete
  delete docType.authorisePatch
  delete docType.authoriseRead

  expect(() => ensureDocTypeCreateRequestAuthorised(docType, { user: {}, newDoc: {}, requestType: 'create' })).not.toThrow()
  expect(() => ensureDocTypeDeleteRequestAuthorised(docType, { user: {}, doc: {} })).not.toThrow()
  expect(() => ensureDocTypePatchRequestAuthorised(docType, { user: {}, fieldNames: [], originalDoc: {}, patch: {} })).not.toThrow()
  expect(() => ensureDocTypeReadRequestAuthorised(docType, { user: {}, fieldNames: [], doc: {}, requestType: 'selectByFilter' })).not.toThrow()
  expect(() => ensureDocTypeQueryRequestAuthorised(docType, docType.queries?.testQuery as DocTypeQuery<unknown, unknown, unknown, unknown, unknown>, { user: {}, parameters: {} })).not.toThrow()
  expect(() => ensureDocTypeOperationRequestAuthorised(docType, docType.operations?.testOperation as DocTypeOperation<unknown, unknown, unknown>, { user: {}, parameters: {}, originalDoc: {} })).not.toThrow()
})

test('Silent return if auth method returns void.', () => {
  const docType = createDocType()
  expect(() => ensureDocTypeCreateRequestAuthorised(docType, { user: {}, newDoc: {}, requestType: 'create' })).not.toThrow()
  expect(() => ensureDocTypeDeleteRequestAuthorised(docType, { user: {}, doc: {} })).not.toThrow()
  expect(() => ensureDocTypePatchRequestAuthorised(docType, { user: {}, fieldNames: [], originalDoc: {}, patch: {} })).not.toThrow()
  expect(() => ensureDocTypeReadRequestAuthorised(docType, { user: {}, fieldNames: [], doc: {}, requestType: 'selectByFilter' })).not.toThrow()
  expect(() => ensureDocTypeQueryRequestAuthorised(docType, docType.queries?.testQuery as DocTypeQuery<unknown, unknown, unknown, unknown, unknown>, { user: {}, parameters: {} })).not.toThrow()
  expect(() => ensureDocTypeOperationRequestAuthorised(docType, docType.operations?.testOperation as DocTypeOperation<unknown, unknown, unknown>, { user: {}, parameters: {}, originalDoc: {} })).not.toThrow()
})

test('Raise error if auth method returns a string.', () => {

  const docType = createDocType()
  expect(() => ensureDocTypeCreateRequestAuthorised(docType, { user: {}, newDoc: { propA: 'private' }, requestType: 'create' })).toThrow(asError(SengiAuthorisationFailedError))
  expect(() => ensureDocTypeDeleteRequestAuthorised(docType, { user: {}, doc: { propA: 'private' } })).toThrow(asError(SengiAuthorisationFailedError))
  expect(() => ensureDocTypePatchRequestAuthorised(docType, { user: {}, fieldNames: [], originalDoc: { propA: 'private' }, patch: {} })).toThrow(asError(SengiAuthorisationFailedError))
  expect(() => ensureDocTypeReadRequestAuthorised(docType, { user: {}, fieldNames: ['private'], doc: {}, requestType: 'selectByFilter' })).toThrow(asError(SengiAuthorisationFailedError))
  expect(() => ensureDocTypeQueryRequestAuthorised(docType, docType.queries?.testQuery as DocTypeQuery<unknown, unknown, unknown, unknown, unknown>, { user: {}, parameters: { foo: 'private' } })).toThrow(asError(SengiAuthorisationFailedError))
  expect(() => ensureDocTypeOperationRequestAuthorised(docType, docType.operations?.testOperation as DocTypeOperation<unknown, unknown, unknown>, { user: {}, parameters: {}, originalDoc: { propA: 'private' } })).toThrow(asError(SengiAuthorisationFailedError))
})

