import {
  ensureHeaderJsonAcceptType, ensureDocTypeFromSingularOrPluralName, ensureHeaderRoleNames,
  ensureQueryFieldNames, ensureQueryLimit, ensureQueryOffset,
  ensureQueryFilterName, ensureQueryFilterParams
} from '../requestValidation'
import { applyErrorToHttpResponse, applyResultToHttpResponse } from '../responseGeneration'
import { HttpHeaderNames } from '../utils'
import { RequestHandlerProps } from './RequestHandlerProps'

/**
 * Handles a query documents by filter request and produces a response. 
 * @param props Properties for handling the request.
 */
export async function selectDocumentsByFilterHandler<RequestProps, DocStoreOptions, Filter, Query, QueryResult> (props: RequestHandlerProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult>): Promise<void> {
  try {
    ensureHeaderJsonAcceptType(props.req.headers[HttpHeaderNames.AcceptType])

    const docType = ensureDocTypeFromSingularOrPluralName(props.docTypes, props.matchedResource.urlParams['docTypeSingularOrPluralName'])
    const fieldNames = ensureQueryFieldNames(props.req.query.fields)
    const roleNames = ensureHeaderRoleNames(props.req.headers[HttpHeaderNames.RoleNames])
    const limit = ensureQueryLimit(props.req.query.limit)
    const offset = ensureQueryOffset(props.req.query.offset)
    const filterName = ensureQueryFilterName(props.req.query.filterName)
    const filterParams = ensureQueryFilterParams(props.req.query.filterParams)

    const result = await props.sengi.selectDocumentsByFilter({
      docStoreOptions: props.docStoreOptions,
      docTypeName: docType.name,
      fieldNames,
      filterName,
      filterParams,
      limit,
      offset,
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
