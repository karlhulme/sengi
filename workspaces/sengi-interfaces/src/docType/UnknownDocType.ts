/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocType } from './DocType'

/**
 * Represents a doc type where the specific types used for
 * the query, filter and doc store options do not need
 * to be known.
 */
export type UnknownDocType = DocType<any, any, any, any, any>
