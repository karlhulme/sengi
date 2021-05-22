import { RequestHandlerProps } from './RequestHandlerProps'

export type RequestHandler<RequestProps, DocStoreOptions, Filter, Query, QueryResult> = (props: RequestHandlerProps<RequestProps, DocStoreOptions, Filter, Query, QueryResult>) => Promise<void>
