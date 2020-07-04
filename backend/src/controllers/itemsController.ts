import { Request, Response } from 'express'
import knex from '../database/connections'

class itemController {

    async index(req: Request, res: Response) {

        const items = await knex('items').select('*')
        // console.log(items)
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.1.3:300/uploads/${item.image}`
            }
        })


        return res.json(serializedItems)
    }
}

export default itemController