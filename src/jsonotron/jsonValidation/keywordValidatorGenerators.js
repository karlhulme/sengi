/**
 * Returns a function that examines a data argument and determines
 * whether it is an acceptable type given the keyword value.
 * @param {Object} keywordValue The value (object, string, etc) supplied
 * to the keyword property in the schema.
 * @param {Object} parentSchema The parent schema.
 */
const typeOfValidatorGenerator = (keywordValue, parentSchema) => {
  return data => String(typeof data) === keywordValue
}

module.exports = {
  typeOfValidatorGenerator
}
