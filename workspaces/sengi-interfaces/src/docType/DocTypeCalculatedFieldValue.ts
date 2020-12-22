import { DocFragment } from '../doc'

// return is unknown so that we can treat the implementation as untrusted.
export type DocTypeCalculatedFieldValue = (inputs: DocFragment) => unknown
