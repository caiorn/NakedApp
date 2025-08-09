export interface BaseEntity {
  id: number;
  created_at: Date;
  created_by?: number | null;
  updated_at?: Date | null;  
  updated_by?: number | null;
  deleted_at?: Date | null;
  deleted_by?: number | null;
}

// Campos que o BD preenche automaticamente 
export type AutoFields = "id" | "created_at" | "updated_at" | "deleted_at";

// Campos obrigatórios para inserção
export type InsertEntity<T extends BaseEntity> = Omit<T, AutoFields | "updated_by" | "deleted_by"> & {
  created_by: number;
};

// Campos obrigatórios para atualização
export type UpdateEntity<T extends BaseEntity> = Partial<Omit<T, AutoFields | "created_by" | "deleted_by">> & {
  updated_by: number;
};

export type EntityColumn<T> = keyof T | '*';