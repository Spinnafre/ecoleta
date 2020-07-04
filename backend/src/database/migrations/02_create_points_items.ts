import Knex from 'knex'
// O uso de schemas é uma boa prática para organizar a estrutura e as permissões de um banco de dados SQL Server.

// Método UP deve ser usado para Criar Tabela
export async function up(knex: Knex) {
    return knex.schema.createTable('point_items', table => {

        table.increments('id').primary();
        table.integer('point_id')
        .notNullable()
        .references('id')
        .inTable('points');


        table.integer('item_id')
        .notNullable()
        .references('id')
        .inTable('items');

    })
}
// Criado para voltar atrás
export async function down(knex: Knex) {
    knex.schema.dropTable('point_items');
}