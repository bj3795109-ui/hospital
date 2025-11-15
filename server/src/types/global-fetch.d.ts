// Minimal global fetch type declarations to satisfy TypeScript in Node runtime
type RequestInfo = any
type RequestInit = any
type Response = any
declare function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>

export {}