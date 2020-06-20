/* eslint-env jest */
const { builtinFieldTypes } = require('jsonotron-fields')
const createCustomisedAjv = require('./createCustomisedAjv')
const initValidatorCache = require('./initValidatorCache')

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

test('Initialised validator cache has field type value validators defined.', () => {
  const validatorCache = initValidatorCache(createCustomisedAjv(), [createValidDocType()], builtinFieldTypes)

  expect(validatorCache).toBeDefined()

  expect(validatorCache.fieldTypeValueValidatorExists('shortString'))
  expect(validatorCache.fieldTypeValueValidatorExists('integer'))
  expect(validatorCache.fieldTypeValueValidatorExists('paymentCardNo'))
  expect(validatorCache.fieldTypeValueValidatorExists('timeZone'))

  expect(validatorCache.docTypeConstructorParamsValidatorExists('candidateDoc'))
  expect(validatorCache.docTypeFieldsValidatorExists('candidateDoc'))
  expect(validatorCache.docTypeFilterParamsValidatorExists('candidateDoc', 'byDateOfBirth'))
  expect(validatorCache.docTypeMergePatchValidatorExists('candidateDoc'))
  expect(validatorCache.docTypeOperationParamsValidatorExists('candidateDoc', 'changePropB'))
})
