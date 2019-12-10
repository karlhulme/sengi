/* eslint-env jest */
const combineCustomAndBuiltInFieldTypes = require('./combineCustomAndBuiltInFieldTypes')

test('Custom types can override built-in types.', () => {
  const builtin = [
    { name: 'A', detail: 'aaa' },
    { name: 'B', detail: 'bbb' },
    { name: 'C', detail: 'ccc' }
  ]

  const custom = [
    { name: 'A', detail: 'aaaaaa' },
    { name: 'D', detail: 'dddddd' },
    { name: 'E', detail: 'eeeeee' }
  ]

  expect(combineCustomAndBuiltInFieldTypes(custom, builtin)).toEqual([
    { name: 'A', detail: 'aaaaaa' },
    { name: 'D', detail: 'dddddd' },
    { name: 'E', detail: 'eeeeee' },
    { name: 'B', detail: 'bbb' },
    { name: 'C', detail: 'ccc' }
  ])
})
