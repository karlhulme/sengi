const convertErrorsToHttpStatusCodes = requestHandler => async (req, res) => {
  try {
    await requestHandler(req, res)
  } catch (err) {
    // if err instanceof KnownErrorType then, otherwise 500
    res.status(500).send(err.toString())
  }
}

module.exports = convertErrorsToHttpStatusCodes
