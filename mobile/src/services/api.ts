import axios from 'axios'

const api=axios.create({
    baseURL: ' http://192.168.1.3:300'
})

export default api