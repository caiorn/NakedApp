/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('login').notNullable();
    table.string('password').notNullable();
    table.timestamps(true, true); //created_at and updated_at
    table.timestamp('deleted_at').nullable().defaultTo(null);
    table.string('created_by').notNullable();
    table.string('updated_by').notNullable();
    table.string('deleted_by').nullable().defaultTo(null);
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
};


