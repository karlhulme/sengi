export interface DocTypePolicy {
  canDeleteDocuments: boolean
  canFetchWholeCollection: boolean
  canReplaceDocuments: boolean
  maxOpsSize: number
}
