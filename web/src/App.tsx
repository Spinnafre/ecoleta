import React from 'react';

import './App.css';

/* Para fazer roteamento é necessário instalar o react-router-dom, com ele você pegar o 
Route, BrowseRoute e o Link (Evitar com que a página carregue do zero - SPA)
*/

import Routes from './routes'
function App() {
  return (
    <div >
      <Routes/>
    </div>
  )
}

export default App;
