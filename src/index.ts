export interface KissRouteRequestHandler {
    (request: Request): Response
}

export interface KissRoutePaths {
    [path: string]: KissRouteRequestHandler
}

export interface KissRouteTable {
    [method: string]: KissRoutePaths|KissRouteRequestHandler
}

declare type KissRouteMethodEntry = [string, KissRouteRequestHandler]

export function buildRouter (handlers: KissRouteTable, invalidHandler: KissRouteRequestHandler|undefined) {
    const h = invalidHandler === undefined ? _standardHandler : invalidHandler
    return createMethodHandler(buildMethodMap(handlers, h), h)
}

function buildMethodMap(routeTable: KissRouteTable, invalidHandler: KissRouteRequestHandler) {
    return new Map(Object.entries(routeTable).map(v =>
        [
            v[0].toLowerCase(),
            typeof v[1] === 'object'
                ? createRouteMethodHandler(buildPathMap(v[1]), invalidHandler)
                : v[1]
        ] as KissRouteMethodEntry
    ))
}

const buildPathMap = (o: KissRoutePaths)=>
    new Map(Object.entries(o).map(k => [k[0].toLowerCase(), k[1]]))

const createRouteMethodHandler = (paths: Map<string, KissRouteRequestHandler>, invalidHandler: KissRouteRequestHandler) : KissRouteRequestHandler =>
    (request:Request) => {
        const path = new URL(request.url).pathname.split('/')
        const handler = (path.length > 2 && paths.get(path[2])) || invalidHandler
        return handler(request)
    }

const createMethodHandler = (methods: Map<string, KissRouteRequestHandler>, invalidHandler: KissRouteRequestHandler) =>
    (request:Request) : Response => {
        const handler = (request.method && methods.get(request.method.toLowerCase())) || invalidHandler
        return handler(request)
    }

const _standardHandler = (req: Request) => Response.error()
