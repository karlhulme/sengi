export interface GetDocTypeAsGraphQLProps {
  docTypeName: string
  roleTypeSets: QueryableRoleTypeSet[]
}

export interface QueryableRoleTypeSet {
  suffix: string
  roleTypeNames: string[]
}