export interface AuditEntity  {
  created_at: Date;
  created_by: number;
  updated_at?: Date | null;  
  updated_by?: number | null;
  deleted_at?: Date | null;
  deleted_by?: number | null;
}

// Utility type que força o TypeScript a expandir as propriedades no IntelliSense no onHover do mouse sobre type,interface...
export type Expand<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
  ? { [K in keyof T]: T[K] }
  : T;

// Campos que o BD preenche automaticamente 
export type AutoFields = "id" | "created_at" | "updated_at" | "deleted_at";

// Campos obrigatórios para inserção
export type InsertEntity<T extends AuditEntity> = Expand<
  Omit<T, AutoFields | "created_by" | "updated_by" | "deleted_by"> & {
    created_by: number;
  }
>;

// Campos obrigatórios para atualização
export type UpdateEntity<T extends AuditEntity> = Expand<
  Partial<Omit<T, AutoFields | "created_by" | "updated_by" | "deleted_by">> & {
    updated_by: number;
  }
>;
export type EntityColumn<T> = Expand<keyof T>;