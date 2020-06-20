/* eslint-env jest */
const combineCustomAndBuiltinFormatValidators = require('./combineCustomAndBuiltinFormatValidators')

test('Custom types can override built-in format validators.', () => {
  const builtin = [
    { name: 'A', validate: () => true },
    { name: 'B', validate: () => true },
    { name: 'C', validate: () => true }
  ]

  const custom = [
    { name: 'A', validate: () => true, isCustom: true },
    { name: 'D', validate: () => true },
    { name: 'E', validate: () => true }
  ]

  expect(combineCustomAndBuiltinFormatValidators(custom, builtin)).toEqual([
    expect.objectContaining({ name: 'A', isCustom: true }),
    expect.objectContaining({ name: 'D' }),
    expect.objectContaining({ name: 'E' }),
    expect.objectContaining({ name: 'B' }),
    expect.objectContaining({ name: 'C' })
  ])
})
