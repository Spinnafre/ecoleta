import knex from 'knex'
import path from 'path'
// knex server para vários bancos SQL : sqlite, mySql...
const connection=knex({
    client:'sqlite3',
    connection:{
        // path resolve serve para unir rotas
        filename:path.resolve(__dirname,'database.sqlite')
    },
    useNullAsDefault:true


})

export default connection

// Migrations : Hirstórico de banco dd dados