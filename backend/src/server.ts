import express from 'express'
import path from 'path'
import Routes from './Routes'
import cors from 'cors'
const port = 300
import {errors} from 'celebrate'
const app = express()
// Params id: Pegar informações da rota
// Params query : Opcional, pega info das rotas em formato de query - bom para filtrar ou pegar algum tipo de lista especifica
app.use(cors())
app.use(express.json())
app.use(Routes)
// express static é usado para servir imagens, arquivos css etc. No exemplo código abaixo eu pego todas as imagens de uploads
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads'))) 
app.use(errors())

app.listen(port, (err) => {
    console.log(`endereço: http://localhost:${port}`)
})

