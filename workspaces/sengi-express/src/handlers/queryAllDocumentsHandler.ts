import { ensureHeaderJsonAcceptType, ensureDocTypeFromPluralName, ensureHeaderRoleNames, ensureQueryFieldNames, ensureQueryLimit, ensureQueryOffset } from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a query all documents request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function queryAllDocumentsHandler (props: RequestHandlerProps): Promise<void> {
  try {
    ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

    const docType = ensureDocTypeFromPluralName(props.docTypes, props.matchedResource.urlParams['docTypePluralName'])
    const fieldNames = ensureQueryFieldNames(props.req.query.fields)
    const roleNames = ensureHeaderRoleNames(props.req.headers[HttpHeaderNames.RoleNames])
    const limit = ensureQueryLimit(props.req.query.limit)
    const offset = ensureQueryOffset(props.req.query.offset)

    const result = await props.sengi.queryDocuments({
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      fieldNames,
      limit,
      offset,
      reqProps: props.reqProps,
      roleNames
    })

    applyResultToHttpResponse(props.res, {
      headers: {
        'sengi-document-operation-type': 'read'
      },
      json: { docs: result.docs, deprecations: result.deprecations },
      statusCode: 200
    })
  } catch (err) {
    applyErrorToHttpResponse(props.res, { err })
  }
}
