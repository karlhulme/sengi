import { ensureHeaderJsonAcceptType } from '../requestValidation'
import { applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a request for doc types. 
 * @param props Properties for handling the request.
 */
export async function docTypesHandler (props: RequestHandlerProps): Promise<void> {
  ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

  const docTypes = props.sengi.getDocTypes()

  applyResultToHttpResponse(props.res, {
    json: { docTypes },
    statusCode: 200
  })
}
