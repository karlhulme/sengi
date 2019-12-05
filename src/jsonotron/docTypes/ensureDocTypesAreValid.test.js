/* eslint-env jest */
const builtinFieldTypes = require('../builtinFieldTypes')
const builtinDocTypes = require('../builtinDocTypes')
const { createCustomisedAjv } = require('../jsonValidation')
const ensureDocTypesAreValid = require('./ensureDocTypesAreValid')

const createValidDocType = () => ({
  name: 'candidateDoc',
  pluralName: 'candidateDocs',
  title: 'Candidate Doc',
  pluralTitle: 'Candidate Docs',
  policy: {
    canFetchWholeCollection: true
  },
  fields: {
    propA: { type: 'shortString', isRequired: true, canUpdate: true, description: 'Property A.' },
    propB: { type: 'mediumString', description: 'Property B.' }
  },
  calculatedFields: {
    propAandB: {
      description: 'The combination of prop a and b.',
      inputFields: ['propA', 'propB'],
      value: doc => `${doc.propA || ''}${doc.propB || ''}`
    }
  },
  filters: {
    byDateOfBirth: {
      description: 'Fetch records where propA is equal to \'x\'.',
      parameters: {
        x: { type: 'string', isRequired: true, description: 'The value to match.' }
      },
      implementation: input => `some_col = "${input.x}"`
    }
  },
  validate: doc => null,
  ctor: {
    parameters: {
      propA: { lookup: 'field', isRequired: true },
      c: { type: 'boolean', description: 'Additional prop used only for construction.' }
    },
    implementation: input => {
      return {
        a: input.a,
        b: input.c ? 'hello' : 'world'
      }
    }
  },
  operations: {
    changePropB: {
      title: 'Change Property B',
      description: 'Makes a change to property B.',
      parameters: {
        c: { type: 'string', isRequired: true, description: 'A value that affects the operation.' },
        propB: { lookup: 'field' }
      },
      implementation: (doc, input) => {
        return {
          b: input.c && doc.b ? 'hello' : 'world'
        }
      }
    }
  }
})

test('Valid doc type can be verified.', () => {
  const ajv = createCustomisedAjv()
  expect(() => ensureDocTypesAreValid(ajv, [createValidDocType()], builtinFieldTypes)).not.toThrow()
})

test('Valid doc type does not require a constructor to be verified.', () => {
  const ajv = createCustomisedAjv()
  const candidate = createValidDocType()
  delete candidate.ctor
  expect(() => ensureDocTypesAreValid(ajv, [candidate], builtinFieldTypes)).not.toThrow()
})

test('Valid doc type does not require operations to be verified.', () => {
  const ajv = createCustomisedAjv()
  const candidate = createValidDocType()
  delete candidate.operations
  expect(() => ensureDocTypesAreValid(ajv, [candidate], builtinFieldTypes)).not.toThrow()
})

test('Doc type with missing fields section fails validation.', () => {
  const ajv = createCustomisedAjv()
  const candidate = createValidDocType()
  delete candidate.fields
  expect(() => ensureDocTypesAreValid(ajv, [candidate], builtinFieldTypes)).toThrow(/Unable to validate against docTypeSchema/)
})

test('Doc type with calculated field that refers to erroneous field fails validation.', () => {
  const ajv = createCustomisedAjv()
  const candidate = createValidDocType()
  candidate.calculatedFields.propAandB.inputFields = ['a', 'madeup', 'b']
  expect(() => ensureDocTypesAreValid(ajv, [candidate], builtinFieldTypes)).toThrow(/Calculated field 'propAandB' requires unrecognised input field/)
})

test('Doc type with declared field that is marked as required and has default fails validation.', () => {
  const ajv = createCustomisedAjv()
  const candidate = createValidDocType()
  candidate.fields.propA.default = 'failTest'
  expect(() => ensureDocTypesAreValid(ajv, [candidate], builtinFieldTypes)).toThrow(/cannot be marked as required and supply a default/)
})

test('Doc type with unresolvable lookup constructor parameters fails validation.', () => {
  const ajv = createCustomisedAjv()
  const candidate = createValidDocType()
  candidate.ctor.parameters.invalidParam = { lookup: 'field' }
  expect(() => ensureDocTypesAreValid(ajv, [candidate], builtinFieldTypes)).toThrow(/Constructor parameter 'invalidParam' is a lookup field but/)
})

test('Doc type with a property that clashes with a system property name fails validation.', () => {
  const ajv = createCustomisedAjv()
  const candidate = createValidDocType()
  candidate.fields.id = { type: 'string', description: 'A field that clashes with a system field.' }
  expect(() => ensureDocTypesAreValid(ajv, [candidate], builtinFieldTypes)).toThrow(/clash with a reserved system field name/)
})

test('Doc type with unresolvable lookup operation parameters fails validation.', () => {
  const ajv = createCustomisedAjv()
  const candidate = createValidDocType()
  candidate.operations.changePropB.parameters.invalidParam = { lookup: 'field' }
  expect(() => ensureDocTypesAreValid(ajv, [candidate], builtinFieldTypes)).toThrow(/Operation 'changePropB' states parameter 'invalidParam' is a lookup field but/)
})

test('All built-in doc types are valid.', () => {
  const ajv = createCustomisedAjv()
  expect(ensureDocTypesAreValid(ajv, builtinDocTypes, builtinFieldTypes)).toBeUndefined()
})
