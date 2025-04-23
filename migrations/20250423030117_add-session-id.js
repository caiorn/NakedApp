/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.uuid('session_id').nullable().defaultTo(null).after('id').index();
  });
  console.log('Column session_id added to users table');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.alterTable('users', (table) => {
      table.dropColumn('session_id');
    }
    );
    console.log('Column session_id removed from users table');
};
