jsonotron
=========
get involved in meta at all? I THINK NO. add permission for accessing meta?  or just make docTypes/roleTypes gettable?
have a cleanup function that enables deprecated props to be removed/migrated that runs pre-validation+pre-save after patch or operation

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
