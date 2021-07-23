import { ensureHeaderJsonContentType, ensureDocTypeFromSingularOrPluralName, ensureHeaderRequestId, ensureHeaderApiKey } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a create document request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function createDocumentHandler<RequestProps, DocStoreOptions, Filter, Query, QueryResult> (props: RequestHandlerProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult>): Promise<void> {
  try {
    ensureHeaderJsonContentType(props.req.headers[HttpHeaderNames.ContentType])

    const docType = ensureDocTypeFromSingularOrPluralName(props.docTypes, props.matchedResource.urlParams['docTypeSingularOrPluralName'])
    const requestId = ensureHeaderRequestId(props.serverRequestId, props.req.headers[HttpHeaderNames.RequestId])
    const apiKey = ensureHeaderApiKey(props.req.headers[HttpHeaderNames.ApiKey])

    const result = await props.sengi.createDocument({
      constructorName: props.matchedResource.urlParams['constructorName'],
      constructorParams: props.req.body,
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      id: requestId,
      reqProps: props.reqProps,
      apiKey
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
