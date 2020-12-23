import nodeFetch, { RequestInit, Response } from 'node-fetch'
import { Doc, DocFragment } from 'sengi-interfaces'
import { SengiClientGatewayError, SengiClientInvalidInputError, SengiClientUnexpectedError, SengiClientUnrecognisedPathError } from '../errors'

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
   * Fetch a document.
   * @param docTypePluralName The plural name of a doc type.
   * @param documentId The id of the document to fetch.
   * @param fieldNames An array of field names.
   */
  async getDocumentById (docTypePluralName: string, documentId: string, fieldNames: string[]): Promise<Doc> {
    const url = `${this.url}docs/${docTypePluralName}/${documentId}?fields=${fieldNames.join(',')}`

    const result = await this.retryableFetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-ROLE-NAMES': this.roleNames.join(',')
      }
    })

    switch (result.status) {
      case 200: {
        const json = await result.json()

        /* istanbul ignore next */
        if (json.deprecations && Object.keys(json.deprecations).length > 0) {
          console.warn(json.deprecations)
        }

        return json.doc
      }
      case 400: throw new SengiClientInvalidInputError(await result.text())
      case 404: throw new SengiClientUnrecognisedPathError(url)
      case 503: throw new SengiClientGatewayError()
      default: throw new SengiClientUnexpectedError(`${result.status}: ${await result.text()}`)
    }
  }

  /**
   * Saves a new document.  The given document must have an id set.
   * @param docTypePluralName The plural name of a doc type.
   * @param requestorUserId The id of the user making the request.
   * @param doc A document with an id.
   */
  async saveNewDocument (docTypePluralName: string, doc: Doc): Promise<void> {
    const url = `${this.url}docs/${docTypePluralName}`

    if (typeof doc.id !== 'string') {
      throw new Error('Document must have id.')
    }

    const result = await this.retryableFetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-ROLE-NAMES': this.roleNames.join(','),
        'X-REQUEST-ID': doc.id as string
      },
      body: JSON.stringify(doc)
    })

    switch (result.status) {
      case 201: return
      case 400: throw new SengiClientInvalidInputError(await result.text())
      case 404: throw new SengiClientUnrecognisedPathError(url)
      case 503: throw new SengiClientGatewayError()
      default: throw new SengiClientUnexpectedError(`${result.status}: ${await result.text()}`)
    }
  }

  /**
   * Operates on an existing document.
   * @param docTypePluralName The plural name of a doc type.
   * @param requestorUserId The id of the user making the request.
   * @param operationId The id of the operation that is used to ensure each operation is applied only once.
   * @param documentId The id of the document to operate on.
   * @param operationName The name of the operation to invoke.
   * @param params The parameters required by the operation.
   */
  async operateOnDocument (docTypePluralName: string, operationId: string, documentId: string, operationName: string, params: DocFragment): Promise<void> {
    const url = `${this.url}docs/${docTypePluralName}/${documentId}:${operationName}`

    const result = await this.retryableFetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-ROLE-NAMES': this.roleNames.join(','),
        'X-REQUEST-ID': operationId
      },
      body: JSON.stringify(params)
    })

    switch (result.status) {
      case 204: return
      case 400: throw new SengiClientInvalidInputError(await result.text())
      case 404: throw new SengiClientUnrecognisedPathError(url)
      case 503: throw new SengiClientGatewayError()
      default: throw new SengiClientUnexpectedError(`${result.status}: ${await result.text()}`)
    }
  }
}
