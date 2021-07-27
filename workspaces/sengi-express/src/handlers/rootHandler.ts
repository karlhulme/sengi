import { applyResultToHttpResponse } from '../responseGeneration'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a request on the mount point.
 */
export async function rootHandler<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult> (props: RequestHandlerProps<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult>): Promise<void> {
  applyResultToHttpResponse(props.res, {
    statusCode: 200,
    html: `
      <html>
        <body>
          The service is running.
        </body>
      </html>
    `
  })
}
