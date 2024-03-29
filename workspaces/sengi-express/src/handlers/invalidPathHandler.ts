import { applyResultToHttpResponse } from '../responseGeneration'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a request for an invalid or unrecognised path.
 * @param props Properties for handling the request.
 */
export async function invalidPathHandler<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult> (props: RequestHandlerProps<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult>): Promise<void> {
  applyResultToHttpResponse(props.res, {
    statusCode: 404,
    text: 'Requested path does not point to a recognised resource.'
  })
}
