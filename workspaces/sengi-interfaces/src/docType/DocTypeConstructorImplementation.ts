import { DocFragment } from '../doc'

// return is unknown so that we can treat the implementation as untrusted.
export type DocTypeConstructorImplementation = (ctorParams: DocFragment, mergeParams: DocFragment) => unknown
