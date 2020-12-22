import { Doc, DocFragment } from '../doc'

// return is unknown so that we can treat the implementation as untrusted.
export type DocTypeOperationImplementation = (doc: Doc, inputs: DocFragment) => unknown
