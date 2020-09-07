/* eslint-env jest */
const {
  JsonotronConstructorParamsValidationError,
  JsonotronDocumentFieldsValidationError,
  JsonotronEnumValueValidationError,
  JsonotronFieldValueValidationError,
  JsonotronFilterParamsValidationError,
  JsonotronMergePatchValidationError,
  JsonotronOperationParamsValidationError
} = require('jsonotron-errors')
const ValidatorCache = require('./ValidatorCache')

test('Validator cache can store, retrieve and execute enum type value validators.', () => {
  const validatorCache = new ValidatorCache()

  expect(() => validatorCache.getEnumTypeValueValidator('madeup')).toThrow()
  expect(validatorCache.enumTypeValueValidatorExists('fieldA')).toEqual(false)

  const validator = b => b
  validator.errors = ['errors_here']

  validatorCache.addEnumTypeValueValidator('fieldA', validator)
  expect(validatorCache.enumTypeValueValidatorExists('fieldA')).toEqual(true)
  expect(validatorCache.getEnumTypeValueValidator('fieldA')).toEqual(validator)
  expect(() => validatorCache.ensureEnumTypeValue('fieldA', true)).not.toThrow()
  expect(() => validatorCache.ensureEnumTypeValue('fieldA', false)).toThrow(JsonotronEnumValueValidationError)
})

test('Validator cache can store, retrieve and execute field type value validators.', () => {
  const validatorCache = new ValidatorCache()

  expect(() => validatorCache.getFieldTypeValueValidator('madeup')).toThrow()
  expect(validatorCache.fieldTypeValueValidatorExists('fieldA')).toEqual(false)

  const validator = b => b
  validator.errors = ['errors_here']

  validatorCache.addFieldTypeValueValidator('fieldA', validator)
  expect(validatorCache.fieldTypeValueValidatorExists('fieldA')).toEqual(true)
  expect(validatorCache.getFieldTypeValueValidator('fieldA')).toEqual(validator)
  expect(() => validatorCache.ensureFieldTypeValue('fieldA', true)).not.toThrow()
  expect(() => validatorCache.ensureFieldTypeValue('fieldA', false)).toThrow(JsonotronFieldValueValidationError)
})

test('Validator cache can store, retrieve and execute doc type field validators.', () => {
  const validatorCache = new ValidatorCache()

  expect(() => validatorCache.getDocTypeInstanceValidator('madeup')).toThrow()
  expect(validatorCache.docTypeInstanceValidatorExists('docA')).toEqual(false)

  const validator = doc => doc.value
  validator.errors = ['errors_here']

  validatorCache.addDocTypeInstanceValidator('docA', validator)
  expect(validatorCache.docTypeInstanceValidatorExists('docA')).toEqual(true)
  expect(validatorCache.getDocTypeInstanceValidator('docA')).toEqual(validator)
  expect(() => validatorCache.ensureDocTypeInstance('docA', { value: true })).not.toThrow()
  expect(() => validatorCache.ensureDocTypeInstance('docA', { value: false })).toThrow(JsonotronDocumentFieldsValidationError)
})

test('Validator cache can store, retrieve and execute doc type filter param validators.', () => {
  const validatorCache = new ValidatorCache()

  expect(() => validatorCache.getDocTypeFilterParamsValidator('madeup')).toThrow()
  expect(validatorCache.docTypeFilterParamsValidatorExists('docA', 'filterB')).toEqual(false)

  const validator = input => input.value
  validator.errors = ['errors_here']

  validatorCache.addDocTypeFilterParamsValidator('docA', 'filterB', validator)
  expect(validatorCache.docTypeFilterParamsValidatorExists('docA', 'filterB')).toEqual(true)
  expect(validatorCache.getDocTypeFilterParamsValidator('docA', 'filterB')).toEqual(validator)
  expect(() => validatorCache.ensureDocTypeFilterParams('docA', 'filterB', { value: true })).not.toThrow()
  expect(() => validatorCache.ensureDocTypeFilterParams('docA', 'filterB', { value: false })).toThrow(JsonotronFilterParamsValidationError)
})

test('Validator cache can store, retrieve and execute doc type constructor param validators.', () => {
  const validatorCache = new ValidatorCache()

  expect(() => validatorCache.getDocTypeConstructorParamsValidator('madeup')).toThrow()
  expect(validatorCache.docTypeConstructorParamsValidatorExists('docA')).toEqual(false)

  const validator = input => input.value
  validator.errors = ['errors_here']

  validatorCache.addDocTypeConstructorParamsValidator('docA', validator)
  expect(validatorCache.docTypeConstructorParamsValidatorExists('docA')).toEqual(true)
  expect(validatorCache.getDocTypeConstructorParamsValidator('docA')).toEqual(validator)
  expect(() => validatorCache.ensureDocTypeConstructorParams('docA', { value: true })).not.toThrow()
  expect(() => validatorCache.ensureDocTypeConstructorParams('docA', { value: false })).toThrow(JsonotronConstructorParamsValidationError)
})

test('Validator cache can store, retrieve and execute doc type operation param validators.', () => {
  const validatorCache = new ValidatorCache()

  expect(() => validatorCache.getDocTypeOperationParamsValidator('madeup')).toThrow()
  expect(validatorCache.docTypeOperationParamsValidatorExists('docA', 'operationC')).toEqual(false)

  const validator = input => input.value
  validator.errors = ['errors_here']

  validatorCache.addDocTypeOperationParamsValidator('docA', 'operationC', validator)
  expect(validatorCache.docTypeOperationParamsValidatorExists('docA', 'operationC')).toEqual(true)
  expect(validatorCache.getDocTypeOperationParamsValidator('docA', 'operationC')).toEqual(validator)
  expect(() => validatorCache.ensureDocTypeOperationParams('docA', 'operationC', { value: true })).not.toThrow()
  expect(() => validatorCache.ensureDocTypeOperationParams('docA', 'operationC', { value: false })).toThrow(JsonotronOperationParamsValidationError)
})

test('Validator cache can store, retrieve and execute doc type merge patch validators.', () => {
  const validatorCache = new ValidatorCache()

  expect(() => validatorCache.getDocTypeMergePatchValidator('madeup')).toThrow()
  expect(validatorCache.docTypeMergePatchValidatorExists('docA')).toEqual(false)

  const validator = input => input.value
  validator.errors = ['errors_here']

  validatorCache.addDocTypeMergePatchValidator('docA', validator)
  expect(validatorCache.docTypeMergePatchValidatorExists('docA')).toEqual(true)
  expect(validatorCache.getDocTypeMergePatchValidator('docA')).toEqual(validator)
  expect(() => validatorCache.ensureDocTypeMergePatch('docA', { value: true })).not.toThrow()
  expect(() => validatorCache.ensureDocTypeMergePatch('docA', { value: false })).toThrow(JsonotronMergePatchValidationError)
})
