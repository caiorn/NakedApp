/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary(); // Identificador primário
    table.string('name', 150).notNullable(); // Dados principais
    table.string('email', 254).notNullable().unique();
    table.string('login', 50).notNullable().unique();
    table.string('password', 60).notNullable();
    table.string('avatar', 255);
    table.string('phone', 30); // Campo opcional
    table.enum('status', ['active', 'inactive', 'blocked']).defaultTo('active'); // Status do usuário
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now()); // Auditoria SOX
    table.integer('created_by').references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE');
    table.timestamp('updated_at');
    table.integer('updated_by').references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE');
    table.timestamp('deleted_at');
    table.integer('deleted_by').references('id').inTable('users').onDelete('SET NULL').onUpdate('CASCADE');
  });

  // Exigido por SOX para rastrear alterações em dados sensíveis
  await knex.schema.createTable("_audit_logs_change", (table) => {
    table.increments("id").primary(); // Identificador primário
    table.integer("user_id"); // ID do usuário que realizou a ação
    table.string("user_name").notNullable(); // quem realizou a ação ou origem (ex: SYSTEM)
    table.string("table_name").notNullable(); // Nome da tabela afetada (ex: users)
    table.integer("record_id").notNullable(); // ID do registro afetado
    table.string("action").notNullable(); // CREATE, UPDATE, DELETE
    table.jsonb("old_data"); // Dados antes da mudança
    table.jsonb("new_data"); // Dados após a mudança
    table.string("change_reason"); // Motivo da alteração (campo adicional)
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Data e hora da ação

    table.foreign("user_id").references("id").inTable("users") // Renomeado de performed_by_id
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable('_audit_user_activity', (table) => {
    table.increments('id').primary(); // Identificador primário
    table.integer('user_id');// ID do usuário que executou a ação 
    table.string("user_name").notNullable(); // Nome do usuário que executou a ação ou SYSTEM
    table.string('action_type').notNullable(); // Tipo de ação (ex: login, logout, update_profile)
    table.string('action_description').notNullable(); // Descrição da ação (ex: "Usuário fez login")
    table.jsonb('action_metadata'); // Detalhes adicionais da ação (ex: IP, user_agent, etc.)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now()); // Hora da ação (renomeado de performed_at)

    table.foreign("user_id").references("id").inTable("users") // usuário que executou a ação
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
  });

  await knex.schema.createTable('_sys_logs', (table) => {
    table.increments('id').primary(); // Identificador único
    table.string('log_type').notNullable(); // Tipo de log (ex.: error, query, info)
    table.text('message').notNullable(); // Mensagem descritiva
    table.jsonb('metadata').defaultTo(null); // Informações adicionais (ex.: IP, user agent)
    table.enum('severity', ['low', 'medium', 'high', 'critical']).defaultTo('low'); table.integer('actor_id').references('id').inTable('users').onDelete('SET NULL'); // Usuário ou sistema que gerou o log
    table.string('source').defaultTo('application'); // Origem do log
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now()); // Data e hora do log
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('users', () => {
    console.log('Table users dropped');
  });
  await knex.schema.dropTableIfExists('_audit_logs_change', () => {
    console.log('Table logs_change dropped');
  });
  await knex.schema.dropTableIfExists('_audit_user_activity', () => {
    console.log('Table logs_user_activity dropped');
  });
  await knex.schema.dropTableIfExists('_sys_logs', () => {
    console.log('Table sys_logs dropped');
  });
};

/* Regras de Negócio
Devem ser preenchidos pelo sistema, não devem ser preenchidos manualmente.
  last_login_at:
  - Deve ser atualizado sempre que o usuário fizer login no sistema.
  - Quando nulo, indicará primeiro login do usuário então deve alterar sua senha.
  created_at e updated_at:
  - created_at deve ser preenchido automaticamente com a data e hora de criação do usuário.
  - updated_at deve ser atualizado automaticamente sempre que o usuário sofrer updated.
  deleted_at:
  - Deve ser preenchido com a data e hora de exclusão lógica do usuário.
  - Deve ser nulo se o usuário não estiver excluído.
  - Deve ser atualizado automaticamente pelo sistema, não deve ser preenchido manualmente.
  created_by e updated_by:
  - Devem ser preenchidos com o identificador do usuário que criou e atualizou o registro, respectivamente.
  - Devem ser preenchidos automaticamente pelo sistema, não devem ser preenchidos manualmente.
  - Podem ser nulos se o usuário não estiver logado ou se a informação não estiver disponível.
*/
