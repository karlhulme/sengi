import { test, expect } from '@jest/globals'
import { csvStringToArray } from './csvStringToArray'

test('Return an empty array for a non-string.', () => {
  expect(csvStringToArray()).toEqual([])
})

test('Convert a string with a single entry to an array containing a single string.', () => {
  expect(csvStringToArray('hello')).toEqual(['hello'])
})

test('Convert a string with multiple entries to an array containing a multiple strings.', () => {
  expect(csvStringToArray('hello,world,forever')).toEqual(['hello', 'world', 'forever'])
})

test('Convert a string with multiple entries including spaces to an array containing a multiple strings.', () => {
  expect(csvStringToArray('hello ,world, forever')).toEqual(['hello', 'world', 'forever'])
})

test('Convert a string with multiple entries ignoring common escape characters.', () => {
  expect(csvStringToArray('he\\llo,wo"rld,fore\'ver')).toEqual(['he\\llo', 'wo"rld', 'fore\'ver'])
})
