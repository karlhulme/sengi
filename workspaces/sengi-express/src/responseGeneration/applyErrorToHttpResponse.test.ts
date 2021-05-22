import { test, expect, jest } from '@jest/globals'
import { Request, Response } from 'express'
import { SengiActionForbiddenByPolicyError, SengiConflictOnSaveError, SengiCtorParamsValidationFailedError, SengiDocNotFoundError, SengiRequiredVersionNotAvailableError } from 'sengi-interfaces'
import { SengiExpressRequestError, SengiExpressUnsupportedRequestContentTypeError, SengiExpressUnsupportedResponseContentTypeError } from '../errors'
import { applyErrorToHttpResponse } from './applyErrorToHttpResponse'

function createMockReq (): Request {
  return {
    url: 'http://server/path',
    body: 'some content'
  } as unknown as Request
}

function createMockRes (): Response {
  return {
    send: jest.fn(),
    set: jest.fn(),
    status: jest.fn()
  } as unknown as Response
}

test('Apply a internal (unrecognised) error to an http response', () => {
  const req = createMockReq()
  const res = createMockRes()
  applyErrorToHttpResponse(req, res, { err: new Error('secret error') })
  expect(res.status).toHaveProperty('mock.calls.length', 1)
  expect(res.status).toHaveProperty(['mock', 'calls', '0'], [500])
  expect(res.set).toHaveProperty('mock.calls.length', 1)
  expect(res.set).toHaveProperty(['mock', 'calls', '0'], ['content-type', 'text/plain'])
  expect(res.send).toHaveProperty('mock.calls.length', 1)
  expect(res.send).toHaveProperty(['mock', 'calls', '0'], ['Internal Error'])
})

test('Apply a request error to an http response', () => {
  const req = createMockReq()
  const res = createMockRes()
  applyErrorToHttpResponse(req, res, { err: new SengiExpressRequestError('problem') })
  expect(res.status).toHaveProperty('mock.calls.length', 1)
  expect(res.status).toHaveProperty(['mock', 'calls', '0'], [400])
  expect(res.send).toHaveProperty('mock.calls.length', 1)
  expect(res.send).toHaveProperty(['mock', 'calls', '0'], ['problem'])
})

test('Apply an error with detail errors to an http response', () => {
  const req = createMockReq()
  const res = createMockRes()
  applyErrorToHttpResponse(req, res, { err: new SengiCtorParamsValidationFailedError('film', 'makeShort', 'unhappy with format') })
  expect(res.status).toHaveProperty('mock.calls.length', 1)
  expect(res.status).toHaveProperty(['mock', 'calls', '0'], [400])
  expect(res.send).toHaveProperty('mock.calls.length', 1)
  expect(res.send).toHaveProperty(['mock', 'calls', '0'], [expect.stringContaining('The parameters supplied')])
  expect(res.send).toHaveProperty(['mock', 'calls', '0'], [expect.stringContaining('were not valid')])
  expect(res.send).toHaveProperty(['mock', 'calls', '0'], [expect.stringContaining('film')])
  expect(res.send).toHaveProperty(['mock', 'calls', '0'], [expect.stringContaining('makeShort')])
  expect(res.send).toHaveProperty(['mock', 'calls', '0'], [expect.stringContaining('unhappy with format')])
})

test('Apply an unsupported request type error to an http response', () => {
  const req = createMockReq()
  const res = createMockRes()
  applyErrorToHttpResponse(req, res, { err: new SengiExpressUnsupportedRequestContentTypeError('a', 'b') })
  expect(res.status).toHaveProperty('mock.calls.length', 1)
  expect(res.status).toHaveProperty(['mock', 'calls', '0'], [415])
})

test('Apply a required version not available error to an http response', () => {
  const req = createMockReq()
  const res = createMockRes()
  applyErrorToHttpResponse(req, res, { err: new SengiRequiredVersionNotAvailableError() })
  expect(res.status).toHaveProperty('mock.calls.length', 1)
  expect(res.status).toHaveProperty(['mock', 'calls', '0'], [412])
})

test('Apply a conflict on save error to an http response', () => {
  const req = createMockReq()
  const res = createMockRes()
  applyErrorToHttpResponse(req, res, { err: new SengiConflictOnSaveError() })
  expect(res.status).toHaveProperty('mock.calls.length', 1)
  expect(res.status).toHaveProperty(['mock', 'calls', '0'], [409])
})

test('Apply an unsupported content type error to an http response', () => {
  const req = createMockReq()
  const res = createMockRes()
  applyErrorToHttpResponse(req, res, { err: new SengiExpressUnsupportedResponseContentTypeError('a', 'b') })
  expect(res.status).toHaveProperty('mock.calls.length', 1)
  expect(res.status).toHaveProperty(['mock', 'calls', '0'], [406])
})

test('Apply a doc not found error to an http response', () => {
  const req = createMockReq()
  const res = createMockRes()
  applyErrorToHttpResponse(req, res, { err: new SengiDocNotFoundError('film', '1234') })
  expect(res.status).toHaveProperty('mock.calls.length', 1)
  expect(res.status).toHaveProperty(['mock', 'calls', '0'], [404])
})

test('Apply an action forbidden error to an http response', () => {
  const req = createMockReq()
  const res = createMockRes()
  applyErrorToHttpResponse(req, res, { err: new SengiActionForbiddenByPolicyError('film', 'delete') })
  expect(res.status).toHaveProperty('mock.calls.length', 1)
  expect(res.status).toHaveProperty(['mock', 'calls', '0'], [403])
})
