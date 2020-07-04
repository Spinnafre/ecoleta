import knex from '../database/connections'
import { Request, Response } from 'express'

class PointController {
    async index(req: Request, res: Response) {
        const { city, uf, items } = req.query
        // console.log(city, uf, items)

        const perseItems = String(items)
            .split(',')
            .map(itemSplit => Number(itemSplit.trim()))

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', perseItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        const serializedIPoints = points.map(points => {
            return {
                ...points,
                image_url: `http://192.168.1.3:300/uploads/${points.image}`
            }
        })

        return res.json(points)
    }
    async show(req: Request, res: Response) {
        const { id } = req.params

        const point = await knex('points').where('id', id).first()

        if (!point) {
            return res.status(400).json({ message: 'Point not found.' })
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title')

        const serializedIPoint =  {
                ...point,
                image_url: `http://192.168.1.3:300/uploads/${point.image}`
        }


        return res.json({ point:serializedIPoint, items })
    }
    async create(req: Request, res: Response) {

        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body

        // Transaction irá tratar evitar que uma operação com erro seja aceita e execute o próximo passo mesmo errado.
        // Se der error em uma não irá executar a próxima, evitando armazenar no banco de dados valores não suportados.
        const trx = await knex.transaction()

        // Insere no ponto de Coletas as informações necessárias
        console.log(req.file.filename)
        const point = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        }
        const insertedId = await trx('points').insert(point)

        // Vou pegar is items cadastrados e armazenar no banco de items
        const point_id = insertedId[0]
        const pointItems = items.split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id,
                }
            })

        await trx('point_items').insert(pointItems)

        // Toda vez que eu for usar as transactions, tenho que usar o commit no final de tudo
        // Para realizar os inserts
        await trx.commit()

        // Estou enviando como resposta um arquivo json com o id 
        return res.json({ id: point_id, ...point })
    }
}
export default PointController