/**
 * Returns a JSON schema document.
 * @param {Object} props.docType A document type.
 * @param {String} props.section A value of 'fields', 'constructorParams', 'operationParams' or 'mergePatch'.
 * @param {String} [props.target] If section is 'operationParams' then this parameter must name an
 * operation on the given document type.
 */
const createJsonSchema = ({ docType, schemaType, target }) => {
  return {
    schema: {},
    example: {} // or seperate example?
  }
}

module.exports = createJsonSchema
