module.exports = {
  canCreate: require('./canCreate'),
  canDelete: require('./canDelete'),
  canOperate: require('./canOperate'),
  canPatch: require('./canPatch'),
  canQuery: require('./canQuery'),
  canReplace: require('./canReplace'),
  ensurePermission: require('./ensurePermission'),
  ensureRoleTypesAreValid: require('./ensureRoleTypesAreValid')
}
