import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import api from '../../services/api'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'
import Logo from '../../assets/logo.svg'
import './point.css'
import Dropzone from '../../components/Dropzone'

// Representação do formato dos parâmetro que irá receber
interface Items {
    id: number,
    title: string,
    image_url: string
}

interface IBGEresponse {
    sigla: string
}
interface IBGEnomeResponse {
    nome: string
}

// Array ou Objetos tem que especificar manualmente os tipos das variáveis
const Point = () => {
    const [Items, setItems] = useState<Items[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [selectedImg, setSelectedImg] = useState<File>()

    const [cities, setCities] = useState<string[]>([])
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const [selectedItem, SetSelectedItem] = useState<number[]>([])
    const [selectedPositon, SetSelectedPositon] = useState<[number, number]>([0, 0])
    const [InitialPosition, SetInitialPosition] = useState<[number, number]>([0, 0])

    const [selectedUF, setSelectedUF] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')

    useEffect(() => {
        api.get('items').then(resp => {
            setItems(resp.data)
        })
    }, [])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            SetInitialPosition([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        axios.get<IBGEresponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(resp => {
            const ufInitials = resp.data.map(uf => uf.sigla)
            setUfs(ufInitials)
        })
    }, [])

    useEffect(() => {
        if (selectedUF === '0') {
            return;
        }
        axios.get<IBGEnomeResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(resp => {
            const cityNames = resp.data.map(city => city.nome)
            setCities(cityNames)
        })

    }, [selectedUF])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        console.log('UF selecionada')
        const uf = event.target.value
        setSelectedUF(uf)
    }
    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        console.log('CIDADE SELECIONADA')
        const selectedCity = event.target.value
        setSelectedCity(selectedCity)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        console.log('Mapa selecionado com click')
        SetSelectedPositon(
            [event.latlng.lat,
            event.latlng.lng]
        )
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target
        console.log('Input Acionado')
        setFormData({ ...formData, [name]: value })
    }
    function handleSelectItem(id: number) {
        console.log('Item selecionado')
        // FindIndex pega o índice da primeira ocorrência
        const alreadySelected = selectedItem.findIndex(item => item === id)

        // Se tiver items com id repetidos, ou seja, selecionei o mesmo item mais de uma vez
        // Irá filtrar os items com id diferentes do que eu selecionei
        if (alreadySelected >= 0) {
            const filteredItems = selectedItem.filter(item => item !== id)
            SetSelectedItem(filteredItems)
        } else {

            SetSelectedItem([...selectedItem, id])
        }

    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        console.log(selectedImg)
        const { name, email, whatsapp } = formData
        const uf = selectedUF
        const city = selectedCity
        const [latitude, longitude] = selectedPositon
        const items = selectedItem

        //FormData permite enviar MultiPart
        const data = new FormData()
        data.append('name', name)
        data.append('email', email)
        data.append('whatsapp', whatsapp)
        data.append('latitude', String(latitude))
        data.append('longitude', String(longitude))
        data.append('city', city)
        data.append('uf', uf)
        data.append('items', items.join(','))

        if (selectedImg) {
            data.append('image', selectedImg)
        }


        await api.post('points', data)
        alert('Usuário Cadastrado com sucesso!!!')


    }

    return (
        <div id="page-create-point">

            <header>
                <img src={Logo} alt="Ecoleta" />
                <Link to='/'>
                    <FiArrowLeft />
                    Voltar para a página principal
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br />Ponto de Coleta</h1>

                <Dropzone onFileUpload={setSelectedImg} />

                <fieldset>

                    <legend>

                        <h2> Dados</h2>

                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>

                    </div>

                </fieldset>

                <fieldset>

                    <legend>
                        <h2> Endereço</h2>
                        <span>Selecione o Endereço no mapa</span>
                    </legend>

                    <Map center={InitialPosition} zoom={15} onclick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPositon} zoom={15} />
                    </Map>

                    <div className="field-group">

                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" onChange={handleSelectUf} value={selectedUF}>
                                <option value="0">Selecione um UF</option>

                                {ufs.map(ufs => (
                                    <option key={ufs} value={ufs}> {ufs}</option>
                                ))}

                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>

                            <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity} >
                                <option value="0">Selecione uma Cidade</option>

                                {cities.map(city => (
                                    <option key={city} value={city}> {city}</option>
                                ))}
                            </select>

                        </div>

                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione os itens de coleta</span>
                    </legend>

                    <ul className="items-grid">
                        {Items.map(item => (
                            <li className={selectedItem.includes(item.id) ? 'selected' : ''} key={item.id} onClick={() => handleSelectItem(item.id)}>
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>

                </fieldset>

                <button type='submit'>
                    Cadastrar Produto
                </button>

            </form>

        </div>
    )
}

export default Point