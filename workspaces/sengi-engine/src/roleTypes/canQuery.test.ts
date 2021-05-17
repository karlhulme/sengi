import { expect, test } from '@jest/globals'
import { canQuery } from './canQuery'

test('Check permission set for query permission', () => {
  expect(canQuery({}, 'someQuery')).toEqual(false)
  expect(canQuery({ select: false }, 'someQuery')).toEqual(false)
  expect(canQuery({ select: true }, 'someQuery')).toEqual(true)
  expect(canQuery({ select: { fields: [], fieldsTreatment: 'exclude', queries: [] } }, 'someQuery')).toEqual(false)
  expect(canQuery({ select: { fields: [], fieldsTreatment: 'exclude', queries: ['someQuery'] } }, 'someQuery')).toEqual(true)
})
