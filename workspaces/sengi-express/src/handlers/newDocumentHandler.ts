import { ensureHeaderJsonContentType, ensureDocTypeFromSingularOrPluralName, ensureHeaderRequestId, ensureHeaderApiKey, ensureHeaderUser } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a new document request and produces a response.
 * @param props Properties for handling the request.
 */
export async function newDocumentHandler<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult> (props: RequestHandlerProps<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult>): Promise<void> {
  try {
    ensureHeaderJsonContentType(props.req.headers[HttpHeaderNames.ContentType])

    const docType = ensureDocTypeFromSingularOrPluralName(props.docTypes, props.matchedResource.urlParams['docTypeSingularOrPluralName'])
    const requestId = ensureHeaderRequestId(props.req.body.id || props.serverRequestId, props.req.headers[HttpHeaderNames.RequestId])
    const apiKey = ensureHeaderApiKey(props.req.headers[HttpHeaderNames.ApiKey])
    const user = ensureHeaderUser(props.req.headers[HttpHeaderNames.User])

    const result = await props.sengi.newDocument({
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      id: requestId,
      doc: props.req.body,
      reqProps: props.reqProps,
      apiKey,
      user
    })

    applyResultToHttpResponse(props.res, {
      headers: {
        location: `${props.baseUrl}${props.matchedResource.urlParams.adc}/records/${docType.pluralName}/${requestId}`,
        'sengi-document-operation-type': result.isNew ? 'create' : 'none'
      },
      statusCode: 201
    })
  } catch (err) {
    applyErrorToHttpResponse(props.req, props.res, { err })
  }
}
