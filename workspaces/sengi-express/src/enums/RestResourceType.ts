export enum RestResourceType {
  /* No match */
  NO_MATCH,

  /* Global root, aka Mount point */
  GLOBAL_ROOT,

  /* Doc resources */
  DOCUMENTS_ROOT,
  COLLECTION,
  DOCUMENT,
  OPERATION,

  /* Schema resources */
  SCHEMAS_ROOT,
  ENUM_TYPES_ROOT,
  ENUM_TYPE,
  SCHEMA_TYPES_ROOT,
  SCHEMA_TYPE,
  DOC_TYPES_ROOT,
  DOC_TYPE
}
