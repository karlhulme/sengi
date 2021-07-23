import { ensureHeaderJsonAcceptType, ensureDocTypeFromSingularOrPluralName, ensureHeaderApiKey, ensureQueryFieldNames } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { SengiExpressDocIdNotFoundError } from '../errors'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a get document request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function getDocumentHandler<RequestProps, DocStoreOptions, Filter, Query, QueryResult> (props: RequestHandlerProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult>): Promise<void> {
  try {
    ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

    const docType = ensureDocTypeFromSingularOrPluralName(props.docTypes, props.matchedResource.urlParams['docTypeSingularOrPluralName'])
    const fieldNames = ensureQueryFieldNames(props.req.query.fields)
    const apiKey = ensureHeaderApiKey(props.req.headers[HttpHeaderNames.ApiKey])
    const id = props.matchedResource.urlParams['id']

    const result = await props.sengi.selectDocumentsByIds({
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      fieldNames,
      ids: [id],
      reqProps: props.reqProps,
      apiKey
    })

    if (result.docs.length === 0) {
      throw new SengiExpressDocIdNotFoundError(id)
    }

    applyResultToHttpResponse(props.res, {
      headers: {
        'sengi-document-operation-type': 'read'
      },
      json: { doc: result.docs[0] },
      statusCode: 200
    })
  } catch (err) {
    applyErrorToHttpResponse(props.req, props.res, { err })
  }
}
