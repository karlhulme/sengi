export interface DocOp {
  opId: string
  style: 'operation'|'patch'
  operationName?: string
}
