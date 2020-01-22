jsonotron
=========
onUpdate hook function (diffPatch) that runs after patch or operation to allow for
  removal of deprecated fields
  setting the initial value of new fields (possibly based on deprecated fields)
  appending to a history field
execute all calculated fields and store them in a docLastCalcs object
store lastDocTypeVersion to indicate the version of the doc-type at the moment of saving?
ensuring any required system fields can be added, rather than just failing validation
support for paging large responses
