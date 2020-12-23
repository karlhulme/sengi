import { expect, test } from '@jest/globals'
import { RequestInit, Response } from 'node-fetch'
import { FetchFunc, SengiClient } from '../src'

export function createClient (fetch?: FetchFunc, retryIntervals?: number[]): SengiClient {
  return new SengiClient({
    fetch: fetch || createErrorFetchFunc(200, 'not used'),
    retryIntervals: retryIntervals || [100, 200],
    roleNames: ['general'],
    url: 'http://test.com'
  })
}

export function createErrorFetchFunc (status: number, text: string): (url: string, init: RequestInit) => Promise<Response> {
  return async () => {
    return {
      status,
      text: async () => text
    } as Response
  }
}

test('Prevent warning about no exported tests.', async () => {
  expect(typeof createClient).toEqual('function')
})
