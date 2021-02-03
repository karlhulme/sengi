import { ensureHeaderJsonAcceptType } from '../requestValidation'
import { applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a request for a doc type. 
 * @param props Properties for handling the request.
 */
export async function docTypeHandler (props: RequestHandlerProps): Promise<void> {
  ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

  const docTypeName = props.matchedResource.urlParams['docTypeName']

  const docType = props.sengi.getDocType(docTypeName)

  applyResultToHttpResponse(props.res, {
    json: { docType },
    statusCode: 200
  })
}
