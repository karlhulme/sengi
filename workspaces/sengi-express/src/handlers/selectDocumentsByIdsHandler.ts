import { ensureHeaderJsonAcceptType, ensureDocTypeFromPluralName, ensureHeaderRoleNames, ensureQueryFieldNames, ensureQueryIds } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a query documents by ids request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function selectDocumentsByIdsHandler<RequestProps, DocStoreOptions, Filter, Query, QueryResult> (props: RequestHandlerProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult>): Promise<void> {
  try {
    ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

    const docType = ensureDocTypeFromPluralName(props.docTypes, props.matchedResource.urlParams['docTypePluralName'])
    const fieldNames = ensureQueryFieldNames(props.req.query.fields)
    const roleNames = ensureHeaderRoleNames(props.req.headers[HttpHeaderNames.RoleNames])
    const ids = ensureQueryIds(props.req.query.ids)

    const result = await props.sengi.selectDocumentsByIds({
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      fieldNames,
      ids,
      reqProps: props.reqProps,
      roleNames
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
