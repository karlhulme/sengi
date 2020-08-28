/* eslint-env jest */
const { builtinEnumTypes, builtinFieldTypes } = require('jsonotron-builtin-field-types')
const { builtinFormatValidators } = require('jsonotron-builtin-format-validators')
const { createCustomisedAjv } = require('jsonotron-validation')
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
    propA: { type: 'shortString', isRequired: true, canUpdate: true },
    propB: { type: 'mediumString' }
  },
  calculatedFields: {
    propAandB: {
      inputFields: ['propA', 'propB'],
      value: doc => `${doc.propA || ''}${doc.propB || ''}`
    }
  },
  filters: {
    byDateOfBirth: {
      parameters: {
        x: { type: 'string', isRequired: true }
      },
      implementation: input => `some_col = "${input.x}"`
    }
  },
  validate: doc => null,
  ctor: {
    parameters: {
      c: { type: 'boolean' }
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
      parameters: {
        c: { type: 'string', isRequired: true },
        newPropB: { type: 'mediumString' }
      },
      implementation: (doc, input) => {
        return {
          b: input.c && doc.b ? 'hello' : 'world'
        }
      }
    }
  }
})

test('Initialised validator cache has validators defined for all elements of the doc type.', () => {
  const validatorCache = initValidatorCache(createCustomisedAjv(builtinFormatValidators), [createValidDocType()], builtinFieldTypes, builtinEnumTypes)

  expect(validatorCache).toBeDefined()

  expect(validatorCache.docTypeInstanceValidatorExists('candidateDoc')).toEqual(true)
  expect(validatorCache.docTypeConstructorParamsValidatorExists('candidateDoc')).toEqual(true)
  expect(validatorCache.docTypeFilterParamsValidatorExists('candidateDoc', 'byDateOfBirth')).toEqual(true)
  expect(validatorCache.docTypeMergePatchValidatorExists('candidateDoc')).toEqual(true)
  expect(validatorCache.docTypeOperationParamsValidatorExists('candidateDoc', 'changePropB')).toEqual(true)
})
