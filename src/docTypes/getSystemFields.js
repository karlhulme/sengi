/**
 * These are the fields that must be on any document that is passed
 * to the document store.  Most of these properties will be saved as is.
 * However, upon saving, the document store may drop the docVersion
 * as the underlying database may assign something at write-time.
 */
module.exports = () => ['id', 'docType', 'docVersion', 'docOps', 'docCalcs']
