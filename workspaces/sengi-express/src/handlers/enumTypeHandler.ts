import { ensureHeaderJsonAcceptType } from '../requestValidation'
import { applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a request for an enum type. 
 * @param props Properties for handling the request.
 */
export async function enumTypeHandler (props: RequestHandlerProps): Promise<void> {
  ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

  const enumTypeDecodedFqn = decodeURIComponent(props.matchedResource.urlParams['enumTypeEncodedFqn'])

  const enumType = props.sengi.getEnumType(enumTypeDecodedFqn)

  if (enumType) {
    applyResultToHttpResponse(props.res, {
      json: { enumType },
      statusCode: 200
    })
  } else {
    applyResultToHttpResponse(props.res, {
      statusCode: 404,
      text: `Enum type '${enumTypeDecodedFqn}' was not found.`
    })
  }
}
