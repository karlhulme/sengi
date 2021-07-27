import { ensureHeaderJsonAcceptType, ensureDocTypeFromSingularOrPluralName, ensureHeaderApiKey, ensureQueryFieldNames, ensureQueryLimit, ensureQueryOffset, ensureHeaderUser } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a select all documents request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function selectAllDocumentsHandler<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult> (props: RequestHandlerProps<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult>): Promise<void> {
  try {
    ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

    const docType = ensureDocTypeFromSingularOrPluralName(props.docTypes, props.matchedResource.urlParams['docTypeSingularOrPluralName'])
    const fieldNames = ensureQueryFieldNames(props.req.query.fields)
    const apiKey = ensureHeaderApiKey(props.req.headers[HttpHeaderNames.ApiKey])
    const user = ensureHeaderUser(props.req.headers[HttpHeaderNames.User])
    const limit = ensureQueryLimit(props.req.query.limit)
    const offset = ensureQueryOffset(props.req.query.offset)

    const result = await props.sengi.selectDocuments({
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      fieldNames,
      limit,
      offset,
      reqProps: props.reqProps,
      apiKey,
      user
    })

    applyResultToHttpResponse(props.res, {
      headers: {
        'sengi-document-operation-type': 'read'
      },
      json: { docs: result.docs },
      statusCode: 200
    })
  } catch (err) {
    applyErrorToHttpResponse(props.req, props.res, { err })
  }
}
