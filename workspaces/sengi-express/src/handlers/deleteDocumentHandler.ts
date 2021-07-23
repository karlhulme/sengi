import { ensureDocTypeFromSingularOrPluralName, ensureHeaderApiKey } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a create document request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function deleteDocumentHandler<RequestProps, DocStoreOptions, Filter, Query, QueryResult> (props: RequestHandlerProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult>): Promise<void> {
  try {
    const docType = ensureDocTypeFromSingularOrPluralName(props.docTypes, props.matchedResource.urlParams['docTypeSingularOrPluralName'])
    const apiKey = ensureHeaderApiKey(props.req.headers[HttpHeaderNames.ApiKey])

    const result = await props.sengi.deleteDocument({
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      id: props.matchedResource.urlParams['id'],
      reqProps: props.reqProps,
      apiKey
    })

    applyResultToHttpResponse(props.res, {
      headers: {
        'sengi-document-operation-type': result.isDeleted ? 'delete' : 'none'
      },
      statusCode: 204
    })
  } catch (err) {
    applyErrorToHttpResponse(props.req, props.res, { err })
  }
}
