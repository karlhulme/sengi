import { ensureHeaderJsonAcceptType } from '../requestValidation'
import { applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a request for enum types. 
 * @param props Properties for handling the request.
 */
export async function enumTypesHandler (props: RequestHandlerProps): Promise<void> {
  ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

  const enumTypes = props.sengi.getEnumTypes()

  applyResultToHttpResponse(props.res, {
    json: { enumTypes },
    statusCode: 200
  })
}
