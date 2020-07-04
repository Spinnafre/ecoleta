import axios from 'axios'

// Url básico da página do backend
const api=axios.create({
    baseURL:' http://localhost:300'
})

export default api