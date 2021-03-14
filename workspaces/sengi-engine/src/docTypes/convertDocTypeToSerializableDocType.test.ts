import { expect, test } from '@jest/globals'
import { createCarDocType, createJsonotron, createLessonDocType } from './shared.test'
import { convertDocTypeToSerializableDocType } from './convertDocTypeToSerializableDocType'

test('Convert a slim doc type to a serializable doc type.', () => {
  const carDocType = createCarDocType()
  const jsonotron = createJsonotron()
  const result = convertDocTypeToSerializableDocType(jsonotron, carDocType)
  expect(result).toBeDefined()
})

test('Convert a full doc type to a serializable doc type.', () => {
  const lessonDocType = createLessonDocType()
  const jsonotron = createJsonotron()
  const result = convertDocTypeToSerializableDocType(jsonotron, lessonDocType)
  expect(result).toBeDefined()
})

test('Fail to convert a doc type to a serializable doc type if a field type is not valid.', () => {
  const lessonDocType = createLessonDocType()
  lessonDocType.fields['teacher'].type = 'madeup' 

  const jsonotron = createJsonotron()
  expect(() => convertDocTypeToSerializableDocType(jsonotron, lessonDocType)).toThrow()
})
