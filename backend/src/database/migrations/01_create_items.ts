import Knex from 'knex'
// O uso de schemas é uma boa prática para organizar a estrutura e as permissões de um banco de dados SQL Server.

// Método UP deve ser usado para Criar Tabela
export async function up(knex: Knex) {
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();

    })
}
// Criado para voltar atrás
export async function down(knex: Knex) {
    knex.schema.dropTable('items');
}