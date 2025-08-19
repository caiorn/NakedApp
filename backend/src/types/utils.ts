// Utility type que força o TypeScript a expandir as propriedades no IntelliSense no onHover do mouse sobre type,interface...
export type Expand<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
  ? { [K in keyof T]: T[K] }
  : T;

export type EntityResult<
  TEntity, 
  TColumns extends readonly (keyof TEntity)[]
> = Expand<Pick<TEntity, TColumns[number]>>;