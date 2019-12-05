jsonotron
=========
entryPointTests should test happy and error routes with mocked doc store
jsonotron end-to-end tests for input validation and happy route (to check it actually connects to the internal functions)
handling deleted fields on update (strip automatically?)
drop builtin doctypes?

jsonotron-apollo
================
export to graph ql config
runtime for apollo

jsonotron-express
=================
export to swagger
support for multiple queries
handlers for the incoming routes (as done now)
support for roles/keys/user handling (post authentication)

jsonotron-cosmos
================
onUpsert - delete docVersion because eTag will get set automatically
onFetch/Query - populate docVersion with eTag
implementation of the doc store interface so it works with azure cosmos
add support for limit param on queries
