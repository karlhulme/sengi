import { ensureHeaderJsonAcceptType, ensureDocTypeFromSingularOrPluralName, ensureHeaderApiKey, ensureQueryQueryName, ensureQueryQueryParams } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a query documents request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function queryDocumentsHandler<RequestProps, DocStoreOptions, Filter, Query, QueryResult> (props: RequestHandlerProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult>): Promise<void> {
  try {
    ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

    const docType = ensureDocTypeFromSingularOrPluralName(props.docTypes, props.matchedResource.urlParams['docTypeSingularOrPluralName'])
    const apiKey = ensureHeaderApiKey(props.req.headers[HttpHeaderNames.ApiKey])

    const result = await props.sengi.queryDocuments({
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      queryName: ensureQueryQueryName(props.req.query.queryName),
      queryParams: ensureQueryQueryParams(props.req.query.queryParams),
      reqProps: props.reqProps,
      apiKey
    })

    applyResultToHttpResponse(props.res, {
      headers: {
        'sengi-document-operation-type': 'read'
      },
      json: { data: result.data },
      statusCode: 200
    })
  } catch (err) {
    applyErrorToHttpResponse(props.req, props.res, { err })
  }
}
