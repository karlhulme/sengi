import nodeFetch, { RequestInit, Response } from 'node-fetch'
import { Doc, DocFragment, DocPatch } from 'sengi-interfaces'
import {
  SengiClientGatewayError,
  SengiClientInvalidInputError,
  SengiClientRequiredVersionNotAvailableError,
  SengiClientUnexpectedError,
  SengiClientUnrecognisedPathError
} from '../errors'

/**
 * The retry intervals between subsequent requests to the Sengi service
 * that uses exponential backoff.
 */
const DEFAULT_RETRY_INTERVALS = [100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000]

export type FetchFunc = (url: string, init: RequestInit) => Promise<Response>

/**
 * Represents the constructor properties of the Sengi client.
 */
interface SengiClientConstructorProps {
  /**
   * A function for making a fetch request.
   * If not supplied, the 'node-fetch' library is used instead.
   */
  fetch?: FetchFunc

  /**
   * The role name used to access the Sengi service.
   */
  roleNames?: string[]

  /**
   * An array of intervals before retrying failed requests.
   */
  retryIntervals?: number[]

  /**
   * The url of a Sengi service.  This value must be supplied.
   */
  url?: string
}

/**
 * A client for communicating with a Sengi service.
 */
export class SengiClient {
  fetch: FetchFunc
  roleNames: string[]
  retryIntervals: number[]
  url: string

  /**
   * Creates a new Sengi client.
   * @param props The properties to use to construct the client.
   */
  constructor (props?: SengiClientConstructorProps) {
    if (typeof props !== 'object') {
      throw new Error('A constructor props object must be supplied.')
    }

    if (!props.url) {
      throw new Error('A url must be supplied.')
    }

    if (!Array.isArray(props.roleNames) || props.roleNames.length === 0) {
      throw new Error('A roleNames array must be supplied.')
    }

    this.fetch = props.fetch || nodeFetch
    this.roleNames = props.roleNames
    this.retryIntervals = props.retryIntervals || DEFAULT_RETRY_INTERVALS
    this.url = `${props.url}${props.url.endsWith('/') ? '' : '/'}`
  }

  /**
   * Returns a promise that resolves after the given number of milliseconds.
   * @param milliseconds A number of milliseconds.
   */
  private async wait (milliseconds: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, milliseconds)
    })
  }

  /**
   * Invokes the fetch function and automatically retries if the
   * response status is transient.
   * @param url The url of the endpoint to fetch from.
   * @param fetchParams The parameters to be passed to the fetch function.
   */
  private async retryableFetch (url: string, fetchParams: RequestInit): Promise<Response> {
    let lastResult = null
    let lastError = null

    for (let i = 0; i <= this.retryIntervals.length; i++) {
      if (i > 0) {
        await this.wait(this.retryIntervals[i - 1])
      }

      try {
        lastResult = await this.fetch(url, fetchParams)

        // 429 - too many requests
        // 503 - gateway unavailable
        if (![429, 503].includes(lastResult.status)) {
          return lastResult
        }
      } catch (err) {
        lastError = err
      }
    }

    // if there's no 'lastResult' then we received an error every time
    if (!lastResult) {
      throw lastError
    }

    return lastResult
  }

  /**
   * Generates a client error based on the response.
   * @param url The url originally requested.
   * @param result The result of the request.
   */
  private async generateError (url: string, result: Response): Promise<Error> {
    switch (result.status) {
      case 400: return new SengiClientInvalidInputError(await result.text())
      case 404: return new SengiClientUnrecognisedPathError(url)
      case 412: return new SengiClientRequiredVersionNotAvailableError()
      case 503: return new SengiClientGatewayError()
      default: return new SengiClientUnexpectedError(`${result.status}: ${await result.text()}`)
    }
  }

  /**
   * Creates a new document using a doc type constructor.
   * @param docTypePluralName The plural name of a doc type.
   * @param newDocumentId The id for the new document.
   * @param constructorParams The parameters for the constructor (and any updatable fields).
   */
  async createDocument ({ docTypePluralName, newDocumentId, constructorParams }: { docTypePluralName: string; newDocumentId: string; constructorParams: DocFragment }): Promise<void> {
    const url = `${this.url}${docTypePluralName}`

    const result = await this.retryableFetch(url, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'x-role-names': this.roleNames.join(','),
        'x-request-id': newDocumentId
      },
      body: JSON.stringify(constructorParams)
    })

    if (result.status !== 201) {
      const err = await this.generateError(url, result)
      throw err
    }
  }

  /**
   * Delete a document.
   * @param docTypePluralName The plural name of a doc type.
   * @param documentId The id of the document to delete.
   */
  async deleteDocumentById ({ docTypePluralName, documentId }: { docTypePluralName: string; documentId: string }): Promise<void> {
    const url = `${this.url}${docTypePluralName}/${documentId}`

    const result = await this.retryableFetch(url, {
      method: 'delete',
      headers: {
        'content-type': 'application/json',
        'x-role-names': this.roleNames.join(',')
      }
    })

    if (result.status !== 204) {
      const err = await this.generateError(url, result)
      throw err
    }
  }

  /**
   * Fetch a document.
   * @param docTypePluralName The plural name of a doc type.
   * @param documentId The id of the document to fetch.
   * @param fieldNames An array of field names.
   */
  async getDocumentById ({ docTypePluralName, documentId, fieldNames }: { docTypePluralName: string; documentId: string; fieldNames: string[] }): Promise<Doc> {
    const url = `${this.url}${docTypePluralName}/${documentId}?fields=${fieldNames.join(',')}`

    const result = await this.retryableFetch(url, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'x-role-names': this.roleNames.join(',')
      }
    })

    if (result.status === 200) {
      const json = await result.json()

      /* istanbul ignore next */
      if (json.deprecations && Object.keys(json.deprecations).length > 0) {
        console.warn(json.deprecations)
      }

      return json.doc
    } else {
      const err = await this.generateError(url, result)
      throw err
    }
  }

  /**
   * Operates on an existing document.
   * @param docTypePluralName The plural name of a doc type.
   * @param operationId The id of the operation that is used to ensure each operation is applied only once.
   * @param documentId The id of the document to operate on.
   * @param operationName The name of the operation to invoke.
   * @param operationParams The parameters required by the operation.
   * @param reqVersion If supplied, the document must have this document version or the operation will not be invoked.
   */
  async operateOnDocument ({ docTypePluralName, operationId, documentId, operationName, operationParams, reqVersion }: { docTypePluralName: string; operationId: string; documentId: string; operationName: string; operationParams: DocFragment, reqVersion?: string }): Promise<void> {
    const url = `${this.url}${docTypePluralName}/${documentId}:${operationName}`

    const optionalHeaders: Record<string, string> = {}
    if (reqVersion) { optionalHeaders['if-match'] = reqVersion }

    const result = await this.retryableFetch(url, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        'x-role-names': this.roleNames.join(','),
        'x-request-id': operationId,
        ...optionalHeaders
      },
      body: JSON.stringify(operationParams)
    })

    if (result.status !== 204) {
      const err = await this.generateError(url, result)
      throw err
    }
  }

  /**
   * Patches an existing document.
   * @param docTypePluralName The plural name of a doc type.
   * @param operationId The id of the operation that is used to ensure each operation is applied only once.
   * @param documentId The id of the document to operate on.
   * @param patch The merge patch to apply to the document.
   * @param reqVersion If supplied, the document must have this document version or the patch will not be applied.
   */
  async patchDocument ({ docTypePluralName, operationId, documentId, patch, reqVersion }: { docTypePluralName: string; operationId: string; documentId: string; patch: DocPatch, reqVersion?: string }): Promise<void> {
    const url = `${this.url}${docTypePluralName}/${documentId}`

    const optionalHeaders: Record<string, string> = {}
    if (reqVersion) { optionalHeaders['if-match'] = reqVersion }

    const result = await this.retryableFetch(url, {
      method: 'patch',
      headers: Object.assign({
        'content-type': 'application/json',
        'x-role-names': this.roleNames.join(','),
        'x-request-id': operationId,
        ...optionalHeaders
      }),
      body: JSON.stringify(patch)
    })

    if (result.status !== 204) {
      const err = await this.generateError(url, result)
      throw err
    }
  }

  /**
   * Query for all documents of a type.
   * @param docTypePluralName The plural name of a doc type.
   * @param fieldNames An array of field names.
   */
  async queryAllDocuments ({ docTypePluralName, fieldNames }: { docTypePluralName: string; fieldNames: string[] }): Promise<Doc[]> {
    const url = `${this.url}${docTypePluralName}?fields=${fieldNames.join(',')}`

    const result = await this.retryableFetch(url, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'x-role-names': this.roleNames.join(',')
      }
    })

    if (result.status === 200) {
      const json = await result.json()

      /* istanbul ignore next */
      if (json.deprecations && Object.keys(json.deprecations).length > 0) {
        console.warn(json.deprecations)
      }

      return json.docs
    } else {
      const err = await this.generateError(url, result)
      throw err
    }
  }

  /**
   * Query for documents using a filter.
   * @param docTypePluralName The plural name of a doc type.
   * @param filterName The name of a filter.
   * @param filterParams The parameters of a filter.
   * @param fieldNames An array of field names.
   */
  async queryDocumentsByFilter ({ docTypePluralName, filterName, filterParams, fieldNames }: { docTypePluralName: string; filterName: string; filterParams: Record<string, unknown>; fieldNames: string[] }): Promise<Doc[]> {
    const url = `${this.url}${docTypePluralName}?filterName=${filterName}&filterParams=${JSON.stringify(filterParams)}&fields=${fieldNames.join(',')}`

    const result = await this.retryableFetch(url, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'x-role-names': this.roleNames.join(',')
      }
    })

    if (result.status === 200) {
      const json = await result.json()

      /* istanbul ignore next */
      if (json.deprecations && Object.keys(json.deprecations).length > 0) {
        console.warn(json.deprecations)
      }

      return json.docs
    } else {
      const err = await this.generateError(url, result)
      throw err
    }
  }

    /**
   * Query for documents using an array of ids.
   * @param docTypePluralName The plural name of a doc type.
   * @param documentIds An array of document ids.
   * @param fieldNames An array of field names.
   */
  async queryDocumentsByIds ({ docTypePluralName, documentIds, fieldNames }: { docTypePluralName: string; documentIds: string[]; fieldNames: string[] }): Promise<Doc[]> {
    const url = `${this.url}${docTypePluralName}?ids=${documentIds.join(',')}&fields=${fieldNames.join(',')}`

    const result = await this.retryableFetch(url, {
      method: 'get',
      headers: {
        'content-type': 'application/json',
        'x-role-names': this.roleNames.join(',')
      }
    })

    if (result.status === 200) {
      const json = await result.json()

      /* istanbul ignore next */
      if (json.deprecations && Object.keys(json.deprecations).length > 0) {
        console.warn(json.deprecations)
      }

      return json.docs
    } else {
      const err = await this.generateError(url, result)
      throw err
    }
  }

  /**
   * Inserts a new document (without calling the constructor) or replaces an existing document.
   * @param docTypePluralName The plural name of a doc type.
   * @param doc The document to be upserted.
   */
  async upsertDocument ({ docTypePluralName, document }: { docTypePluralName: string; document: Doc }): Promise<void> {
    if (typeof document.id !== 'string') {
      throw new Error('Document must have id.')
    }

    const url = `${this.url}${docTypePluralName}/${document.id}`

    const result = await this.retryableFetch(url, {
      method: 'put',
      headers: {
        'content-type': 'application/json',
        'x-role-names': this.roleNames.join(','),
        'x-request-id': document.id
      },
      body: JSON.stringify(document)
    })

    if (result.status !== 204) {
      const err = await this.generateError(url, result)
      throw err
    }
  }
}
