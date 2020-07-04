import express from 'express'
import {celebrate,Joi} from 'celebrate'
import pointControllers from './controllers/pointController'
import itemControllers from './controllers/itemsController'
import multerConfig from './config/config'
import multer from 'multer'

const routes = express.Router()
const pointControl=new pointControllers()
const itemControl=new itemControllers()
const upload=multer(multerConfig)

// Por padrão a comunidade costuma usar index,create,destroy,update,show como nomenclaturas para funções 

routes.get('/items', itemControl.index );
// Armazenar pontos de coletas: image,name,email,whatsapp,latitude,longitude,city,uf,items
routes.get('/points',pointControl.index)
routes.get('/points/:id',pointControl.show)


routes.post('/points',
upload.single('image'),
celebrate({
    body:Joi.object().keys({
        name:Joi.string().required(),
        email:Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude:Joi.number().required(),
        longitude: Joi.number().required(),
        city:Joi.string().required(),
        uf:Joi.string().required().max(2),
        items:Joi.string().required()
    }),
    
},{
    abortEarly:false
}),
pointControl.create )

export default routes