import React from 'react'
import {Route,BrowserRouter} from 'react-router-dom'
import Home from './pages/Home'
import PointColeta from './pages/PontoColeta/pointColeta'
const Rotas=()=>{
    return(
        <BrowserRouter>
            <Route component={Home} path='/' exact />
            <Route component={PointColeta} path='/create-point'/>
        </BrowserRouter>
    )
}

export default Rotas
