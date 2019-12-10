module.exports = {
  name: 'paymentCardNo',
  title: 'Payment Card Number',
  description: 'A number that uniquely identifies a payment card, such as a credit or debit card.',
  examples: ['4111111111111111'],
  invalidExamples: [-1, 0, 999999, null, true, 'a house', {}, [], '1234123412341234'],
  jsonSchema: {
    type: 'string',
    format: 'custom-luhn-algorithm'
  }
}
