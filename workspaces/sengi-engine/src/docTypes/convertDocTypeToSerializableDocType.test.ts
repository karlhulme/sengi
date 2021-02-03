import { expect, test } from '@jest/globals'
import { createCarDocType, createLessonDocType } from './shared.test'
import { convertDocTypeToSerializableDocType } from './convertDocTypeToSerializableDocType'

test('Convert a slim doc type to a serializable doc type.', () => {
  const carDocType = createCarDocType()
  const result = convertDocTypeToSerializableDocType(carDocType)
  expect(result).toBeDefined()
})

test('Convert a full doc type to a serializable doc type.', () => {
  const lessonDocType = createLessonDocType()
  const result = convertDocTypeToSerializableDocType(lessonDocType)
  expect(result).toBeDefined()
})
