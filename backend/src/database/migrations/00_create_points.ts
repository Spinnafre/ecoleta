import Knex from 'knex'
// O uso de schemas é uma boa prática para organizar a estrutura e as permissões de um banco de dados SQL Server.

// Método UP deve ser usado para Criar Tabela
export async function up(knex:Knex){
    return knex.schema.createTable('points',table=>{
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable(); 
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable(); 
        table.string('uf',2).notNullable(); 

    })
}
// Criado para voltar atrás
export async function down(knex: Knex){
    knex.schema.dropTable('points');
}