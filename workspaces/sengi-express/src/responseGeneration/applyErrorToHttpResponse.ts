import { Request, Response } from 'express'
import { HttpHeaderNames } from '../utils'
import {
  SengiActionForbiddenByPolicyError,
  SengiConflictOnSaveError,
  SengiDocNotFoundError,
  SengiInsufficientPermissionsError,
  SengiRequestError,
  SengiRequiredVersionNotAvailableError,
  SengiUnrecognisedDocTypeNameError,
  SengiUnrecognisedOperationNameError
} from 'sengi-interfaces'
import {
  SengiExpressDocIdNotFoundError,
  SengiExpressRequestError,
  SengiExpressUnrecognisedDocTypePluralNameError,
  SengiExpressUnsupportedRequestContentTypeError,
  SengiExpressUnsupportedResponseContentTypeError
} from '../errors'

const INTERNAL_ERROR_TEXT = 'Internal Error'

interface ErrorForHttpResponseProps {
  err: Error
}

/**
 * Determine the appropriate status code for the given error.
 * @param err An error object.
 */
function determineStatusFromError (err: Error): number {
  if (err instanceof SengiExpressUnsupportedRequestContentTypeError) {
    return 415
  }

  if (err instanceof SengiRequiredVersionNotAvailableError) {
    return 412
  }

  if (err instanceof SengiConflictOnSaveError) {
    return 409
  }

  if (err instanceof SengiExpressUnsupportedResponseContentTypeError) {
    return 406
  }

  if (err instanceof SengiExpressUnrecognisedDocTypePluralNameError ||
    err instanceof SengiExpressDocIdNotFoundError ||
    err instanceof SengiDocNotFoundError ||
    err instanceof SengiUnrecognisedDocTypeNameError ||
    err instanceof SengiUnrecognisedOperationNameError) {
    return 404
  }

  if (err instanceof SengiActionForbiddenByPolicyError ||
    err instanceof SengiInsufficientPermissionsError) {
    return 403
  }

  if (err instanceof SengiRequestError ||
    err instanceof SengiExpressRequestError) {
    return 400
  }

  return 500
}

/**
 * Applies an error to an express response.
 * @param res An express response.
 * @param err An Error object.
 */
export function applyErrorToHttpResponse (req: Request, res: Response, props: ErrorForHttpResponseProps): void {
  const statusCode = determineStatusFromError(props.err)

  res.status(statusCode)

  res.set(HttpHeaderNames.ContentType, 'text/plain')
  res.send(statusCode < 500 ? props.err.message : INTERNAL_ERROR_TEXT)

  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'test') {
    console.log(req.url)
    console.log(req.body)
    console.log(props.err)
  }
}
