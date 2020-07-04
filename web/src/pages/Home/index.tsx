import React from 'react'
import {FiLogIn} from 'react-icons/fi'
import {Link} from 'react-router-dom'

import logo from '../../assets/logo.svg'
import './home.css'


const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="" />

                </header>

                <main>
                    <h1>Marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coletas de resíduos.</p>
                    
                    <Link to="/create-point">
                        <span>
                            <FiLogIn/>
                        </span>
                        <strong>Cadastrar um ponto</strong>
                    </Link>
                </main>

            </div>
        </div>
    )
}
export default Home