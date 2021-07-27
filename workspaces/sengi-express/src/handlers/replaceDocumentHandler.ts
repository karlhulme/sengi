import { DocRecord } from 'sengi-interfaces'
import { ensureHeaderJsonContentType, ensureDocTypeFromSingularOrPluralName, ensureHeaderApiKey, ensureDocIdConsistency, ensureHeaderUser } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a replace document request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function replaceDocumentHandler<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult> (props: RequestHandlerProps<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult>): Promise<void> {
  try {
    ensureHeaderJsonContentType(props.req.headers[HttpHeaderNames.ContentType])
    ensureDocIdConsistency(props.req.body.id, props.matchedResource.urlParams['id'])

    const docType = ensureDocTypeFromSingularOrPluralName(props.docTypes, props.matchedResource.urlParams['docTypeSingularOrPluralName'])
    const apiKey = ensureHeaderApiKey(props.req.headers[HttpHeaderNames.ApiKey])
    const user = ensureHeaderUser(props.req.headers[HttpHeaderNames.User])

    const result = await props.sengi.replaceDocument({
      doc: props.req.body as DocRecord,
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      reqProps: props.reqProps,
      apiKey,
      user
    })

    applyResultToHttpResponse(props.res, {
      headers: {
        location: `${props.baseUrl}${props.matchedResource.urlParams.adc}/records/${docType.pluralName}/${props.req.body.id}`,
        'sengi-document-operation-type': result.isNew ? 'create' : 'update'
      },
      statusCode: 204
    })
  } catch (err) {
    applyErrorToHttpResponse(props.req, props.res, { err })
  }
}
