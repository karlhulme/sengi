import { RequestHandlerProps } from './RequestHandlerProps'

export type RequestHandler<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult> = (props: RequestHandlerProps<RequestProps, DocStoreOptions, User, Filter, Query, QueryResult>) => Promise<void>
