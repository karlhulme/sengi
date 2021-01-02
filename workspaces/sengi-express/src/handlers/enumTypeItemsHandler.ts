import { ensureHeaderJsonAcceptType } from '../requestValidation'
import { applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a request for enum type items. 
 * @param props Properties for handling the request.
 */
export async function enumTypeItemsHandler (props: RequestHandlerProps): Promise<void> {
  ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

  const enumTypeDecodedFqn = decodeURIComponent(props.matchedResource.urlParams['enumTypeEncodedFqn'])

  const enumTypeItems = props.sengi.getEnumTypeItems(enumTypeDecodedFqn)

  if (Array.isArray(enumTypeItems)) {
    applyResultToHttpResponse(props.res, {
      json: { items: enumTypeItems },
      statusCode: 200
    })
  } else {
    applyResultToHttpResponse(props.res, {
      statusCode: 404,
      text: `Enum type '${enumTypeDecodedFqn}' was not found.`
    })
  }
}
